# Krishna Navneet Kumar — portfolio

A fast, static portfolio site. No build step: plain HTML, CSS and JavaScript, with GSAP for the animations.

## Open it

Double-click `index.html`. It opens in your browser.

## Change the content

Everything on the site (name, intro, projects, skills, timeline, links) lives in one file:

    js/content.js

Open it in Notepad or VS Code, change the text between the quotes, save, and refresh the browser.
Anything left as `""` is hidden on the site.

- **Resume:** replace `assets/krishna-resume.pdf` with the newer PDF, keeping the same file name.
- **Photo:** replace `assets/krishna.jpg` (portrait, 4:5 works best).
- **New project:** copy one of the blocks under `projects` and change the text.
- **Timeline and certificates:** add entries to `path` and `certificates`.

## Files

    index.html        page structure
    css/style.css     colours, type, layout
    js/content.js     all the words and links  <- edit this one
    js/main.js        builds the page from content.js, runs the "ask this page" box and the animations
    js/vendor/        GSAP animation library
    assets/           photo and fonts (fonts are self-hosted, so the site loads fast)

## Put it online

It is a static site, so any host works.

- **Vercel:** push this folder to a GitHub repo, then "Add New Project" in Vercel and import it. No settings needed.
- **GitHub Pages:** push to a repo, then Settings -> Pages -> deploy from the `main` branch.
- **Netlify:** drag the folder onto app.netlify.com/drop.
