export const setup_filters = (tags_array, filters_container, list_container) => {
  filters_container.innerHTML = "";

  const apply_filter = (tag, active_btn) => {
    filters_container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    active_btn.classList.add("active");

    const cards = list_container.querySelectorAll(".card");
    cards.forEach((card) => {
      const card_tags = card.dataset.tags || "";
      if (tag === "all" || card_tags.includes(tag.toLowerCase())) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  };

  const all_btn = document.createElement("button");
  all_btn.textContent = "All";
  all_btn.classList.add("filter-btn", "active");
  all_btn.onclick = () => apply_filter("all", all_btn);
  filters_container.append(all_btn);

  tags_array.forEach((tag) => {
    if (!tag) return;
    const btn = document.createElement("button");
    btn.textContent = tag;
    btn.classList.add("filter-btn");
    btn.onclick = () => apply_filter(tag, btn);
    filters_container.append(btn);
  });
};
