import { config, json_response } from "../config.js";
import { write } from "bun";
import { mkdir } from "fs/promises";
import { join } from "path";

export const handle_upload = async (req, method) => {
  if (method !== "POST") return null;

  try {
    const form_data = await req.formData();
    const file = form_data.get("files");
    const password = form_data.get("password");

    if (password !== config.ADMIN_PASSWORD) {
      return json_response({ error: "Forbidden" }, 403);
    }

    if (!file || file.size === 0) {
      return json_response({ error: "No file provided" }, 400);
    }

    const upload_dir = join(import.meta.dir, "..", "..", "..", "assets", "uploads");
    await mkdir(upload_dir, { recursive: true });
    const file_name = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    await write(join(upload_dir, file_name), file);
    return json_response({ url: `/assets/uploads/${file_name}` }, 200);
  } catch (err) {
    console.error(err);
    return json_response({ error: "Upload failed" }, 500);
  }
};
