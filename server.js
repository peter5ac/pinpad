const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 8000);
const PUBLIC_DIR = path.join(__dirname, "public");
const INDEX_FILE = path.join(PUBLIC_DIR, "index.html");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".yaml": "application/x-yaml; charset=utf-8",
  ".yml": "application/x-yaml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not Found");
        return;
      }
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Internal Server Error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": ext === ".yaml" || ext === ".yml" ? "no-store" : "public, max-age=3600"
    });
    res.end(data);
  });
}

function safePublicPath(requestPath) {
  const normalized = path.normalize(requestPath).replace(/^([.][./\\])+/, "");
  const filePath = path.join(PUBLIC_DIR, normalized);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return null;
  }
  return filePath;
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  const isDoorRoute = /^\/(door|d)\/.+/.test(pathname);
  const isRoot = pathname === "/";

  if (isRoot || isDoorRoute) {
    sendFile(res, INDEX_FILE);
    return;
  }

  const requestedPath = pathname.replace(/^\//, "");
  const filePath = safePublicPath(requestedPath);

  if (!filePath) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad Request");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // Unknown paths fall back to app shell so deep links still work.
      sendFile(res, INDEX_FILE);
      return;
    }
    sendFile(res, filePath);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Door server running on http://localhost:${PORT}`);
  console.log(`LAN access: http://${HOST === "0.0.0.0" ? "<your-local-ip>" : HOST}:${PORT}`);
  console.log("Door routes:");
  console.log(`  http://localhost:${PORT}/door/<door-slug>`);
  console.log(`  http://localhost:${PORT}/?door=<door-slug>`);
});
