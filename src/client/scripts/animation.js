import { image } from "./art.js";

const canvas_width = window.innerWidth;
const canvas_height = 300;
const font_size = 10;
const char_space_x = 4;
const char_space_y = 4;
const image_offset_x = 25;
const image_offset_y = 0;

const spring_coefficient = 150;
const particle_weight = 1.0;
const mouse_radius = 100;
const mouse_power = 12000;
const friction = 0.85;

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const particles = [];
let last_time = 0;
let cursor_x = 0;
let cursor_y = 0;

document.addEventListener("mousemove", (ev) => {
  const rect = canvas.getBoundingClientRect();
  cursor_x = ev.clientX - rect.left;
  cursor_y = ev.clientY - rect.top;
});

const loop = (curr_time) => {
  if (!last_time) last_time = curr_time;
  const delta_time = (curr_time - last_time) / 1000;
  last_time = curr_time;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fafafa";
  ctx.font = `${font_size}px Cormorant Garamond`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  particles.forEach((particle) => {
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
    particle.velocity_x = (particle.velocity_x + acceleration_x * delta_time) * friction;
    particle.velocity_y = (particle.velocity_y + acceleration_y * delta_time) * friction;
    particle.x += particle.velocity_x * delta_time;
    particle.y += particle.velocity_y * delta_time;
    ctx.fillText(particle.char, particle.x, particle.y);
  });

  requestAnimationFrame(loop);
};

export const start_image_animation = () => {
  if (particles.length > 0) return;
  canvas.width = canvas_width;
  canvas.height = canvas_height;
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
      if (char != " ") {
        const target_x = start_x + j * char_width;
        const target_y = start_y + i * char_height;
        particles.push({
          char,
          x: target_x,
          y: target_y,
          target_x,
          target_y,
          velocity_x: 0,
          velocity_y: 0,
        });
      }
    }
  });

  requestAnimationFrame(loop);
};
