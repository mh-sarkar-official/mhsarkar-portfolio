# MD Mehedi Hasan Sarkar — Portfolio

Personal portfolio for **Flutter + Applied AI Product Engineering**.

## Positioning

The portfolio intentionally leads with the projects that best demonstrate current market-relevant depth:

1. **AI ALP** — personalized learning, recommendations, multimodal LLM UX
2. **DIA AI** — conversational AI + structured health tracking
3. **Exam Intelligence** — document workflows + AI assessment insight
4. **Rangs Assistant** — enterprise AI, Qwen, Oracle and NL2SQL
5. **Pensioner Verification** — Bangladesh Government pension-services app with 500K+ Google Play downloads
6. **WellSnap** — OCR / computer vision applied to health-device readings
7. **ExamBuzz** — exam preparation and OMR-based learning platform developed at Wizard Software & Technology
8. **Shawpno Instamart** — production consumer quick-commerce UX
9. **Perfecto** — e-commerce mobile application developed at Wizard Software & Technology
10. **Educity Learner** — education and learning application developed at Wizard Software & Technology

Real-time tracking, ERP integration, Firebase, sockets and broader Flutter delivery remain visible through the experience and technical sections without competing with the highest-signal AI/mobile work.

## Design

Built with the Hallmark design discipline:

- **Macrostructure:** Portfolio Grid
- **Theme direction:** Grid
- 12-column visible structure
- Archivo type system
- One ultramarine signal color
- No stock photography, fake device chrome, glassmorphism or invented metrics
- Mobile responsive at narrow widths
- Reduced-motion support
- Accessible focus states and filter controls

## Files

- `index.html` — content and semantic structure
- `styles.css` — Hallmark-inspired design system and responsive layout
- `script.js` — project filtering and footer year
- `favicon.svg` — simple personal mark
- `.hallmark/` — preflight/design history for future Hallmark revisions

## Local preview

Open `index.html` directly in a modern browser or serve the directory with any static HTTP server.

## Deployment

The site is static and works with GitHub Pages, Netlify, Vercel, Cloudflare Pages or ordinary hosting.


## Wizard-era products

The following projects are explicitly associated with the Wizard Software & Technology role:

- Perfecto
- ExamBuzz
- Educity Learner


## GitHub Pages

The repository includes a GitHub Pages deployment workflow at `.github/workflows/pages.yml`.

One-time GitHub setup:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Pushes to `main` will then deploy automatically.

Expected project-site URL:

`https://mh-sarkar-official.github.io/mhsarkar-portfolio/`

The repository also includes `.nojekyll` and a branded `404.html`.


## Motion system

Motion is layered on top of the Hallmark grid using the iart web-animation discipline:

- GSAP timeline for the hero entrance
- ScrollTrigger for restrained section/project reveals
- GSAP Flip for project-filter layout transitions
- Transform/opacity-first animation for compositor-friendly performance
- Short 100–250ms micro-interactions for buttons and hover feedback
- No Lenis or scroll hijacking
- No glassmorphism, WebGL, Lottie decoration or autoplay media
- `prefers-reduced-motion` disables spatial movement while preserving essential color/state feedback

The runtime loads GSAP, ScrollTrigger and Flip from jsDelivr; the site remains fully usable if those scripts fail to load.


## Cinematic Scroll World

The portfolio opens with a Flow/Veo-generated cinematic sequence integrated using the core Scroll World technique.

- Six generated clips are normalized into one scroll-scrubbed web master.
- The master is 960×540 H.264, 24fps, no audio, tight GOP/keyframes and fast-start metadata.
- Very short seam crossfades hide small Veo frame-lock differences while preserving the sense of one continuous world.
- Desktop scroll position drives the paused video playhead; it does not autoplay.
- Real HTML copy sits above the footage for crisp typography and accessibility.
- The final segment fades to the Hallmark paper background and hands off to the existing real portrait/hero.
- Small/coarse-pointer devices and `prefers-reduced-motion` receive a static poster presentation instead of scroll-jacked video.
- The existing project grid, experience, stack, publication and contact sections remain unchanged below the cinematic.
