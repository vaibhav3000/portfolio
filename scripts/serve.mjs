/**
 * Minimal dependency-free static server for previewing the `out/` export.
 * Serves the directory with reasonable mime types and SPA-ish fallbacks.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out", import.meta.url));
const port = Number(process.env.PORT || 4321);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${port}`);
    let pathname = decodeURIComponent(url.pathname);

    // Resolve inside out/ only (no traversal)
    let filePath = resolve(join(root, normalize(pathname).replace(/^([/\\])+/, "")));
    if (!filePath.startsWith(resolve(root) + sep) && filePath !== resolve(root)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    let info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) {
      filePath = join(filePath, "index.html");
      info = await stat(filePath).catch(() => null);
    }
    if (!info && !extname(filePath)) {
      // clean-URL fallback: /foo -> foo.html
      filePath += ".html";
      info = await stat(filePath).catch(() => null);
    }
    if (!info) {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": body.length,
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" }).end(String(err));
  }
});

server.listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}`);
});
