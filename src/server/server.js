import { join } from "path";
import { config } from "./config.js";
import { handle_api } from "./routes.js";

Bun.serve({
  host: "127.0.0.1",
  port: config.PORT,

  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/agent") {
      const auth = req.headers.get("Authorization");
      if (auth !== `Bearer ${config.ADMIN_PASSWORD}`) {
        return new Response("Unauthorized", { status: 401 });
      }
      const success = server.upgrade(req, {
        data: { isAgent: true },
      });
      if (!success) return new Response("WebSocket upgrade failed", { status: 401 });
    }

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

  websocket: {
    open(ws) {
      console.log("The agent was connected");
    },
    message(ws, message) {
      console.log(message);
    },
    close(ws, code, reason) {
      console.log(`The agent was disconnected with ${code} code: ${reason}`);
    },
  },
});

console.log(`Server running at ${config.PORT} port`);
