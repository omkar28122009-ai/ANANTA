/*
 * One-time migration for ANANTA v3.4.
 * Run only on a trusted administrator machine with Application Default Credentials.
 * It mirrors staff role records into per-user readable lookup nodes and builds
 * a protected editor index for existing author drafts. No credentials belong here.
 */
const admin = require('firebase-admin');

async function main() {
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!databaseURL) throw new Error('Set FIREBASE_DATABASE_URL before running this migration.');
  admin.initializeApp({ credential: admin.credential.applicationDefault(), databaseURL });
  const db = admin.database();

  const [rolesSnap, draftsSnap] = await Promise.all([
    db.ref('ananta/studio/roles').once('value'),
    db.ref('ananta/studio/authorDrafts').once('value')
  ]);

  const updates = {};
  const roles = rolesSnap.val() || {};
  const drafts = draftsSnap.val() || {};
  let roleCount = 0;
  let draftCount = 0;

  for (const [uid, record] of Object.entries(roles)) {
    if (!record || !['admin', 'editor', 'author'].includes(record.role)) continue;
    updates[`ananta/studio/roleLookup/${uid}`] = { uid, role: record.role };
    roleCount += 1;
  }

  for (const [uid, documents] of Object.entries(drafts)) {
    for (const [articleId, article] of Object.entries(documents || {})) {
      if (!article || article.status !== 'draft') continue;
      // The old private path is already scoped to this UID; backfill missing metadata safely.
      const migratedArticle = { ...article, authorUid: article.authorUid || uid };
      updates[`ananta/studio/authorDrafts/${uid}/${articleId}`] = migratedArticle;
      updates[`ananta/studio/authorDraftIndex/${uid}/${articleId}`] = migratedArticle;
      draftCount += 1;
    }
  }

  if (Object.keys(updates).length) await db.ref().update(updates);
  process.stdout.write(`ANANTA v3.4 migration complete: ${roleCount} role lookups and ${draftCount} draft index entries synced.\n`);
  await admin.app().delete();
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
