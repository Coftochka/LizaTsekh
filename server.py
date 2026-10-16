#!/usr/bin/env python3
"""HTTPS backend and access logger for the portfolio static site."""

from __future__ import annotations

import argparse
import json
import os
import socket
import ssl
import threading
import time
from datetime import datetime, timezone
from functools import partial
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from uuid import uuid4


PROJECT_ROOT = Path(__file__).resolve().parent
URL_PREFIX = "/portfolio"
DEFAULT_PORT = 443
DEFAULT_CERT_DIR = "/etc/letsencrypt/live/lizatsekh.ru"
DEFAULT_CLIENT_TIMEOUT = 15.0
ACCESS_LOG_PATH = Path(os.environ.get("PORTFOLIO_ACCESS_LOG", PROJECT_ROOT / "access.log.jsonl"))
LOG_LOCK = threading.Lock()


def write_access_log(event: str, **fields: object) -> None:
    """Append one structured event without allowing logging failures to stop HTTP."""
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event": event,
        **fields,
    }
    try:
        with LOG_LOCK, ACCESS_LOG_PATH.open("a", encoding="utf-8") as log_file:
            log_file.write(json.dumps(record, ensure_ascii=False, separators=(",", ":")) + "\n")
    except OSError as error:
        print(f"Access-log write failed: {error}")



class PortfolioHandler(SimpleHTTPRequestHandler):
    """Serve only files below /portfolio/ from this project directory."""

    server_version = "PortfolioHTTPS/1.0"

    def __init__(self, *args, directory: str, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def handle_one_request(self) -> None:
        self._request_started_at = time.perf_counter()
        self._status: int | None = None
        self._bytes_sent = 0
        self._public_path = "-"
        self._active_session_id: str | None = None
        self._request_logged = False
        try:
            super().handle_one_request()
        finally:
            # `command` is set only after a valid HTTP request was parsed.
            if getattr(self, "command", None) and not self._request_logged:
                self._request_logged = True
                elapsed_ms = round((time.perf_counter() - self._request_started_at) * 1000, 2)
                write_access_log(
                    "request",
                    session_id=self._active_session_id or self._get_session_id(),
                    remote_ip=self.client_address[0],
                    method=self.command,
                    path=self._public_path,
                    status=self._status,
                    bytes_sent=self._bytes_sent,
                    duration_ms=elapsed_ms,
                    user_agent=self.headers.get("User-Agent", "")[:512],
                )

    def send_response(self, code: int, message: str | None = None) -> None:
        self._status = int(code)
        super().send_response(code, message)

    def end_headers(self) -> None:
        session_id = getattr(self, "_new_session_id", None)
        if session_id:
            self.send_header("Set-Cookie", f"portfolio_session={session_id}; Path={URL_PREFIX}/; Secure; HttpOnly; SameSite=Lax")
            self._new_session_id = None
        super().end_headers()

    def copyfile(self, source, outputfile) -> None:
        """Stream static files and retain the number of successfully written bytes."""
        while chunk := source.read(64 * 1024):
            outputfile.write(chunk)
            self._bytes_sent += len(chunk)

    def handle(self) -> None:
        """Ignore a client that disconnects while a static file is sent.

        Browsers may cancel image/video requests when a page reloads or closes.
        For HTTPS Python otherwise prints a full SSLEOFError traceback, although
        the server itself remains healthy.
        """
        try:
            super().handle()
        except (
            BrokenPipeError,
            ConnectionAbortedError,
            ConnectionResetError,
            socket.timeout,
            ssl.SSLError,
        ):
            pass

    def _prepare_path(self) -> bool:
        path = urlsplit(self.path).path
        self._public_path = path
        if path == URL_PREFIX:
            self.send_response(HTTPStatus.MOVED_PERMANENTLY)
            self.send_header("Location", f"{URL_PREFIX}/")
            self.end_headers()
            return False
        if path == f"{URL_PREFIX}/":
            self._start_session_if_needed()
            self.path = f"{URL_PREFIX}/index.html"
        elif not path.startswith(f"{URL_PREFIX}/"):
            self.send_error(HTTPStatus.NOT_FOUND, "Use /portfolio/")
            return False

        # Remove the public prefix before SimpleHTTPRequestHandler maps it to a
        # local file. Its built-in normalisation also rejects ../ traversal.
        self.path = self.path[len(URL_PREFIX):]
        return True

    def _get_session_id(self) -> str | None:
        try:
            cookies = SimpleCookie(self.headers.get("Cookie", ""))
            session = cookies.get("portfolio_session")
            if session and len(session.value) == 32 and session.value.isalnum():
                return session.value
        except (KeyError, ValueError):
            pass
        return None

    def _start_session_if_needed(self) -> None:
        if self._get_session_id():
            return
        session_id = uuid4().hex
        self._new_session_id = session_id
        self._active_session_id = session_id
        write_access_log(
            "session_start",
            session_id=session_id,
            remote_ip=self.client_address[0],
            path=f"{URL_PREFIX}/",
            user_agent=self.headers.get("User-Agent", "")[:512],
        )

    def do_GET(self) -> None:
        if not self._prepare_path():
            return
        super().do_GET()

    def do_HEAD(self) -> None:
        if not self._prepare_path():
            return
        super().do_HEAD()

    def do_POST(self) -> None:
        path = urlsplit(self.path).path
        self._public_path = path
        if path != f"{URL_PREFIX}/__session":
            self.send_error(HTTPStatus.NOT_FOUND, "Not found")
            return

        try:
            size = min(int(self.headers.get("Content-Length", "0")), 4096)
        except ValueError:
            size = 0
        payload: dict[str, object] = {}
        if size:
            try:
                payload = json.loads(self.rfile.read(size).decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                pass

        duration_ms = payload.get("duration_ms")
        if not isinstance(duration_ms, (int, float)) or not 0 <= duration_ms <= 7 * 24 * 60 * 60 * 1000:
            duration_ms = None
        write_access_log(
            "session_end",
            session_id=self._get_session_id(),
            remote_ip=self.client_address[0],
            duration_ms=duration_ms,
            reason=payload.get("reason", "unknown"),
        )
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def log_message(self, fmt: str, *args: object) -> None:
        print(f"{self.log_date_time_string()} {self.client_address[0]} {fmt % args}")


class ThreadingHTTPSServer(ThreadingHTTPServer):
    """Threaded HTTPS server which cannot block accepts on a slow TLS peer."""

    def __init__(
        self,
        server_address: tuple[str, int],
        request_handler,
        *,
        ssl_context: ssl.SSLContext,
        client_timeout: float,
    ) -> None:
        super().__init__(server_address, request_handler)
        self.ssl_context = ssl_context
        self.client_timeout = client_timeout

    def get_request(self):
        """Accept TCP quickly; let the handler thread perform the TLS handshake.

        Wrapping the listening socket makes ``accept()`` complete the TLS
        handshake in the main serving thread. A client that opens a TCP socket
        and sends no TLS bytes can then prevent every later client from being
        accepted. Deferring that handshake also lets the socket timeout close
        such incomplete connections.
        """
        raw_socket, client_address = super().get_request()
        raw_socket.settimeout(self.client_timeout)
        try:
            secure_socket = self.ssl_context.wrap_socket(
                raw_socket,
                server_side=True,
                do_handshake_on_connect=False,
            )
        except OSError:
            raw_socket.close()
            raise
        return secure_socket, client_address


def create_server(
    host: str, port: int, cert_dir: Path, client_timeout: float
) -> ThreadingHTTPSServer:
    cert_file = cert_dir / "fullchain.pem"
    key_file = cert_dir / "privkey.pem"
    missing = [str(path) for path in (cert_file, key_file) if not path.is_file()]
    if missing:
        raise FileNotFoundError("SSL certificate file not found: " + ", ".join(missing))

    handler = partial(PortfolioHandler, directory=str(PROJECT_ROOT))
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    context.load_cert_chain(certfile=cert_file, keyfile=key_file)
    server = ThreadingHTTPSServer(
        (host, port),
        handler,
        ssl_context=context,
        client_timeout=client_timeout,
    )
    server.daemon_threads = True
    return server


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve this portfolio over HTTPS.")
    parser.add_argument("--host", default=os.environ.get("PORTFOLIO_HOST", "0.0.0.0"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORTFOLIO_PORT", DEFAULT_PORT)))
    parser.add_argument("--cert-dir", type=Path, default=Path(os.environ.get("SSL_CERT_PATH", DEFAULT_CERT_DIR)))
    parser.add_argument(
        "--client-timeout",
        type=float,
        default=float(os.environ.get("PORTFOLIO_CLIENT_TIMEOUT", DEFAULT_CLIENT_TIMEOUT)),
        help="seconds allowed for TLS, request reads, and response writes (default: %(default)s)",
    )
    args = parser.parse_args()
    if args.client_timeout <= 0:
        parser.error("--client-timeout must be greater than zero")

    server = create_server(args.host, args.port, args.cert_dir, args.client_timeout)
    print(f"Portfolio backend: https://{args.host}:{args.port}{URL_PREFIX}/")
    print(f"Access log: {ACCESS_LOG_PATH}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
