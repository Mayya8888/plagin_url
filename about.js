(() => {
  const section = document.querySelector(".about");
  const intro = section.querySelector(".about-intro");
  const scene = intro.querySelector(".about-scene");
  const card = section.querySelector(".about-card");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  function paint() {
    frame = 0;
    const distance = intro.offsetHeight - scene.offsetHeight;
    const scroll = -intro.getBoundingClientRect().top;
    const progress = distance > 0 && !reducedMotion.matches ? Math.max(0, Math.min(1, scroll / distance)) : 0;
    section.style.setProperty("--about-progress", progress);
    if (reducedMotion.matches || (progress >= 0.6 && card.getBoundingClientRect().top < innerHeight - 32)) {
      card.classList.add("is-revealed");
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(paint);
  }

  section.classList.add("is-animated");
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("pageshow", schedule);
  reducedMotion.addEventListener("change", schedule);
  paint();
})();
