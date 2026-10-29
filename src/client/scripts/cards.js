import { is_mobile_device } from "./utils.js";
const domain = "f01zy.xyz";
let card;

export const rotate_to_mouse_handler = (event) => {
  if (!card) return;
  const mouse_x = event.clientX;
  const mouse_y = event.clientY;
  const bounds = card.getBoundingClientRect();
  const left = mouse_x - bounds.x;
  const top = mouse_y - bounds.y;
  const center = {
    x: left - bounds.width / 2,
    y: top - bounds.height / 2,
  };
  const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
  card.style.transform = `
    scale3d(1.04, 1.04, 1.04)
    rotate3d(
      ${center.y / 100},
      ${-center.x / 100},
      0,
      ${Math.log(distance) * 2}deg
    )
  `;
};

export const create_card = (title_text, link_url, description_text, tags, parent_container) => {
  const container = document.createElement("div");
  container.classList.add("card");
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

  if (!is_mobile_device()) {
    container.addEventListener("mouseenter", (event) => {
      card = container;
      document.addEventListener("mousemove", rotate_to_mouse_handler);
    });
    container.addEventListener("mouseleave", (event) => {
      document.removeEventListener("mousemove", rotate_to_mouse_handler);
      container.style.transform = "";
    });
  }

  parent_container.append(container);
};
