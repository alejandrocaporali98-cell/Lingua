"""Tiny emulator of Cloudflare Pages: /x.html -> 308 /x, /x/index.html -> 308 /x/, /x serves x.html, and the headers in _headers."""
import http.server, os, sys
ROOT = sys.argv[1]; PORT = int(sys.argv[2])
HEADERS = []
try:
    lines = open(os.path.join(ROOT, "_headers")).read().splitlines()
    inside = False
    for l in lines:
        if not l.strip() or l.lstrip().startswith("#"): continue
        if not l.startswith(" "): inside = l.strip() == "/*"; continue
        if inside:
            k, v = l.strip().split(":", 1)
            # this test server is plain http, so leave out the https-only upgrade
            HEADERS.append((k.strip(), v.strip().replace("; upgrade-insecure-requests", "")))
except FileNotFoundError: pass
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a): pass
    def end_headers(self):
        for k, v in HEADERS: self.send_header(k, v)
        super().end_headers()
    def do_GET(self):
        path, _, q = self.path.partition("?"); qs = ("?" + q) if q else ""
        if path.endswith("/index.html"):
            return self.redir(path[:-10] + qs)
        if path.endswith(".html"):
            return self.redir(path[:-5] + qs)
        fs = os.path.join(ROOT, path.lstrip("/"))
        if path.endswith("/") and os.path.exists(os.path.join(fs, "index.html")):
            self.path = path + "index.html" + qs
        elif not os.path.exists(fs) and os.path.exists(fs + ".html"):
            self.path = path + ".html" + qs
        return super().do_GET()
    def redir(self, to):
        self.send_response(308); self.send_header("Location", to); self.end_headers()
http.server.ThreadingHTTPServer(("127.0.0.1", PORT), H).serve_forever()
