const project_container = document.querySelector(".project");
let instance = null;

export const mount_wasm_project = async (project_name) => {
  try {
    const canvas = document.createElement("canvas");
    canvas.id = "project-canvas";
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    const module_factory = await import(`/projects/${project_name}/${project_name}.js`);
    const create_module = module_factory.default;

    instance = await create_module({
      canvas: canvas,
      locateFile: (path) => `/projects/${project_name}/${path}`,
    });

    project_container.append(canvas);
  } catch (err) {
    throw err;
  }
};

export const unmount_wasm_project = () => {
  if (instance) {
    if (instance._cleanup_game) {
      instance._cleanup_game();
    }
    const canvas = instance.canvas || document.querySelector("#project-canvas");
    if (canvas) {
      canvas.remove();
    }
    instance = null;
  }
};
