/**
 * PLACE CHRISTY — Unofficial fan-made tribute
 * Original interactive sticker placer. No external assets required.
 * Vanilla JS for GitHub Pages.
 */

(function () {
  "use strict";

  // ---------- Config ----------
  const STICKER_VARIANTS = 6;
  const MIN_SIZE = 0.75;
  const MAX_SIZE = 1.35;
  const MAX_ROTATION = 28; // degrees
  const SAFE_MARGIN = 12; // px from edges
  const HERO_SAFE = true; // keep stickers out of hero area roughly

  const EASTER_EGGS = {
    5: "Nice start ✦ Keep going!",
    10: "Double digits! More Christy energy unlocked.",
    25: "Quarter century of tributes. Legendary.",
    50: "Half a hundred! The canvas loves you.",
    100: "Century club. Absolute icon energy.",
    200: "200?! You're committed. Respect.",
  };

  // Sticker content pool (tasteful, playful, non-explicit)
  const LABELS = [
    { emoji: "✦", text: "Christy" },
    { emoji: "★", text: "Christy" },
    { emoji: "♥", text: "Christy" },
    { emoji: "✧", text: "Christy" },
    { emoji: "☆", text: "Christy" },
    { emoji: "✦", text: "More Christy" },
    { emoji: "★", text: "Fan Love" },
    { emoji: "♥", text: "Tribute" },
    { emoji: "✧", text: "Icon" },
    { emoji: "☆", text: "Classic" },
  ];

  // ---------- DOM ----------
  const canvas = document.getElementById("canvas");
  const placeBtn = document.getElementById("placeBtn");
  const clearBtn = document.getElementById("clearBtn");
  const shareBtn = document.getElementById("shareBtn");
  const countEl = document.getElementById("count");
  const toastEl = document.getElementById("toast");
  const hero = document.getElementById("hero");

  let count = 0;
  let toastTimer = null;

  // ---------- Helpers ----------
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function pick(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.hidden = false;
    // force reflow
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => {
        toastEl.hidden = true;
      }, 320);
    }, 2800);
  }

  function updateCounter() {
    countEl.textContent = String(count);
  }

  function getCanvasRect() {
    return canvas.getBoundingClientRect();
  }

  /**
   * Compute a safe placement point inside the canvas.
   * Avoids the very top (near hero) and edges.
   */
  function randomSafePoint() {
    const rect = getCanvasRect();
    const w = rect.width;
    const h = rect.height;
    // Keep a bit of top margin so stickers don't sit under hero text on small screens
    const topPad = Math.min(40, h * 0.08);
    const x = rand(SAFE_MARGIN, Math.max(SAFE_MARGIN + 1, w - SAFE_MARGIN));
    const y = rand(topPad + SAFE_MARGIN, Math.max(topPad + SAFE_MARGIN + 1, h - SAFE_MARGIN));
    return { x, y };
  }

  /**
   * Convert client coordinates to canvas-local coordinates.
   */
  function clientToLocal(clientX, clientY) {
    const rect = getCanvasRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  /**
   * Check if a point is roughly over the hero / controls (so we don't cover them).
   * Hero is above the canvas in the flex layout, so most clicks on canvas are fine.
   * Extra guard for very small screens where overlap can happen.
   */
  function isOverControls(clientX, clientY) {
    if (!hero) return false;
    const hr = hero.getBoundingClientRect();
    // Small buffer below hero
    return clientY < hr.bottom + 8;
  }

  // ---------- Sticker creation ----------
  function createSticker(x, y) {
    const variant = randInt(1, STICKER_VARIANTS);
    const label = pick(LABELS);
    const scale = rand(MIN_SIZE, MAX_SIZE);
    const rotation = rand(-MAX_ROTATION, MAX_ROTATION);

    const el = document.createElement("div");
    el.className = `sticker v${variant}`;
    el.style.setProperty("--rot", `${rotation}deg`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
    // Store rotation for the pop-in keyframes (already set via --rot)

    const inner = document.createElement("div");
    inner.className = "sticker-inner";
    inner.innerHTML = `
      <span class="emoji" aria-hidden="true">${label.emoji}</span>
      <span class="label">${label.text}</span>
    `;
    el.appendChild(inner);

    // After animation ends, lock the final transform so it doesn't jump
    el.addEventListener(
      "animationend",
      () => {
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
      },
      { once: true }
    );

    canvas.appendChild(el);
    return el;
  }

  function placeAt(x, y) {
    createSticker(x, y);
    count += 1;
    updateCounter();

    if (EASTER_EGGS[count]) {
      showToast(EASTER_EGGS[count]);
    }
  }

  function placeRandom() {
    const pt = randomSafePoint();
    placeAt(pt.x, pt.y);
  }

  function clearAll() {
    const stickers = canvas.querySelectorAll(".sticker");
    stickers.forEach((s) => s.remove());
    count = 0;
    updateCounter();
    showToast("Canvas cleared. Ready for more ✦");
  }

  // ---------- Interaction ----------
  function handlePointer(clientX, clientY) {
    if (isOverControls(clientX, clientY)) return;
    const local = clientToLocal(clientX, clientY);
    // Clamp to canvas bounds
    const rect = getCanvasRect();
    const x = Math.max(SAFE_MARGIN, Math.min(rect.width - SAFE_MARGIN, local.x));
    const y = Math.max(SAFE_MARGIN, Math.min(rect.height - SAFE_MARGIN, local.y));
    placeAt(x, y);
  }

  // Mouse
  canvas.addEventListener("click", (e) => {
    // Ignore if it bubbled from a button somehow
    if (e.target.closest("button")) return;
    handlePointer(e.clientX, e.clientY);
  });

  // Touch — prevent default scroll/zoom interference, place on touchend for better feel
  let touchStart = null;

  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        touchStart = { x: t.clientX, y: t.clientY, time: Date.now() };
      }
    },
    { passive: true }
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      if (!touchStart || e.changedTouches.length === 0) return;
      const t = e.changedTouches[0];
      const dx = Math.abs(t.clientX - touchStart.x);
      const dy = Math.abs(t.clientY - touchStart.y);
      const dt = Date.now() - touchStart.time;
      // Treat as tap if small movement and quick
      if (dx < 14 && dy < 14 && dt < 500) {
        e.preventDefault();
        handlePointer(t.clientX, t.clientY);
      }
      touchStart = null;
    },
    { passive: false }
  );

  // Buttons
  placeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    placeRandom();
  });

  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearAll();
  });

  // Share
  shareBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    const shareData = {
      title: "PLACE CHRISTY — Unofficial Fan Tribute",
      text: "Need a little more Christy in your day? Tap to place tribute stickers.",
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard ✦");
      } else {
        showToast("Share not supported — copy the URL from the address bar.");
      }
    } catch (err) {
      // User cancelled or error — ignore cancel
      if (err && err.name !== "AbortError") {
        showToast("Couldn’t share. Try copying the link.");
      }
    }
  });

  // Prevent double-tap zoom on iOS for the canvas
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    },
    { passive: false }
  );

  // Initial counter
  updateCounter();

  // Optional: place one welcome sticker after a short delay (tasteful)
  // Commented out so first interaction is purely user-driven.
  // setTimeout(placeRandom, 800);
})();
