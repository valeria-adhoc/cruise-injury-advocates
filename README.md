# Cruise Injury Advocates — static site

A cruise-ship injury landing page (microsite) for **Suro & Rodriguez, PLLC**,
Miami. Vanilla HTML/CSS/JS, **no build step**. Deployable as static assets on
Cloudflare Pages from a GitHub repo.

> Real firm content is in place (attorneys, admissions, Miami office, palette).
> A few items still need you before launch — search the project for `[PLACEHOLDER]`.
> Domain not yet purchased.

## Structure
```
cruise-injury-advocates/
├── index.html        # single-page site (all sections)
├── css/styles.css    # design system + responsive layout
├── js/main.js        # nav, scroll-reveal, mobile menu, intake form
├── assets/favicon.svg
└── README.md
```

## Deploy to Cloudflare Pages
1. Push this folder to a GitHub repo.
2. Cloudflare Pages → Create project → connect the repo.
3. Build command: **(none)** · Build output directory: **/** (repo root, or this
   folder if it's the repo root).
4. Deploy.

## Before launch — required edits
- **Attorney photos** (`[Photo: ...]` placeholders in the three bio cards).
- **Compliance** (`[PLACEHOLDER]` in the footer): confirm the Florida Bar
  attorney-advertising disclaimer and name the attorney responsible for the
  site's content.
- **Intake form**: wire to your GHL form/webhook. See the comment block in
  `js/main.js` (§5) — either set the `<form action>` or fill `submitToBackend()`.
- **Chat widget**: drop your GHL / live-chat embed at the `[INTEGRATION POINT]`
  in `js/main.js` (§6).
- **OG share image**: add one and confirm the `og:url` once the domain is live.
- **Fonts**: currently loaded from Google Fonts CDN. Self-host if you prefer
  zero third-party requests.

## Notes on content decisions
- This is a **niche microsite**, branded "Cruise Injury Advocates," presented as a
  practice of Suro & Rodriguez, PLLC. Miguel A. Suro and Jorge M. Suro lead as the
  injury/trial attorneys; Lilyvette Rodriguez Soto is shown accurately as Labor &
  Employment (crew/workplace matters), not as a cruise-injury specialist.
- **No settlement/outcome figures** are featured (per instruction). Jorge's bio
  states "over 35 federal jury verdicts" as provided. NOTE: an earlier draft you
  sent said "over 25" — confirm the correct number.
- The six "Cases We Handle" cards were confirmed; card descriptions are editable copy.
- The deadline language is non-numeric ("strict, shortened deadlines") since the
  "one year" figure was not confirmed.
