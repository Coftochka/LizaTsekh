#!/usr/bin/env python3
"""HTTPS backend for the portfolio static site.

The public URL is intended to be https://<domain>:8443/portfolio/.  Since
ports 80, 443 and 8080 are already occupied, this process listens directly on
a separate HTTPS port and needs no Nginx or other proxy.
"""

from __future__ import annotations

import argparse
import os
import ssl
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit


PROJECT_ROOT = Path(__file__).resolve().parent
URL_PREFIX = "/portfolio"
DEFAULT_PORT = 443
DEFAULT_CERT_DIR = "/etc/letsencrypt/live/s883238.foxcdn.net"


class PortfolioHandler(SimpleHTTPRequestHandler):
    """Serve only files below /portfolio/ from this project directory."""

    server_version = "PortfolioHTTPS/1.0"

    def __init__(self, *args, directory: str, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def _prepare_path(self) -> bool:
        path = urlsplit(self.path).path
        if path == URL_PREFIX:
            self.send_response(HTTPStatus.MOVED_PERMANENTLY)
            self.send_header("Location", f"{URL_PREFIX}/")
            self.end_headers()
            return False
        if path == f"{URL_PREFIX}/":
            self.path = f"{URL_PREFIX}/index.html"
        elif not path.startswith(f"{URL_PREFIX}/"):
            self.send_error(HTTPStatus.NOT_FOUND, "Use /portfolio/")
            return False

        # Remove the public prefix before SimpleHTTPRequestHandler maps it to a
        # local file. Its built-in normalisation also rejects ../ traversal.
        self.path = self.path[len(URL_PREFIX):]
        return True

    def do_GET(self) -> None:
        if not self._prepare_path():
            return
        super().do_GET()

    def do_HEAD(self) -> None:
        if not self._prepare_path():
            return
        super().do_HEAD()

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.log_date_time_string()} {self.client_address[0]} {fmt % args}")


def create_server(host: str, port: int, cert_dir: Path) -> ThreadingHTTPServer:
    cert_file = cert_dir / "fullchain.pem"
    key_file = cert_dir / "privkey.pem"
    missing = [str(path) for path in (cert_file, key_file) if not path.is_file()]
    if missing:
        raise FileNotFoundError("SSL certificate file not found: " + ", ".join(missing))

    handler = partial(PortfolioHandler, directory=str(PROJECT_ROOT))
    server = ThreadingHTTPServer((host, port), handler)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.load_cert_chain(certfile=cert_file, keyfile=key_file)
    server.socket = context.wrap_socket(server.socket, server_side=True)
    return server


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve this portfolio over HTTPS.")
    parser.add_argument("--host", default=os.environ.get("PORTFOLIO_HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORTFOLIO_PORT", DEFAULT_PORT)))
    parser.add_argument("--cert-dir", type=Path, default=Path(os.environ.get("SSL_CERT_PATH", DEFAULT_CERT_DIR)))
    args = parser.parse_args()

    server = create_server(args.host, args.port, args.cert_dir)
    print(f"Portfolio backend: https://{args.host}:{args.port}{URL_PREFIX}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
