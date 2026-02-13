const total = 40; // total falling items

for (let i = 0; i < total; i++) {
  const el = document.createElement("div");
  el.className = "emoji";

  // 10% chance for bee, 90% for sunflower
  const isBee = Math.random() < 0.3;

  const item = isBee
    ? { icon: '🐝', size: [15, 25] }   // small bees
    : { icon: '🌻', size: [35, 55] };  // bigger sunflowers

  el.textContent = item.icon;

  // random horizontal position
  el.style.left = Math.random() * 100 + "vw";

  // random size
  const size = item.size[0] + Math.random() * (item.size[1] - item.size[0]);
  el.style.fontSize = size + "px";

  // random animation duration and delay
  el.style.animationDuration = (Math.random() * 3 + 3) + "s";
  el.style.animationDelay = Math.random() * 5 + "s";

  document.body.appendChild(el);
}
