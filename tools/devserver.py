# Statischer Dev-Server ohne Caching: python3 tools/devserver.py [port]
import http.server, sys, functools, os
class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()
    def log_message(self, *a):
        pass
port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
handler = functools.partial(NoCache, directory=root)
http.server.ThreadingHTTPServer(('127.0.0.1', port), handler).serve_forever()
