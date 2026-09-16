# PLACE CHRISTY

**Unofficial fan-made tribute website.**

A simple, playful interactive page inspired by the spirit of placekeanu.com — but fully original in design, code, and assets.

Tap or click anywhere on the canvas (or use the button) to place randomized Christy-inspired tribute stickers. No explicit imagery. Pure vanilla HTML, CSS, and JavaScript. Ready for GitHub Pages.

> **Disclaimer:** This is an unofficial fan-made tribute project. It is **not affiliated with, owned, operated, sponsored, or endorsed by Christy Canyon**.

---

## Live

Once published via GitHub Pages:

`https://johnconstant99-dev.github.io/placechristy/`

---

## Features

- Mobile-first, responsive layout (looks great on iPhone and desktop)
- Dark elegant background with subtle gradients and grain
- Large hero typography + playful retro 80s/90s accent personality
- Tap / click anywhere on the canvas to place a sticker
- “Place Christy ✦” button places one at a random safe location
- Random rotation, size, color variants, and labels
- Smooth pop-in animation
- Live counter of stickers placed
- Clear button to reset the canvas
- Share button (Web Share API + clipboard fallback)
- Tasteful easter-egg toasts at 5, 10, 25, 50, 100, 200 placements
- Stickers avoid covering the hero / controls
- Proper touch handling for iOS (no unwanted zoom / scroll fights)
- Footer disclaimer included

---

## Tech

- **No build step** — open `index.html` or serve the folder
- Vanilla HTML / CSS / JavaScript only
- Google Fonts: Outfit + Space Grotesk
- Stickers are pure CSS + emoji (no image assets required)
- Works offline after first load (fonts may need network)

---

## Files

```
placechristy/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/          (empty — reserved for future optional assets)
```

---

## Local development

```bash
# From the project root
npx serve .
# or any static server
python3 -m http.server 8080
```

Then open the printed URL.

---

## Deploy to GitHub Pages

1. Push this repository to `https://github.com/johnconstant99-dev/placechristy`
2. In the repo: **Settings → Pages → Source → Deploy from a branch**
3. Choose branch `main` (or `master`) and folder `/ (root)`
4. Save. The site will be available at:

   `https://johnconstant99-dev.github.io/placechristy/`

---

## Git commands (first push)

```bash
cd placechristy   # or the folder that contains index.html

git init
git add .
git commit -m "Initial commit: PLACE CHRISTY unofficial fan tribute site"
git branch -M main
git remote add origin https://github.com/johnconstant99-dev/placechristy.git
git push -u origin main
```

If the remote already exists and you only need to update:

```bash
git add .
git commit -m "Update PLACE CHRISTY site"
git push origin main
```

---

## License & spirit

This project is a non-commercial, unofficial fan tribute.  
Do not use it to imply official endorsement, sell merchandise, or host explicit content.

Made with respect and a sense of fun.
