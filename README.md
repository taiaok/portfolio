# Taiao Kawiti — portfolio

Plain HTML, CSS and JS, no build step. Deployed to GitHub Pages on push to `main`.

## Run locally

Open `index.html` in a browser, or serve it:

```sh
python3 -m http.server 8000
```

## Structure

```
index.html      page markup and copy (hero, about, Āhau roadmap, terminal, reel, contact)
css/style.css   styles: Iosevka (headings, self-hosted in fonts/), IBM Plex Sans (body), IBM Plex Mono (terminal)
js/main.js      header, roadmap and reel selection, pacman divider, terminal commands
reel/           stills for the creative timeline (referenced by each clip's data-img)
COPY.md         all site copy in one place for editing
shelved.md      projects pulled from the site for now
```

Format with `npx prettier --write css js` (settings in `.prettierrc.json`).

Asset URLs use `?v=dev`; the deploy workflow swaps in the commit SHA, so there's nothing to bump by hand.
