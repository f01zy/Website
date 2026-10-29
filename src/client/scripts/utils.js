export const set_title = (title) => (document.title = `f01zy • ${title}`);

export const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

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

export const get_password = () => {
  const cookie = localStorage.getItem("password");
  if (cookie) return cookie;
  const password = prompt("Password: ");
  localStorage.setItem("password", password);
  return password;
};

export const is_mobile_device = () => {
  const userAgent = navigator.userAgent || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUA = mobileRegex.test(userAgent);
  const isTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || (isTouchScreen && isSmallScreen);
};

export const is_dev_tools_openned = () => {
  const start = performance.now();
  debugger;
  const end = performance.now();
  return end - start > 10;
};
