# ANANTA deployment guide — v3.4.1

## 1. Configure Firebase

1. Create/select a dedicated Firebase project for ANANTA.
2. Create a Firebase Web App and copy its **public web configuration** into `firebase-config.js` as `window.ANANTA_FIREBASE_CONFIG`.
3. Enable Email/Password in Firebase Authentication.
4. Enable Realtime Database and Firebase Storage.
5. Add `localhost` and your final HTTPS website hostname to Authentication authorised domains.
6. Keep Admin SDK service-account credentials outside this website folder and source control.

The included `firebase-config.js` is intentionally an empty template. It does not contain another project's API credentials. Public pages can be explored offline without a Firebase configuration; the private Studio cannot authenticate or cloud-save until Firebase is configured.

## 2. Deploy Hosting and security rules

Install Firebase CLI on a trusted development computer, authenticate and select the intended project:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

From the project root:

```bash
firebase deploy --only hosting,database,storage
```

The manifest uses `firebase.json`, Realtime Database rules are in `database.rules.json`, and Storage rules are in `storage.rules`. Review these rules for your project before deploying. Public content is readable without login; public writes and private Studio data are protected by role checks. Do not add `.read: false` or `.write: false` at the Realtime Database root: root rules cascade over every child and would block all scoped access.

## 3. Provision the first administrator

A new project has no editorial administrator by default. First create the intended staff member in Firebase Authentication. Then, on a trusted administrator machine, install the Functions dependencies and authenticate to Google Cloud using Application Default Credentials or another secure Admin SDK method.

```bash
cd functions
npm install
```

Set the database URL and provision the existing Firebase Auth UID:

```bash
export FIREBASE_DATABASE_URL="https://YOUR-PROJECT-default-rtdb.firebaseio.com"
node tools/provision-user.js FIREBASE_AUTH_UID admin "ANANTA Administrator"
```

The utility writes the role directory record, the per-user `roleLookup` record and the `anantaRole` custom claim. It supports `admin`, `editor`, `author` and `remove` roles. The user should sign out and sign in again so the refreshed token includes the claim.

Never run this utility in a browser or distribute an Admin SDK service-account file.


### Upgrade an existing v3.3 database

After deploying the v3.4 database rules, run the one-time migration from `functions/` on a trusted machine. It copies existing staff roles into `roleLookup` and mirrors existing author drafts to the editor-only `authorDraftIndex` while leaving the original author-owned drafts in place:

```bash
cd functions
npm install
export FIREBASE_DATABASE_URL="https://YOUR-PROJECT-default-rtdb.firebaseio.com"
node tools/migrate-v3-4.js
```

Do not run this from the browser or commit any service-account credentials.

## 4. Install scheduled publishing function (optional)

The optional Firebase scheduled function checks `ananta/studio/articles` and publishes approved scheduled articles once their `publishAt` time has passed. Deploy it from the project root:

```bash
cd functions
npm install
cd ..
firebase deploy --only functions:publishScheduledArticles
```

Scheduled Functions use Cloud Scheduler and may require a billing-enabled Google Cloud/Firebase plan. Review current costs, region and quotas in your Firebase project before enabling it. Without this function, scheduled articles stay queued until manually published.

## 5. Acode / Android local preview

Keep the full project folder together, including `index.html`, CSS files, `ananta-app.js`, `firebase-config.js` and `assets/`. Start Acode's local server or another HTTP server from the project directory and open its local HTTP address. Do not open `index.html` directly through the phone file manager. Restart the local server after replacing files to avoid stale cached scripts/styles.

## 6. Editorial workflow

1. An Admin or Editor creates or edits an article in **Studio → Articles**.
2. Write the original English headline, summary and body.
3. Optionally switch to **Hinglish** and write the Roman-Hindi headline, summary and body. This edition is not auto-generated; publish only after editorial review.
4. Choose a cover image from Media Library or enter a secure HTTPS URL and add meaningful alt text.
5. Add direct references and choose an evidence classification.
6. Preview the reader card, article, language and SEO result in the live side canvas.
7. Save as a draft, schedule for a future time, or publish after checking the editorial review declaration.

## 7. Page design workflow

1. Sign in as Admin or Editor.
2. Open **Studio → Page designer**.
3. Choose a page template (Home, News, Universe, Sanskrit Studio, Timeline, Observatory, About, Editorial Policy, Contact, Privacy, Terms, Saved Reading or Category).
4. Edit the eyebrow, headline, introductory copy, secondary copy and additional Markdown content.
5. Add a hero image by URL or select an uploaded asset from Media Library; set alt text.
6. Add or reorder Text, Image, Quote and Research note blocks. Image blocks support alt text, captions and credits; text blocks support simple Markdown.
7. Watch the side-by-side live preview at the right. Toggle Desktop/Mobile preview width to inspect the design. The working copy is saved locally in this browser until you publish it.
8. Save. The public customisation is written to `ananta/public/pages/{pageKey}`; the private editable record is retained at `ananta/studio/pages/{pageKey}`.

The page composer inserts its additional content below the page introduction and retains interactive template modules. Article pages are managed separately inside the article editor. Global brand, logo, accent colour, contact and homepage SEO settings are under **Studio → Website & SEO**. Unsaved article writing can be recovered from the Studio Overview or Articles page on the same browser/device.

## 8. Security and media uploads

- Database rules deny writes unless the signed-in UID has an assigned ANANTA role.
- Authors are limited to draft records under their own UID; Editor/Admin accounts manage shared articles.
- Only Admin/Editor custom claims can upload media. The upload UI and Storage rules allow image/jpeg, image/png, image/webp or image/gif and an 8 MB maximum. GIFs remain animated in supported browsers; uploaded media is displayed separately from decorative vector artwork.
- Configure Firebase App Check and API key restrictions for production.
- Back up Realtime Database content and test restoration before launch.
- Keep the Admin SDK service credential outside the website and never expose it to a client.

## 9. SEO and analytics boundary

The current site uses client-side hash routes, so it does not provide the indexing quality of individual server-rendered article URLs. For production search performance, migrate to Next.js routes such as `/article/[slug]`, generate Article JSON-LD and route metadata on the server, and build sitemap/robots files from published content.

Studio's current analytics are workflow counts, not reader traffic analytics. Connect a consent-aware analytics provider and retrieve aggregate reports through a trusted server endpoint; do not expose reporting secrets in browser code. The Knowledge Guide searches published ANANTA articles and their references; it is not a generative AI model.
