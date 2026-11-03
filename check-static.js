/*
 * Dependency-free pre-deployment smoke test for the GitHub Pages build.
 * Run from the repository root with: node functions/tools/check-static.js
 */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const required = [
  'index.html', 'ananta-app.js', 'ananta.css', 'ananta-luxe.css',
  'ananta-github.css', 'firebase-config.js', '.nojekyll', 'assets/ananta-mark.svg'
];
const errors = [];
const warnings = [];
const exists = (relative) => fs.existsSync(path.join(root, relative));

for (const file of required) if (!exists(file)) errors.push(`Missing required file: ${file}`);

function compile(relative) {
  if (!exists(relative)) return;
  try { new vm.Script(fs.readFileSync(path.join(root, relative), 'utf8'), { filename: relative }); }
  catch (error) { errors.push(`JavaScript syntax error in ${relative}: ${error.message}`); }
}

[
  'ananta-app.js', 'firebase-config.js', 'functions/index.js',
  'functions/tools/provision-user.js', 'functions/tools/migrate-v3-4.js'
].forEach(compile);

for (const file of ['database.rules.json', 'firebase.json', 'functions/package.json']) {
  if (!exists(file)) continue;
  try { JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')); }
  catch (error) { errors.push(`Invalid JSON in ${file}: ${error.message}`); }
}

if (exists('index.html')) {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(?:https?:|mailto:|tel:|data:|#|\/\/)/i.test(ref)) continue;
    const clean = decodeURIComponent(ref.split(/[?#]/, 1)[0]);
    if (!clean || clean === './') continue;
    const target = path.resolve(root, clean);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
      errors.push(`Broken local HTML asset reference: ${ref}`);
    }
  }
  for (const expected of ['ananta.css', 'ananta-luxe.css', 'ananta-github.css', 'ananta-app.js', 'firebase-config.js']) {
    if (!html.includes(expected)) errors.push(`index.html does not load ${expected}`);
  }
}


for (const stylesheet of ['ananta.css', 'ananta-luxe.css', 'ananta-github.css']) {
  if (!exists(stylesheet)) continue;
  const css = fs.readFileSync(path.join(root, stylesheet), 'utf8');
  for (const match of css.matchAll(/url\(\s*[\"']?([^\"')]+)[\"']?\s*\)/gi)) {
    const ref = match[1].trim();
    if (/^(?:https?:|data:|#|var\()/i.test(ref)) continue;
    const target = path.resolve(root, ref);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target)) {
      errors.push(`Broken local CSS asset reference in ${stylesheet}: ${ref}`);
    }
  }
}

const rules = exists('database.rules.json')
  ? JSON.parse(fs.readFileSync(path.join(root, 'database.rules.json'), 'utf8')) : null;
if (rules?.rules?.['.read'] === false || rules?.rules?.['.write'] === false) {
  errors.push('Root-level Realtime Database deny rules block all child rules. Keep access scoped under /ananta.');
}
if (exists('firebase-config.js')) {
  const config = fs.readFileSync(path.join(root, 'firebase-config.js'), 'utf8');
  if (/apiKey:\s*["']{2}/.test(config) || /authDomain:\s*["']{2}/.test(config)) {
    warnings.push('Firebase Web App values are placeholders; public preview works, but cloud CMS/auth/media will remain offline until configured.');
  }
}

const workflowPath = '.github/workflows/pages.yml';
if (!exists(workflowPath)) errors.push(`Missing ${workflowPath}`);
else {
  const workflow = fs.readFileSync(path.join(root, workflowPath), 'utf8');
  for (const expected of ['actions/checkout@v6', 'actions/configure-pages@v5', 'actions/upload-pages-artifact@v4', 'actions/deploy-pages@v4', 'node functions/tools/check-static.js']) {
    if (!workflow.includes(expected)) errors.push(`GitHub Pages workflow missing ${expected}`);
  }
}

if (errors.length) {
  console.error(`ANANTA static checks failed (${errors.length}):`);
  errors.forEach((item) => console.error(` - ${item}`));
  process.exitCode = 1;
} else {
  console.log('ANANTA static checks passed: required assets, JavaScript syntax, JSON configuration, local HTML references and Pages workflow.');
}
if (warnings.length) warnings.forEach((item) => console.warn(`WARNING: ${item}`));
