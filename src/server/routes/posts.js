import { config, db, json_response } from "../config.js";

export async function handle_posts(req, method, pathname) {
  if (pathname === "/api/posts" && method === "POST") {
    try {
      const form_data = await req.formData();
      const title = form_data.get("title")?.toString().trim();
      const preview = form_data.get("preview")?.toString().trim();
      const content = form_data.get("content")?.toString().trim();
      const tags = form_data.get("tags")?.toString().trim();
      const password = form_data.get("password");

      if (!password || password !== config.ADMIN_PASSWORD) {
        return json_response({ error: "The passwords don't match" }, 403);
      }

      if (!title || !preview || !content) {
        return json_response({ error: "All fields are required" }, 400);
      }

      if (title.length > 150 || preview.length > 500 || content.length > 50000) {
        return json_response({ error: "Content length limit exceeded" }, 400);
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9а-яё\s]/g, "")
        .replace(/\s+/g, "-");

      const query = db.prepare(`
        INSERT INTO posts (title, slug, preview, content, tags) 
        VALUES (?, ?, ?, ?, ?)
      `);
      query.run(title, slug, preview, content, tags);

      return json_response({ success: true }, 201);
    } catch (err) {
      console.error(err);
      return json_response({ error: "Invalid Data or DB error" }, 400);
    }
  }

  if (pathname === "/api/posts" && method === "GET") {
    const posts = db.prepare("SELECT title, slug, preview, tags, created_at FROM posts ORDER BY created_at DESC").all();
    return json_response(posts);
  }

  if (pathname.startsWith("/api/posts/") && method === "GET") {
    const slug = pathname.replace("/api/posts/", "");
    const post = db.prepare("SELECT * FROM posts WHERE slug = ?").get(slug);
    if (!post) return json_response({ error: "Post not found" }, 404);
    return json_response(post);
  }

  return null;
}
