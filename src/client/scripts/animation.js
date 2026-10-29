export const create_image_animation = (options = {}) => {
  const {
    image,
    font_size,
    char_space_x,
    char_space_y,
    image_offset_x,
    image_offset_y,
    spring_coefficient,
    particle_weight,
    mouse_radius,
    mouse_power,
    friction,
    fill_style,
    font_family,
  } = options;

  let canvas = null;
  let ctx = null;
  let particles = [];
  let lasttime = 0;
  let cursor_x = 0;
  let cursor_y = 0;
  let raf_id = null;
  let running = false;

  const on_mouse_move = (ev) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    cursor_x = ev.clientX - rect.left;
    cursor_y = ev.clientY - rect.top;
  };

  const loop = (currTime) => {
    if (!running) return;
    if (!lasttime) lasttime = currTime;
    const deltatime = (currTime - lasttime) / 1000;
    lasttime = currTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = fill_style;
    ctx.font = `${font_size}px ${font_family}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    for (const particle of particles) {
      const spring_dx = particle.target_x - particle.x;
      const spring_dy = particle.target_y - particle.y;
      const spring_force_x = spring_dx * spring_coefficient;
      const spring_force_y = spring_dy * spring_coefficient;
      const cursor_dx = particle.x - cursor_x;
      const cursor_dy = particle.y - cursor_y;
      const cursor_distance = Math.sqrt(cursor_dx * cursor_dx + cursor_dy * cursor_dy);

      let cursor_force_x = 0;
      let cursor_force_y = 0;

      if (cursor_distance > 0 && cursor_distance < mouse_radius) {
        const force_intensity = (mouse_radius - cursor_distance) / mouse_radius;
        cursor_force_x = (cursor_dx / cursor_distance) * force_intensity * mouse_power;
        cursor_force_y = (cursor_dy / cursor_distance) * force_intensity * mouse_power;
      }

      const total_force_x = spring_force_x + cursor_force_x;
      const total_force_y = spring_force_y + cursor_force_y;
      const acceleration_x = total_force_x / particle_weight;
      const acceleration_y = total_force_y / particle_weight;

      particle.velocity_x = (particle.velocity_x + acceleration_x * deltatime) * friction;
      particle.velocity_y = (particle.velocity_y + acceleration_y * deltatime) * friction;
      particle.x += particle.velocity_x * deltatime;
      particle.y += particle.velocity_y * deltatime;

      ctx.fillText(particle.char, particle.x, particle.y);
    }

    raf_id = requestAnimationFrame(loop);
  };

  const start = (target_canvas, width = window.innerWidth, height = 300) => {
    if (running) return;

    canvas = target_canvas;
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    particles = [];
    lasttime = 0;

    const metrics = ctx.measureText(" ");
    const char_width = metrics.width + char_space_x;
    const char_height = font_size + char_space_y;
    const max_row_length = Math.max(...image.map((row) => row.length));
    const total_image_width = max_row_length * char_width;
    const total_image_height = image.length * char_height;
    const start_x = canvas.width / 2 - total_image_width / 2 + image_offset_x;
    const start_y = canvas.height / 2 - total_image_height / 2 + image_offset_y;

    image.forEach((row, i) => {
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        if (char !== " ") {
          const target_x = start_x + j * char_width;
          const target_y = start_y + i * char_height;

          particles.push({
            char,
            x: target_x,
            y: target_y,
            target_x: target_x,
            target_y: target_y,
            velocity_x: 0,
            velocity_y: 0,
          });
        }
      }
    });

    canvas.addEventListener("mousemove", on_mouse_move);
    running = true;
    raf_id = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (raf_id) {
      cancelAnimationFrame(raf_id);
      raf_id = null;
    }
    if (canvas) {
      canvas.removeEventListener("mousemove", on_mouse_move);
    }
    particles = [];
    canvas = null;
    ctx = null;
  };

  return { start, stop };
};
