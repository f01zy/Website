import { create_card, show_element } from "./utils.js";
import { mount_wasm_project, unmount_wasm_project } from "./wasm.js";
import { setup_filters } from "./filters.js";

const projects_section = document.querySelector(".projects");
const projects_list = projects_section.querySelector(".blocks");
const project_filters = projects_section.querySelector(".filters-container");
const project_container = document.querySelector(".project");
const not_found_section = document.querySelector(".not-found");
const empty_section = document.querySelector(".empty");

export const cleanup_active_project = () => {
  unmount_wasm_project();
};

export const load_projects = async () => {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Fetch failed");
    const projects = await res.json();

    if (projects.length === 0) {
      show_element(empty_section);
      return;
    }

    projects_list.innerHTML = "";
    const unique_tags = new Set();

    for (const project of projects) {
      const name = project.title.toLowerCase().replace(" ", "-");
      const link = project.is_simulation ? `${window.location.origin}/projects/${name}` : project.link;
      create_card(project.title, link, project.description, project.tags, projects_list);
      if (project.tags) {
        project.tags.split(",").forEach((t) => unique_tags.add(t.trim()));
      }
    }

    setup_filters(Array.from(unique_tags), project_filters, projects_list);
    show_element(projects_section);
  } catch (err) {
    console.error(err);
    show_element(not_found_section);
  }
};

export const load_project = async (name) => {
  unmount_wasm_project();
  mount_wasm_project(name)
    .then(() => show_element(project_container))
    .catch(() => show_element(not_found_section));
};
