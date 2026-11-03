const admin = require('firebase-admin');
const { onSchedule } = require('firebase-functions/v2/scheduler');

admin.initializeApp();

exports.publishScheduledArticles = onSchedule('every 1 minutes', async () => {
  const database = admin.database();
  const articlesRef = database.ref('ananta/studio/articles');
  const snapshot = await articlesRef.once('value');
  const now = Date.now();
  const entries = [];
  snapshot.forEach(child => entries.push({ id: child.key, article: child.val() }));

  for (const entry of entries) {
    const article = entry.article || {};
    if (article.status !== 'scheduled' || !article.reviewed || !article.publishAt) continue;
    const publishAt = new Date(article.publishAt).getTime();
    if (!Number.isFinite(publishAt) || publishAt > now) continue;

    const articleRef = articlesRef.child(entry.id);
    const result = await articleRef.transaction(current => {
      if (!current || current.status !== 'scheduled' || !current.reviewed) return;
      const currentTime = new Date(current.publishAt || '').getTime();
      if (!Number.isFinite(currentTime) || currentTime > Date.now()) return;
      return {
        ...current,
        status: 'published',
        updatedAt: new Date().toISOString().slice(0, 10),
        publishedAt: new Date().toISOString()
      };
    }, undefined, false);

    if (result.committed && result.snapshot.exists()) {
      const published = result.snapshot.val();
      if (published.slug) {
        await database.ref(`ananta/public/articles/${published.slug}`).set(published);
      }
    }
  }
});
