/* Run only on a trusted administrator machine with Application Default Credentials. */
const admin = require('firebase-admin');

async function main() {
  const [uid, role, name = 'ANANTA contributor'] = process.argv.slice(2);
  if (!uid || !role || !['admin', 'editor', 'author', 'remove'].includes(role)) {
    throw new Error('Usage: node tools/provision-user.js FIREBASE_UID admin|editor|author|remove [Display Name]');
  }
  const databaseURL = process.env.FIREBASE_DATABASE_URL;
  if (!databaseURL) throw new Error('Set FIREBASE_DATABASE_URL before running this tool.');
  admin.initializeApp({ credential: admin.credential.applicationDefault(), databaseURL });
  const user = await admin.auth().getUser(uid);
  const db = admin.database();
  const roleRef = db.ref(`ananta/studio/roles/${uid}`);
  const roleLookupRef = db.ref(`ananta/studio/roleLookup/${uid}`);
  const claims = { ...(user.customClaims || {}) };

  if (role === 'remove') {
    delete claims.anantaRole;
    await admin.auth().setCustomUserClaims(uid, claims);
    await roleRef.remove();
    await roleLookupRef.remove();
    process.stdout.write(`Removed ANANTA role for ${uid}\n`);
  } else {
    claims.anantaRole = role;
    await admin.auth().setCustomUserClaims(uid, claims);
    await roleRef.set({ uid, name, email: user.email || '', role, updatedAt: new Date().toISOString() });
    await roleLookupRef.set({ uid, role });
    process.stdout.write(`Provisioned ${role} role for ${uid}. Ask the user to sign out and sign in again.\n`);
  }
  await admin.app().delete();
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
