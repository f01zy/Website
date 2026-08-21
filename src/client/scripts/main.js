import { start_image_animation } from "./animation.js";
import { cleanup_active_project, load_project, load_projects } from "./projects.js";
import { load_posts, load_post, init_post_form } from "./posts.js";
import { configure_footer } from "./footer.js";
import { configure_links } from "./links.js";
import { show_element, get_fade_duration } from "./utils.js";

const home_section = document.querySelector(".home");
const page_wrapper = document.querySelector(".page-wrapper");
const not_found_section = document.querySelector(".not-found");
const go_back_button = not_found_section.querySelector(".back-link");
const new_post_section = document.querySelector(".new-post");

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
    path: "/",
    action: () => {
      show_element(home_section);
      configure_links();
      start_image_animation();
    },
  },
  { path: "/projects", action: () => load_projects() },
  {
    path: /^\/projects\/([a-zA-Zа-яА-ЯёЁ0-9_-]+)\/?$/,
    action: async (match) => await load_project(match[1]),
  },
  {
    path: "/posts/new",
    action: () => {
      show_element(new_post_section);
      init_post_form();
    },
  },
  { path: "/posts", action: async () => await load_posts() },
  {
    path: /^\/posts\/([a-zA-Zа-яА-ЯёЁ0-9_-]+)\/?$/,
    action: async (match) => await load_post(match[1]),
  },
];

cleanup_active_project();
let route_triggered = false;
(async () => {
  for (const route of routes) {
    if (route.path instanceof RegExp) {
      const match = pathname.match(route.path);
      if (match) {
        await route.action(match);
        route_triggered = true;
        break;
      }
    } else if (route.path === pathname) {
      await route.action();
      route_triggered = true;
      break;
    }
  }

  if (!route_triggered) show_element(not_found_section);
  configure_footer();
})();
