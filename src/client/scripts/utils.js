const domain = "f01zy.xyz";

export const set_title = (title) => (document.title = `f01zy • ${title}`);

export const show_element = (element) => {
  element.classList.add("fade-in");
  element.classList.remove("none");
};

export const get_fade_duration = () => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--speed-fade").trim();
  if (raw.endsWith("ms")) return parseFloat(raw);
  if (raw.endsWith("s")) return parseFloat(raw) * 1000;
  return parseFloat(raw) || 0;
};

export const create_card = (title_text, link_url, description_text, tags, parent_container) => {
  const container = document.createElement("div");
  container.classList.add("block");
  container.dataset.tags = tags ? tags.toLowerCase() : "";

  const title = document.createElement("a");
  title.textContent = title_text;
  title.href = link_url;
  title.target = link_url.startsWith(`https://${domain}`) ? "_self" : "_blank";

  const description = document.createElement("p");
  let clean_description = description_text;
  if (typeof DOMPurify !== "undefined") {
    clean_description = DOMPurify.sanitize(description_text);
  }
  description.innerHTML = clean_description;
  container.append(title, description);

  if (tags && tags.trim() !== "") {
    const tags_container = document.createElement("div");
    tags_container.classList.add("tags");
    tags.split(",").forEach((text) => {
      const tag = document.createElement("span");
      tag.classList.add("tag");
      tag.textContent = text.trim();
      tags_container.append(tag);
    });
    container.append(tags_container);
  }
  parent_container.append(container);
};
