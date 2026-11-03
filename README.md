# Taiao Kawiti — portfolio

Prototype of the delivery-lead portfolio. Plain HTML, CSS and JS, no build step.

## Run locally

Open `index.html` in a browser, or serve it:

```sh
python3 -m http.server 8000
```

## Structure

```
index.html      page markup (hero, about, Āhau roadmap, terminal, editor, contact)
css/style.css   styles — Literata (headlines), IBM Plex Sans (body), IBM Plex Mono (labels/terminal)
js/main.js      roadmap clicks, terminal commands, reel timeline/playhead, copy-email
```

## To do before launch

- [ ] Replace placeholder Āhau milestone copy (`rm` array in `js/main.js`)
- [ ] Real email address (`#email` in `index.html`)
- [ ] Final tagline and about copy
- [ ] Remove the PROTOTYPE badge (`.proto`)
- [ ] Add real video/photo stills to the creative monitor
