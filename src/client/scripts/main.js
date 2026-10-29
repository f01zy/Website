import { create_image_animation } from "./animation.js";
import { cleanup_active_project, load_project, load_projects } from "./projects.js";
import { load_posts, load_post, init_post_form } from "./posts.js";
import { configure_footer } from "./footer.js";
import { configure_links } from "./links.js";
import { show_element, get_fade_duration, set_title, is_mobile_device } from "./utils.js";
import { black_hole } from "./arts.js";

const home_section = document.querySelector(".home");
const page_wrapper = document.querySelector(".page-wrapper");
const not_found_section = document.querySelector(".not-found");
const go_back_button = not_found_section.querySelector(".back-link");
const new_post_section = document.querySelector(".new-post");
const filters_containers = document.querySelectorAll(".filters-container");

const yo_span = document.querySelector("#yo");
const birthday = new Date(2010, 2, 2);
const update_yo = () => {
  const now = new Date();
  const diff = now - birthday;
  if (diff < 0) {
    yo_span.textContent = "Unknown";
    return;
  }
  const years = diff / 31536000000;
  yo_span.textContent = `${Math.floor(years)}`;
};

go_back_button.addEventListener("click", () => history.back());

const sound = new Audio("/assets/click.mp3");
document.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  event.preventDefault();
  page_wrapper.classList.add("fade-out");

  const fade_promise = new Promise((resolve) => setTimeout(resolve, get_fade_duration()));
  const audio_promise = new Promise((resolve) => {
    sound.addEventListener("ended", resolve, { once: true });
    sound.play().catch(resolve);
  });

  Promise.all([fade_promise, audio_promise]).then(() => {
    window.location.href = link.href;
  });
});

for (const filters_container of filters_containers) {
  filters_container.addEventListener("wheel", (event) => {
    event.preventDefault();
    filters_container.scrollLeft += event.deltaY;
  });
}

if (typeof marked !== "undefined") {
  if (typeof markedKatex !== "undefined") {
    marked.use(markedKatex({ throwOnError: false }));
  }

  if (typeof markedHighlight !== "undefined" && typeof hljs !== "undefined") {
    marked.use(
      markedHighlight.markedHighlight({
        emptyLangClass: "hljs",
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, { language }).value;
        },
      }),
    );
  }
}

const pathname = decodeURIComponent(window.location.pathname);
const routes = [
  {
    title: "Home",
    path: "/",
    action: () => {
      if (!is_mobile_device()) {
        const canvas = document.createElement("canvas");
        home_section.prepend(canvas);
        const animation = create_image_animation({
          image: black_hole,
          font_size: 10,
          char_space_x: 4,
          char_space_y: 4,
          image_offset_x: 25,
          image_offset_y: 0,
          spring_coefficient: 150,
          particle_weight: 1.0,
          mouse_radius: 100,
          mouse_power: 12000,
          friction: 0.85,
          fill_style: "#fafafa",
          font_family: "Cormorant Garamond",
        });
        animation.start(canvas);
      }
      show_element(home_section);
      configure_links();
    },
  },
  {
    title: "Projects",
    path: "/projects",
    action: () => load_projects(),
  },
  {
    title: "Project",
    path: /^\/projects\/([a-zA-Zа-яА-ЯёЁ0-9_-]+)\/?$/,
    action: async (match) => await load_project(match[1]),
  },
  {
    title: "New post",
    path: "/posts/new",
    action: () => {
      show_element(new_post_section);
      init_post_form();
    },
  },
  {
    title: "Posts",
    path: "/posts",
    action: async () => await load_posts(),
  },
  {
    title: "Post",
    path: /^\/posts\/([a-zA-Zа-яА-ЯёЁ0-9_-]+)\/?$/,
    action: async (match) => await load_post(match[1]),
  },
];

cleanup_active_project();
update_yo();

let route_triggered = false;
(async () => {
  for (const route of routes) {
    if (route.path instanceof RegExp) {
      const match = pathname.match(route.path);
      if (match) {
        set_title(route.title);
        await route.action(match);
        route_triggered = true;
        break;
      }
    } else if (route.path === pathname) {
      set_title(route.title);
      await route.action();
      route_triggered = true;
      break;
    }
  }

  if (!route_triggered) show_element(not_found_section);
  configure_footer();
})();
