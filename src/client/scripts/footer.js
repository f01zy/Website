import { show_element } from "./utils.js";
const source_link = "https://github.com/f01zy/website";

export const configure_footer = async () => {
  const footer = document.querySelector("footer");
  const label = document.createElement("p");
  const source_text = `<a href="${source_link}" target="_blank">source</a>`;

  try {
    const res = await fetch("/api/activity");
    if (!res.ok) {
      label.innerHTML = source_text;
      return;
    }

    const data = await res.json();
    if (!data.is_activity) {
      label.innerHTML = source_text;
      return;
    }

    const icon = document.createElement("img");
    icon.src = "/assets/music.svg";
    label.innerHTML = `Currently listening ${data.artist} - ${data.album} - ${data.title}`;
    footer.append(icon);
  } catch (err) {
    label.innerHTML = source_text;
    console.error(err);
  } finally {
    footer.append(label);
    show_element(footer);
  }
};
