# Portfolio

Personal site of Volodymyr Pylypchuk: https://vopy03.github.io/portfolio/

Plain HTML, CSS and JavaScript with no build step, so it loads instantly from GitHub Pages.

- `index.html`, `about.html`, `projects/*.html`: the pages. Every text is written twice, with `data-l="en"` and `data-l="uk"`; the EN/УКР switch shows one of them (`#uk` or `#en` in the URL also works).
- `assets/css/style.css`, `assets/js/main.js`: styles and the small scripts (language, mobile menu, cursor glow, rotating hero line).

Local preview: `python3 -m http.server` in the repo root, then open http://localhost:8000/.

Deploy: every push to `main` publishes the site through `.github/workflows/pages.yml`
(Settings → Pages → Source: GitHub Actions).
