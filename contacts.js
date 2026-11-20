(() => {
  const contacts = document.querySelector("#contacts");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  function paint() {
    frame = 0;
    const viewportHeight = document.documentElement.clientHeight;
    const { top, height } = contacts.getBoundingClientRect();
    const start = viewportHeight * .9;
    const distance = start + Math.max(0, height - viewportHeight);
    const progress = !reducedMotion.matches && distance > 0
      ? Math.min(1, Math.max(0, (start - top) / distance))
      : 0;
    contacts.style.setProperty("--contacts-progress", progress);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(paint);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("pageshow", schedule);
  reducedMotion.addEventListener("change", schedule);
  paint();
})();
