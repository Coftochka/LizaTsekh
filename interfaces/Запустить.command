#!/bin/zsh
cd -- "${0:A:h}"
open "http://localhost:8765/"
python3 -m http.server 8765 --bind 127.0.0.1
