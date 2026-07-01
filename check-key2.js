const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const crypto = require('crypto');
const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

console.log('Key exists:', !!key);
console.log('First 30 chars:', JSON.stringify(key ? key.slice(0, 30) : null));
console.log('Last 30 chars:', JSON.stringify(key ? key.slice(-30) : null));
console.log('Contains literal backslash-n:', key ? key.includes('\\n') : null);
console.log('Contains real newline:', key ? key.includes('\n') : null);

try {
  crypto.createSign('RSA-SHA256').sign(key);
  console.log('RAW (no replace): valid');
} catch (e) {
  console.log('RAW (no replace): FAILED -', e.message);
}

try {
  crypto.createSign('RSA-SHA256').sign(key.replace(/\\n/g, '\n'));
  console.log('AFTER replace(): valid');
} catch (e) {
  console.log('AFTER replace(): FAILED -', e.message);
}
