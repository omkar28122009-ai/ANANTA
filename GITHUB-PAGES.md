# Deploy ANANTA with GitHub Pages

This repository is a static HTML/CSS/JavaScript application with Firebase services. GitHub Pages serves the public website; Firebase provides authentication, the editorial database and media storage.

## 1. Put the website files at the repository root

The repository root must contain `index.html`, `ananta-app.js`, `ananta.css`, `ananta-luxe.css`, `ananta-github.css`, `firebase-config.js` and the `assets/` folder. Do not upload only the ZIP file or leave the site inside an extra nested project folder.

The `.nojekyll` file is included so GitHub Pages serves dotfiles and assets without Jekyll processing. The workflow runs a dependency-free integrity check, then assembles a minimal `_site/` artifact containing only public runtime files. Firebase rules, Admin SDK utilities and internal documentation stay in the source repository and are not copied into the public website artifact.

## 2. Enable the Pages workflow

1. Push the complete project to the `main` or `master` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Build and deployment → Source** to **GitHub Actions**.
4. The included `.github/workflows/pages.yml` deploys the repository on each push to `main` or `master`.
5. Wait for the workflow to complete, then open the Pages URL shown in the deployment summary.

The app uses hash routes (for example `/#/news`), so page navigation does not require server rewrite rules. The workflow copies the site runtime files from the repository root into `_site/`; do not move `index.html`, the CSS, JavaScript, `firebase-config.js` or `assets/` into a nested folder. Relative CSS, JavaScript and SVG paths also work for a repository Pages URL such as `https://ACCOUNT.github.io/REPOSITORY/`.

## 3. Configure Firebase before using Studio

Open `firebase-config.js` and paste the public web-app configuration from **Firebase Console → Project settings → Your apps → Web app**. Fill every required property: `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket` (when using media), and `appId`. These are browser configuration values, not service-account credentials. Never put a service-account JSON, private key or Admin SDK credential in this repository.

In Firebase:

- Enable **Authentication → Email/Password**.
- Add the exact GitHub Pages hostname (for example `ACCOUNT.github.io`) to **Authentication → Settings → Authorised domains**. For project pages, the hostname is still `ACCOUNT.github.io`, not the repository path.
- Create/enable Realtime Database and Storage.
- Publish the included `database.rules.json` and `storage.rules` in the matching Firebase products.
- Confirm the `databaseURL` exactly matches the Realtime Database URL shown in Firebase Console.

Without Firebase configuration, the public site displays its bundled starter stories, but private Studio sign-in is intentionally disabled and edits cannot sync to other devices. This is expected fail-safe behaviour, not a GitHub Pages error. GitHub Pages alone cannot provide account authentication, cloud database writes or media uploads.

## 4. Publish the corrected Firebase rules

GitHub Pages deploys only the static public files; it does not deploy Firebase rules automatically. After reviewing the rules, publish them separately from the repository root:

```bash
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only database,storage
```

This release removes root-level `.read: false` and `.write: false` entries because those parent-level rules override every nested permission and block sign-in role lookups, public content and CMS writes. The rules keep public data readable and restrict editorial writes by staff role. If you previously deployed v3.3 rules, publishing the updated `database.rules.json` is required.

## 5. Provision the first administrator

Create the administrator in Firebase Authentication, then run the trusted-machine provisioning utility from `functions/` following `DEPLOYMENT.md`. When upgrading an existing v3.3 database, also run `functions/tools/migrate-v3-4.js` once. These tools use Firebase Admin SDK and Application Default Credentials; keep credentials off GitHub and out of the browser.

## 6. Confirm the deployment

Open these URLs on the live site:

- `/` — publication home
- `/#/news` — journal, search and sorting
- `/#/universe` — interactive knowledge tools
- `/#/studio/login` — private CMS sign-in

In browser developer tools, check that `ananta.css`, `ananta-luxe.css`, `ananta-github.css`, `ananta-app.js` and `firebase-config.js` all return HTTP 200. If the public site loads but Studio reports a Firebase setup message, the Firebase config/authorised-domain/database setup is incomplete. If Firebase reports a database read error, check that the updated database rules were published.

## 7. What GitHub Pages does not do

GitHub Pages is static hosting. The current build uses Firebase for the server-backed CMS. Scheduled publishing requires the optional Firebase scheduled function; a genuine AI assistant and readership reporting require separate configured services. The current reader assistant searches published ANANTA articles and is not a generative AI service.
