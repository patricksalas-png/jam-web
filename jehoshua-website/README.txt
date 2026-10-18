JEHOSHUA ACADEMY WEBSITE - PROJECT GUIDE
=========================================

FOLDER MAP
  index.html .................. page structure (top bar, menu, footer)
  css/style.css ............... all colors and looks
  js/config.js ................ SETTINGS: paste your email server link (VERIFY_URL)
  js/lessons.js ............... the lessons list (one lesson per line)
  js/content.js ............... news and events
  js/app.js ................... how the website works (pages, login, search, light/dark)
  images/logo.jpg, hero.jpg ... school logo and home banner photo
  google-apps-script/Code.gs .. email code server (goes in Google Apps Script,
                                do NOT upload it to your website)

WHERE TO CHANGE THINGS (use Ctrl+F in VS Code)
  Email server link ....... js/config.js          -> const VERIFY_URL = "paste here";
  Colors .................. css/style.css, top    -> :root { --p: ...; --a: ... }
                            (light colors first, dark colors after)
  News and events ......... js/content.js
  Add or edit a lesson .... js/lessons.js         -> copy a line, change it
                            Last part = Google Drive link or just the file ID
  Phone, email, address ... index.html (top bar + footer) and js/app.js
                            (search "0917-628-3102")
  Tuition amounts ......... js/app.js, search "Ask Business Office"
  Facebook link ........... index.html, search "facebook.com"
  Logo / banner photo ..... replace images/logo.jpg or images/hero.jpg
                            (keep the same file names)
  Page text ............... js/app.js, search the sentence you want to change

TIPS
  - Always keep a backup copy before editing.
  - Keep every quote (") and comma (,) in place.
  - Use VS Code's "Live Server" extension or double-click index.html to test.
  - Use a curly apostrophe (’) inside page text so the code does not break.

PUBLISH ON GITHUB PAGES
  1. Make a PUBLIC repository on github.com.
  2. Upload index.html and the css, js and images folders (drag them in together).
     Do NOT upload google-apps-script.
  3. Settings > Pages > Deploy from a branch > main > /(root) > Save.
  4. Your link: https://YOUR-USERNAME.github.io/REPOSITORY-NAME/
  5. To update: upload the changed file(s) again and click Commit changes.
     Press Ctrl+F5 on the site to see the new version.

EMAIL CODE SERVER (real emails)
  1. script.google.com > New project > paste google-apps-script/Code.gs > Save.
  2. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
  3. Copy the Web app URL into js/config.js (VERIFY_URL).
  Until the URL is added, the site stays in DEMO mode (code shown on screen).
  After editing Code.gs: Deploy > Manage deployments > pencil > New version.

SECURITY NOTE
  Set the lesson files in Google Drive to "Restricted to Jehoshua Academy"
  so only school accounts can open them, even if someone has the link.
