import { Database } from "bun:sqlite";
import { join } from "path";

export const config = {
  LISTEN_BRAINZ_USERNAME: Bun.env.LISTEN_BRAINZ_USERNAME,
  ADMIN_PASSWORD: Bun.env.ADMIN_PASSWORD,
  PORT: Bun.env.PORT,
  BASIC_AUTH: btoa(`${Bun.env.SPOTIFY_CLIENT_ID}:${Bun.env.SPOTIFY_CLIENT_SECRET}`),
  ROOT_DIR: join(import.meta.dir, "..", ".."),
};

export const db = new Database("db.db");

export const json_response = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
