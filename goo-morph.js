(() => {
  const backdrop = document.querySelector(".backdrop");
  const [original, swapped] = backdrop.querySelectorAll(".backdrop-state");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  // Goo Morph uses a timed blend rather than the gallery's shared springs.
  const meltDuration = 1050;
  const holdDuration = 1600;

  let outgoing = original;
  let incoming = swapped;
  let holdTimer;
  let animationFrame;

  function clearAppearance(layer) {
    layer.style.removeProperty("filter");
    layer.style.removeProperty("opacity");
  }

  function draw(layer, amount, scale) {
    const blur = Math.min((8 / amount - 8) * scale, 100);
    layer.style.filter = amount === 1 ? "none" : `blur(${blur.toFixed(2)}px)`;
    layer.style.opacity = (amount ** 0.4).toFixed(3);
  }

  function melt() {
    // Keep the demo's blur proportional to the larger letters in the hero.
    const scale = outgoing.querySelector("img").getBoundingClientRect().height / 64;
    incoming.style.opacity = "0";
    incoming.hidden = false;
    backdrop.classList.add("is-melting");
    let start;

    function frame(now) {
      start ??= now;
      const progress = Math.min((now - start) / meltDuration, 1);
      if (progress < 1) {
        const eased = progress * progress * (3 - 2 * progress);
        draw(outgoing, 1 - eased, scale);
        draw(incoming, eased, scale);
        animationFrame = requestAnimationFrame(frame);
        return;
      }

      outgoing.hidden = true;
      clearAppearance(outgoing);
      clearAppearance(incoming);
      backdrop.classList.remove("is-melting");

      [outgoing, incoming] = [incoming, outgoing];
      holdTimer = setTimeout(melt, holdDuration);
    }

    animationFrame = requestAnimationFrame(frame);
  }

  function syncMotion() {
    clearTimeout(holdTimer);
    cancelAnimationFrame(animationFrame);
    backdrop.classList.remove("is-melting");
    clearAppearance(original);
    clearAppearance(swapped);
    original.hidden = false;
    swapped.hidden = true;
    outgoing = original;
    incoming = swapped;

    if (!reducedMotion.matches && !document.hidden) {
      holdTimer = setTimeout(melt, holdDuration);
    }
  }

  reducedMotion.addEventListener("change", syncMotion);
  document.addEventListener("visibilitychange", syncMotion);
  syncMotion();
})();
