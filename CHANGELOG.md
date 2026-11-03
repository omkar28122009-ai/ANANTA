# ANANTA changelog

## v3.4.1 — GitHub Pages deployment and Firebase access repair

- Updated the Pages workflow to the current documented checkout, upload-artifact and deploy action versions; added a CI pre-deployment smoke test.
- Changed Pages publishing to assemble a minimal public artifact containing only the site runtime files, media assets and `.nojekyll`; trusted Admin SDK tooling, Firebase rules and internal docs are no longer copied into the public Pages artifact.
- Removed root-level Realtime Database deny rules that cascade over and block every nested read/write rule; retained scoped role enforcement under the ANANTA data tree.
- Added a safe v3.3-to-v3.4 data migration that backfills role lookup entries and legacy author-draft index entries, including missing `authorUid` values from the UID-scoped private draft path.
- Added a dependency-free static validation script and updated browser cache versions to prevent stale v3.4.0 assets.

## v3.4.0 — Responsive reader, search and clean media

- Rebuilt global, News and category search around accent-normalised, all-term matching across English/Hinglish story content, authors, topics and tags; added live sorting (newest, oldest, title A–Z), result counts and clear-filter states.
- Refined mobile article proportions, reading column width, language switch and toolbar layout to avoid cramped or colliding controls and reduce unnecessary vertical gaps.
- Removed the empty references message and reference instructions entirely when an article has no valid source links; source sections now appear only for valid titled HTTP/HTTPS references.
- Separated uploaded photographs and GIFs from generated geometric art across story cards, featured cards, article covers, page heroes and Studio previews. Editorial media is displayed as a distinct image, without stacked decorative SVGs or float overlays.
- Reworked the Studio responsive shell for mobile: full-width canvas, off-canvas sidebar, compact header, stacked dashboard sections and responsive editor previews.
- Standardised public and admin interface icons as inline SVGs; added a robust geometric logo fallback and admin controls to select a custom logo from Media Library or use an HTTPS URL.
- Enabled GIF media uploads in the UI and Firebase Storage rules, preserving the 8 MB file size ceiling.
- Added release documentation and refreshed asset cache versions.


## v3.2.0 — Premium editorial control plane & recovery workflow

- Added global publication identity controls for brand name, descriptor, tagline, publication description, custom logo, accent colour, contact email, homepage description and canonical base; public navigation/footer, theme accents, page titles and social metadata now follow those values.
- Refined the page preview brand lockup and added safe inline italic/bold formatting for page headlines using `*italic*` and `**bold**` (HTML is escaped).
- Added browser-local article working-copy recovery with resume/discard actions, an overview/library recovery card and safer handling when opening a different article or starting a new story.
- Hid management surfaces from Author navigation and added a second role gate at the Studio page router; Firebase rules continue to enforce access server-side.
- Made the Hinglish reader fall back to the complete English edition when an article body has no Hinglish edition, rather than mixing a partial Hinglish headline with an English body.
- Updated document title, canonical URL and Open Graph/Twitter metadata from the current public page and saved publication settings. Hash-route SEO remains a known limit of this no-build SPA.
- Refined brand-accent focus states, Settings colour controls, live-preview identity and mobile recovery-card presentation.

## v3.1.0 — Structured visual page builder & working-copy recovery

- Added block-based page composition for Admin/Editor: editable text sections, image features with alt text/captions/credits, pull quotes and research notes. Blocks can be added, reordered and removed, and render below the existing page introduction without replacing interactive template modules.
- Extended the side canvas to preview the new page blocks live, including imagery and rich text. Added responsive editor controls and refined block styling.
- Added browser-local working-copy recovery for page design changes; local drafts remain separate from the published page until Save is selected.
- Expanded global search and news listing filters to match Hinglish headline, standfirst and body text.
- Preserved page-specific SEO descriptions in the document metadata.
- Updated author draft rules so Admin/Editor can manage a draft submitted by an Author while Authors remain limited to their own draft-only records.

## v3.0.0 — Bilingual editorial workspace & live page composer

- Added English/Hinglish article data fields, reader language switch, bilingual title/summary/body presentation, language-aware reading controls and an explicit fallback notice when a Hinglish edition has not been written.
- Reworked the article editor into a structured workspace with separate language editions, Markdown toolbars, cover-image selection from Media Library, reference management, SEO controls and a live reader/SEO preview rail.
- Added Page designer navigation for Admin/Editor roles, editable page copy and custom body sections, hero image and alt text controls, SEO metadata, media-library selection and a side-by-side live preview with desktop/mobile width toggles.
- Page customisations persist to private Studio and public Firebase page records; local browser storage preserves the editing preview on the current device if cloud configuration is absent.
- Added image and accessibility layers for admin-selected page imagery, refined preview surfaces, mobile breakpoints and editor controls.
- Added missing Firebase config template and ANANTA geometric SVG mark.
- Added Firebase Realtime Database/Storage rules, Firebase project manifest, scheduled publishing function and trusted-machine role provisioning utility.
- Updated README and deployment instructions to identify the current no-build Firebase architecture and production migration boundary.

## v2.2.0 — Premium editorial visual foundation

- Added premium editorial art direction, stronger visual system and refined SaaS-style Studio surfaces.


## v3.4 — GitHub Pages and Firebase reliability

- Added a GitHub Pages Actions workflow and `.nojekyll` marker.
- Fixed cascading Realtime Database rule structure: removed root-level deny rules that blocked all nested access.
- Added per-user role lookup and a restricted author-draft index so staff can resolve their own role while editors/admins review contributions.
- Updated provisioning utility to keep role lookup records in sync.
- Added clear Firebase setup diagnostics and disabled Studio sign-in until a complete Firebase web configuration is detected.
- Improved mobile reader controls, search/sort controls, article references and Studio typography for touch and readability.
