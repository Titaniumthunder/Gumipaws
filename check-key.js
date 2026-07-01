const fs = require('fs');
const crypto = require('crypto');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="?(.+?)"?$/m);
if (match === null) {
  console.log('Could not find the key in .env');
  process.exit(1);
}
const key = match[1].replace(/\\n/g, '\n');
try {
  crypto.createSign('RSA-SHA256').sign(key);
  console.log('Key is valid');
} catch (e) {
  console.log('FAILED:', e.message);
}
