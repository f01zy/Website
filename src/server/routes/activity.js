import { config, json_response } from "../config.js";

const get_listen_brainz_activity = async () => {
  const res = await fetch(`https://api.listenbrainz.org/1/user/${config.LISTEN_BRAINZ_USERNAME}/playing-now`);
  if (!res.ok) return null;

  const data = (await res.json()).payload;
  if (!data.count) return null;

  const meta = data.listens[0].track_metadata;
  return {
    title: meta.track_name,
    album: meta.release_name,
    artist: meta.artist_name,
  };
};

export const handle_activity = async (req, method) => {
  if (method !== "GET") return null;
  try {
    const activity = await get_listen_brainz_activity();
    if (activity) return json_response({ is_activity: true, ...activity });
    return json_response({ is_activity: false });
  } catch (err) {
    return json_response({ error: err.message }, 500);
  }
};
