import { config, json_response } from "../config.js";

async function get_steam_activity() {
  if (!config.STEAM_API_KEY || !config.STEAM_ID) return null;

  const res = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_API_KEY}&steamids=${config.STEAM_ID}`);
  if (!res.ok) return null;

  const data = await res.json();
  const player = data.response?.players?.[0];

  if (player && player.gameextrainfo) {
    return {
      source: "steam",
      is_activity: true,
      title: player.gameextrainfo,
      game_url: `https://store.steampowered.com/app/${player.gameid}/`,
      persona_name: player.personaname,
    };
  }

  return null;
}

async function get_spotify_activity() {
  if (!config.BASIC_AUTH || !config.SPOTIFY_REFRESH_TOKEN) return null;

  const token_res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${config.BASIC_AUTH}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: config.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!token_res.ok) return null;
  const { access_token } = await token_res.json();
  const spotify_res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (spotify_res.status === 204 || spotify_res.status > 400) return null;
  const song = await spotify_res.json();
  if (!song.is_playing || !song.item) return null;

  const item = song.item;
  return {
    source: "spotify",
    is_activity: true,
    title: item.name,
    song_url: item.external_urls.spotify,
    artists: item.artists.map((a) => ({
      name: a.name,
      url: a.external_urls.spotify,
    })),
  };
}

export async function handle_activity(req, method) {
  if (method !== "GET") return null;

  try {
    const [steam_result, spotify_result] = await Promise.allSettled([get_steam_activity(), get_spotify_activity()]);
    const steam_data = steam_result.status === "fulfilled" ? steam_result.value : null;
    const spotify_data = spotify_result.status === "fulfilled" ? spotify_result.value : null;

    if (steam_data) {
      return json_response(steam_data);
    }
    if (spotify_data) {
      return json_response(spotify_data);
    }
    return json_response({ is_playing: false });
  } catch (err) {
    return json_response({ error: err.message }, 500);
  }
}
