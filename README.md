# ANANTA — Ancient Wisdom. Infinite Discoveries.

ANANTA is a no-build editorial magazine, knowledge-exploration experience and private Firebase-powered editorial workspace converted from the supplied portfolio package.

## Product areas

- **ANANTA Magazine:** Public homepage, news index, knowledge categories, article reader, bookmarks, editorial standards and contact pages.
- **ANANTA Universe:** Knowledge map, Sanskrit Studio, civilization timeline and Cosmic Observatory.
- **ANANTA Studio:** Private editorial CMS with content library, article authoring, page design, media library, publishing calendar, revisions, workflow analytics, website settings and staff roles.

## Version 3.4.1 — GitHub deployment hardening & Firebase access repair

- Rebuilt the GitHub Pages workflow with current supported Pages actions, pre-deploy static checks and a clean public artifact that excludes Admin SDK scripts, database rules and internal project documentation.
- Fixed Realtime Database rules so no root-level deny rule masks child permissions; role lookups, author-only draft storage and editor draft indexes now have explicit scoped access.
- Added a one-time v3.3 data migration, including safe backfilling of missing author UID metadata for legacy drafts.
- Added a dependency-free CI smoke test for required files, JavaScript syntax, JSON configuration and local HTML asset paths.
- Clarified the separate setup steps for GitHub Pages, Firebase web configuration, database rules, administrator provisioning and migration.

## Version 3.4 — Responsive editorial refinements & media separation

- **News search and sorting:** the global search and both News/category listings match every word across English and Hinglish titles, standfirsts and article bodies, plus authors, categories and tags. News and category results can be sorted newest-first, oldest-first or by title, with live counts and clear-search states.
- **Mobile article reader:** reduced excess spacing, constrained the reading measure, simplified the mobile toolbar, aligned language selection and kept the six reading actions on a predictable touch-friendly control rail.
- **Optional references:** source notes and the References section render only when at least one reference has a title and a valid HTTP/HTTPS URL. No “no references added” placeholder is displayed.
- **Clean editorial media:** an uploaded image or GIF is presented as a standalone cover or hero visual. Generated mandala artwork and ornamental overlays are suppressed for that asset, so visuals no longer stack or collide.
- **Responsive Studio:** the admin workspace now switches to a full-width mobile canvas with an off-canvas navigation drawer, compact top bar, full-width cards/forms and stacked live previews.
- **SVG icon and identity polish:** navigation, admin controls, article tools and bookmarks use consistent inline SVG icons. The logo falls back to the original geometric ANANTA mark if a custom logo fails and can be changed from Studio → Website & identity via Media Library or a secure image URL.
- **GIF media uploads:** the media picker and Storage rule accept GIF alongside JPEG, PNG and WebP, with the existing 8 MB limit.

## Version 3.2 — Premium editorial control plane

- **Bilingual reading:** article records have independent English and Hinglish (Roman Hindi) headline, standfirst and body fields. Readers can switch language from the article controls. If a complete Hinglish body is not available, ANANTA clearly shows the English edition rather than implying that it has translated the article automatically. Text-to-speech follows the selected language where the device has a suitable voice.
- **Professional article desk:** structured story metadata, evidence classification, reference URLs, cover image and alt text, SEO fields, scheduling, editorial review, revisions and a live side canvas. The live canvas has English/Hinglish preview controls and a search-result card.
- **Local article recovery:** unsaved writing is stored in the current browser. After a reload, the Studio overview and Articles library display a recovery card with Resume and Discard actions. This is device-local working data, not a cloud backup.
- **Page designer:** Admin/Editor can customise Home, News, Universe, Sanskrit Studio, Timeline, Observatory, About, Editorial Policy, Contact, Privacy, Terms, Saved Reading and Category templates. Edit headlines and descriptions, add Markdown body copy, set a hero image and alt text, and configure page SEO metadata.
- **Structured visual blocks:** add, reorder and remove Text, Image, Quote and Research note blocks. Images include alt text, caption and credit fields. Page changes preview in a right-side canvas with desktop/mobile width controls and remain a local working copy until Save.
- **Global identity controls:** edit the publication name, descriptor, tagline, edition description, accent colour, logo, contact email, homepage description and canonical base in **Studio → Website & SEO**. Public brand treatments, page titles and social metadata follow the saved settings.
- **Role-oriented Studio:** Admin has full editorial and staff-role controls; Editors manage stories, pages, media, categories and settings; Authors create and maintain draft contributions. Client UI gates are supplementary—the Firebase Database and Storage rules are the security boundary.

## Visual system

The editorial surface combines ivory and midnight modes, refined serif display typography, modern sans-serif interface typography, pastel lavender/rose/mint/gold art direction, original geometric SVG illustration and a premium SaaS workspace with a dark navigation rail, structured editor sections, live previews and responsive controls. Custom editorial images are supplied through the media library; decorative geometric artwork is not treated as documentary photography or historical/scientific evidence.

## Start a local preview

1. Extract the project folder.
2. Add your Firebase Web App configuration to `firebase-config.js` if you want to use the authenticated CMS. The current file intentionally contains empty placeholders and does not point to another business project.
3. Start a local server from this folder, for example `python -m http.server 8000`.
4. Open `http://localhost:8000` in your browser or Acode local server. Do not open `index.html` directly from a `file://` or `content://` URI.

The public pages render in offline preview mode without Firebase. Authentication, cloud saving, media uploads, shared page changes and publishing require a configured Firebase project.

## Firebase data structure

- `ananta/public/articles/{slug}` — published articles
- `ananta/public/categories/{slug}` — public categories
- `ananta/public/pages/{pageKey}` — public page customisations
- `ananta/public/settings` — public publication settings
- `ananta/studio/articles/{articleId}` — editor/admin article records
- `ananta/studio/authorDrafts/{uid}/{articleId}` — author-owned drafts
- `ananta/studio/pages/{pageKey}` — private page design records
- `ananta/studio/media/{assetId}` — media metadata
- `ananta/studio/roles/{uid}` — administrator-managed editorial role directory
- `ananta/studio/roleLookup/{uid}` — per-user role lookup for sign-in authorisation
- `ananta/studio/authorDraftIndex/{uid}/{articleId}` — editor-only index of author-owned drafts
- `ananta/studio/revisions/{articleId}/{revisionId}` — saved article snapshots

Database and Storage rules are supplied as `database.rules.json` and `storage.rules`. They deny unauthorised writes and limit author accounts to their own draft records. Review the rules and Firebase project before deployment.

## Staff roles

- **Admin:** staff role management, all editorial controls, publishing and settings.
- **Editor:** article management, page design, media, publishing and editorial settings.
- **Author:** create and maintain draft-only contributions; cannot publish or manage public page design.

Use `functions/tools/provision-user.js` on a trusted administrator machine to set the Realtime Database role record, per-user role lookup and Firebase Auth `anantaRole` custom claim. After upgrading an existing v3.3 database, run `functions/tools/migrate-v3-4.js` once to backfill role lookup records and the editor-only author-draft index. Never place an Admin SDK service-account credential in this website folder or browser code.

## Editorial safeguards

Use only verifiable references. Mark each research claim as a primary text, traditional interpretation, historical evidence, modern scientific finding, disputed hypothesis or editorial analysis. Keep English and Hinglish versions semantically aligned and reviewed. Do not invent scripture citations, translations, research findings, image provenance or publication dates. Sample starter articles are editorial examples and must be checked before production publication.

## Known architectural boundary

This is the existing **no-build HTML/CSS/JavaScript + Firebase Realtime Database** edition, updated to add the requested workflow and visual controls. It is not a Next.js/PostgreSQL migration, and its hash-based article URLs are less search-friendly than server-rendered routes. A production-scale migration should move public routes and editorial APIs to Next.js/React with PostgreSQL, server-side authentication/RBAC, object storage, server-rendered metadata, sitemap generation and analytics reporting.


## GitHub Pages deployment

See [`GITHUB-PAGES.md`](GITHUB-PAGES.md) for the complete Pages workflow, Firebase hostname setup, root-folder layout and live deployment verification steps.
