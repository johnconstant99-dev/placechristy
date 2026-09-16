/**
 * PLACE CHRISTY — Unofficial fan-made tribute
 * Photo stickers from Wikimedia Commons (licensed). Vanilla JS for GitHub Pages.
 */

(function () {
  "use strict";

  const MIN_SIZE = 0.72;
  const MAX_SIZE = 1.15;
  const MAX_ROTATION = 22;
  const SAFE_MARGIN = 14;
  const STICKER_BASE_WIDTH = 110;

  const EASTER_EGGS = {
    5: "Nice start ✦ Keep going!",
    10: "Double digits! More Christy energy unlocked.",
    25: "Quarter century of tributes. Legendary.",
    50: "Half a hundred! The canvas loves you.",
    100: "Century club. Absolute icon energy.",
    200: "200?! You're committed. Respect.",
  };

  // Photo sources: embedded data URIs (from photos.js) or file paths
  const FALLBACK_IMAGES = (typeof window !== "undefined" && window.CHRISTY_PHOTOS && window.CHRISTY_PHOTOS.length)
    ? window.CHRISTY_PHOTOS.slice()
    : [
    "assets/christy/christy-001.jpg", "assets/christy/christy-002.jpg", "assets/christy/christy-003.jpg",
    "assets/christy/christy-004.jpg", "assets/christy/christy-005.jpg", "assets/christy/christy-006.jpg",
    "assets/christy/christy-007.jpg", "assets/christy/christy-008.jpg", "assets/christy/christy-009.jpg",
    "assets/christy/christy-010.jpg"
  ];

  const canvas = document.getElementById("canvas");
  const placeBtn = document.getElementById("placeBtn");
  const clearBtn = document.getElementById("clearBtn");
  const shareBtn = document.getElementById("shareBtn");
  const countEl = document.getElementById("count");
  const toastEl = document.getElementById("toast");
  const hero = document.getElementById("hero");

  let count = 0;
  let toastTimer = null;
  let imageFiles = FALLBACK_IMAGES.slice();

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
    void toastEl.offsetWidth;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
      setTimeout(() => { toastEl.hidden = true; }, 320);
    }, 2800);
  }

  function updateCounter() {
    countEl.textContent = String(count);
  }

  function getCanvasRect() {
    return canvas.getBoundingClientRect();
  }

  function randomSafePoint() {
    const rect = getCanvasRect();
    const w = rect.width;
    const h = rect.height;
    const topPad = Math.min(48, h * 0.1);
    const x = rand(SAFE_MARGIN + 30, Math.max(SAFE_MARGIN + 31, w - SAFE_MARGIN - 30));
    const y = rand(topPad + SAFE_MARGIN, Math.max(topPad + SAFE_MARGIN + 1, h - SAFE_MARGIN - 40));
    return { x, y };
  }

  function clientToLocal(clientX, clientY) {
    const rect = getCanvasRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function isOverControls(clientX, clientY) {
    if (!hero) return false;
    const hr = hero.getBoundingClientRect();
    return clientY < hr.bottom + 8;
  }

  function createSticker(x, y) {
    const file = pick(imageFiles);
    const scale = rand(MIN_SIZE, MAX_SIZE);
    const rotation = rand(-MAX_ROTATION, MAX_ROTATION);

    const el = document.createElement("div");
    el.className = "sticker photo-sticker";
    el.style.setProperty("--rot", rotation + "deg");
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.width = STICKER_BASE_WIDTH + "px";
    el.style.transform = "translate(-50%, -50%) scale(" + scale + ") rotate(" + rotation + "deg)";

    const img = document.createElement("img");
    img.src = (file.indexOf("data:") === 0 || file.indexOf("assets/") === 0) ? file : ("assets/christy/" + file);
    img.alt = "Christy Canyon tribute photo";
    img.draggable = false;
    img.loading = "lazy";
    img.decoding = "async";

    el.appendChild(img);

    el.addEventListener("animationend", function () {
      el.style.animation = "none";
      el.style.opacity = "1";
      el.style.transform = "translate(-50%, -50%) scale(" + scale + ") rotate(" + rotation + "deg)";
    }, { once: true });

    canvas.appendChild(el);
    return el;
  }

  function placeAt(x, y) {
    createSticker(x, y);
    count += 1;
    updateCounter();
    if (EASTER_EGGS[count]) showToast(EASTER_EGGS[count]);
  }

  function placeRandom() {
    const pt = randomSafePoint();
    placeAt(pt.x, pt.y);
  }

  function clearAll() {
    canvas.querySelectorAll(".sticker").forEach(function (s) { s.remove(); });
    count = 0;
    updateCounter();
    showToast("Canvas cleared. Ready for more ✦");
  }

  function handlePointer(clientX, clientY) {
    if (isOverControls(clientX, clientY)) return;
    const local = clientToLocal(clientX, clientY);
    const rect = getCanvasRect();
    const x = Math.max(SAFE_MARGIN, Math.min(rect.width - SAFE_MARGIN, local.x));
    const y = Math.max(SAFE_MARGIN, Math.min(rect.height - SAFE_MARGIN, local.y));
    placeAt(x, y);
  }

  canvas.addEventListener("click", function (e) {
    if (e.target.closest("button")) return;
    handlePointer(e.clientX, e.clientY);
  });

  var touchStart = null;
  canvas.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) {
      var t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY, time: Date.now() };
    }
  }, { passive: true });

  canvas.addEventListener("touchend", function (e) {
    if (!touchStart || e.changedTouches.length === 0) return;
    var t = e.changedTouches[0];
    var dx = Math.abs(t.clientX - touchStart.x);
    var dy = Math.abs(t.clientY - touchStart.y);
    var dt = Date.now() - touchStart.time;
    if (dx < 14 && dy < 14 && dt < 500) {
      e.preventDefault();
      handlePointer(t.clientX, t.clientY);
    }
    touchStart = null;
  }, { passive: false });

  placeBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    placeRandom();
  });

  clearBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    clearAll();
  });

  shareBtn.addEventListener("click", async function (e) {
    e.stopPropagation();
    var shareData = {
      title: "PLACE CHRISTY — Unofficial Fan Tribute",
      text: "Need a little more Christy in your day? Tap to place tribute stickers.",
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard ✦");
      } else {
        showToast("Share not supported — copy the URL from the address bar.");
      }
    } catch (err) {
      if (err && err.name !== "AbortError") {
        showToast("Couldn’t share. Try copying the link.");
      }
    }
  });

  var lastTouchEnd = 0;
  document.addEventListener("touchend", function (e) {
    var now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });

  fetch("assets/christy/manifest.json")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data && Array.isArray(data.images) && data.images.length) {
        // Keep embedded photos if already loaded; manifest is for attribution only
      }
    })
    .catch(function () {});

  updateCounter();
})();
