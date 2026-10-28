const home_section = document.querySelector(".home");
const links_container = home_section.querySelector(".links");

const links = [
  { label: "github", href: "https://github.com/f01zy" },
  { label: "discord", href: "https://discord.com/users/858285755658666034" },
  { label: "telegram", href: "https://t.me/aminov_ali" },
  { label: "anilist", href: "https://anilist.co/user/f01zy/" },
  { label: "gpg", href: "/assets/gpg.asc" },
];

export const configure_links = () => {
  links_container.innerHTML = "";
  links.forEach((link, i) => {
    const link_element = document.createElement("a");
    const separator = document.createElement("span");
    link_element.innerText = link.label;
    link_element.href = link.href;
    link_element.target = "_blank";
    links_container.append(link_element);
    if (i < links.length - 1) {
      separator.innerText = " • ";
      links_container.append(separator);
    }
  });
};
