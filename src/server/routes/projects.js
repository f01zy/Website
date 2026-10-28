import { db, json_response } from "../config.js";

export const handle_projects = async (req, method) => {
  if (method !== "GET") return null;
  const projects = db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all();
  return json_response(projects);
};
