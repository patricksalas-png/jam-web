/**
 * Jehoshua Academy - email verification server (Google Apps Script)
 * Sends a 6-character code to a school email and checks it.
 * Setup steps are in the chat message. Paste this whole file into Code.gs.
 */
const DOMAIN_RE = /^[^\s@]+@jehoshuaacademy\.org$/;
const CODE_MINUTES = 10;       // how long a code works
const MAX_TRIES = 5;           // wrong guesses allowed per code
const MAX_SENDS_PER_HOUR = 5;  // codes one email can ask for per hour

function doPost(e) {
  let out;
  try {
    const d = JSON.parse(e.postData.contents);
    const email = String(d.email || '').trim().toLowerCase();
    if (!DOMAIN_RE.test(email)) {
      out = { ok: false, error: 'Please use your school email (@jehoshuaacademy.org).' };
    } else if (d.action === 'send') {
      out = send_(email);
    } else if (d.action === 'verify') {
      out = verify_(email, String(d.code || ''));
    } else {
      out = { ok: false, error: 'Bad request.' };
    }
  } catch (err) {
    out = { ok: false, error: 'Something went wrong. Please try again.' };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

// The secret is made once and kept private inside the script.
function secret_() {
  const p = PropertiesService.getScriptProperties();
  let s = p.getProperty('SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('SECRET', s); }
  return s;
}

// We never store the code itself, only a scrambled (hashed) copy.
function hash_(email, code) {
  return Utilities.base64Encode(
    Utilities.computeHmacSha256Signature(email + ':' + code, secret_()));
}

function send_(email) {
  const cache = CacheService.getScriptCache();
  const rateKey = 'rate:' + email;
  const sent = Number(cache.get(rateKey) || 0);
  if (sent >= MAX_SENDS_PER_HOUR) {
    return { ok: false, error: 'Too many codes asked. Please try again in an hour.' };
  }
  cache.put(rateKey, String(sent + 1), 3600);

  // 6 characters, no confusing ones like 0/O or 1/I
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rnd = Utilities.getUuid().replace(/-/g, '');
  let code = '';
  for (let i = 0; i < 6; i++) code += alphabet[parseInt(rnd.substr(i * 2, 2), 16) % 32];

  cache.put('code:' + email, JSON.stringify({ h: hash_(email, code), n: 0 }), CODE_MINUTES * 60);

  MailApp.sendEmail({
    to: email,
    name: 'Jehoshua Academy',
    subject: 'Your Jehoshua Academy verification code',
    htmlBody:
      '<div style="font-family:Arial,sans-serif;max-width:420px">' +
      '<h2 style="color:#141C9E">Jehoshua Academy of Marikina</h2>' +
      '<p>Use this code to finish logging in:</p>' +
      '<p style="font-size:32px;letter-spacing:8px;font-weight:bold;background:#f3f4fb;' +
      'padding:14px;text-align:center;border-radius:8px">' + code + '</p>' +
      '<p>It works for ' + CODE_MINUTES + ' minutes. If you did not ask for it, ignore this email.</p></div>'
  });
  return { ok: true };
}

function verify_(email, code) {
  const cache = CacheService.getScriptCache();
  const key = 'code:' + email;
  const raw = cache.get(key);
  if (!raw) return { ok: false, error: 'Code expired. Please ask for a new one.' };
  const rec = JSON.parse(raw);
  if (rec.n >= MAX_TRIES) {
    cache.remove(key);
    return { ok: false, error: 'Too many tries. Please ask for a new code.' };
  }
  if (rec.h === hash_(email, code.trim().toUpperCase())) {
    cache.remove(key); // a code can only be used once
    return { ok: true };
  }
  rec.n++;
  cache.put(key, JSON.stringify(rec), CODE_MINUTES * 60);
  return { ok: false, error: 'Wrong code. Please check and try again.' };
}
