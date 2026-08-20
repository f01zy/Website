import { Database } from "bun:sqlite";
import { join } from "path";

export const config = {
  SPOTIFY_CLIENT_ID: Bun.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: Bun.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN: Bun.env.SPOTIFY_REFRESH_TOKEN,
  STEAM_API_KEY: Bun.env.STEAM_API_KEY,
  STEAM_ID: Bun.env.STEAM_ID,
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
