import { handle_activity } from "./routes/activity.js";
import { handle_upload } from "./routes/upload.js";
import { handle_posts } from "./routes/posts.js";
import { handle_projects } from "./routes/projects.js";

export async function handle_api(req, url) {
  const pathname = decodeURIComponent(url.pathname);
  const method = req.method;

  if (pathname === "/api/activity") {
    return await handle_activity(req, method);
  }

  if (pathname === "/api/upload") {
    return await handle_upload(req, method);
  }

  if (pathname === "/api/posts" || pathname.startsWith("/api/posts/")) {
    return await handle_posts(req, method, pathname);
  }

  if (pathname === "/api/projects") {
    return await handle_projects(req, method);
  }

  return null;
}
