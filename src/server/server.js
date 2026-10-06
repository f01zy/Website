import { join } from "path";
import { config } from "./config.js";
import { handle_api } from "./routes.js";

Bun.serve({
  host: "127.0.0.1",
  port: config.PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const response = await handle_api(req, url);
    if (response) return response;

    const pathname = decodeURIComponent(url.pathname);
    const sub_path = pathname.replace(/\.\.\//g, "");
    const file_path = join(config.ROOT_DIR, sub_path);
    const file = Bun.file(file_path);

    if (pathname !== "/" && (await file.exists())) {
      return new Response(file);
    }
    return new Response(Bun.file(join(config.ROOT_DIR, "src", "client", "index.html")));
  },
});

console.log(`Server running at ${config.PORT} port`);
