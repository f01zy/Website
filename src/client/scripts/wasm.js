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
  if (!instance) return;

  try {
    if (typeof instance._cleanup_game === "function") {
      instance._cleanup_game();
    }
    if (typeof instance.emscripten_cancel_main_loop === "function") {
      instance.emscripten_cancel_main_loop();
    }
  } catch (e) {
    console.warn("Failed to unmount project:", e);
  }

  const canvas = instance.canvas || document.querySelector("#project-canvas");
  if (canvas) {
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (gl) {
      const ext = gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    }
    canvas.remove();
  }

  instance = null;
};
