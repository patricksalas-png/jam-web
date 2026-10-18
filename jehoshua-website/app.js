// =====================================================
// JEHOSHUA ACADEMY WEBSITE - how it works
// Settings:  js/config.js   Lessons: js/lessons.js   News/events: js/content.js
// Colors and looks: css/style.css
// =====================================================

const $ = s => document.querySelector(s);
const app = $('#app');

// ===== Small helper tools (storage, school email check, safe text) =====
const store = {
    get(k) {
        try {
            return JSON.parse(localStorage.getItem(k));
        }
        catch (e) {
            return null;
        }
    },
    set(k, v) {
        try {
            localStorage.setItem(k, JSON.stringify(v));
        }
        catch (e) {
        }
    },
    del(k) {
        try {
            localStorage.removeItem(k);
        }
        catch (e) {
        }
    }
};
const isSchoolEmail = e => /^[^\s@]+@jehoshuaacademy\.org$/i.test((e || '').trim());
const currentUser = () => {
    const u = store.get('jam_u');
    return u && Date.now() - u.t < 432e5 ? u : null;
};
const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;'
}[c]));
const driveUrl = id => id ? (/^https?:/.test(id) ? id : 'https://drive.google.com/file/d/' + id + '/view') : '';
const toast = m => {
    const t = $('#toast');
    t.textContent = m;
    t.style.display = 'block';
    setTimeout(() => t.style.display = 'none', 2600);
};
const hashPassword = async (p) => {
    try {
        const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(p));
        return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    catch (e) {
        return btoa(p);
    }
};
const pageHeader = (t, s) => `<div class="ph">
              <div class="w">
                <h1>${t}</h1>
            <p>${s || ''}</p>
            </div>
            </div>`;
const section = (c, b, x) => `<section class="${x || ''}">
            <div class="w">${b}</div>
            </section>`;
const subs = [...new Set(LESSONS.map(x => x[1]))];
const lessonCount = s => LESSONS.filter(x => x[1] == s).length;
const newsCards = () => NEWS.map(n => `<div class="c"><span class="tag">News</span>
              <h3>${n[0]}</h3>
            <p>${n[1]}</p>
            </div>`).join('');
const eventCards = () => EVENTS.map(n => `<div class="c"><span class="tag">Coming up</span>
              <h3>${n[0]}</h3>
            <p>${n[1]}</p>
            </div>`).join('');

// ===== Header: login button and menu highlight =====
function updateHeader() {
    const u = currentUser();
    $('#auth').innerHTML = u ? `<a class="btn l" href="#/lessons">Hi, ${escapeHtml(u.name)}</a> <button class="l" style="background:transparent;color:var(--pl);border-color:var(--pl)" onclick="logout()">Log out</button>` : `<a class="btn" href="#/login">Login / Student Portal</a>`;
    document.querySelectorAll('nav a').forEach(a => a.classList.toggle('on', (location.hash || '#/home').startsWith(a.getAttribute('href')) || (a.getAttribute('href') == '#/lessons' && (location.hash || '').startsWith('#/lesson'))));
}

function logout() {
    store.del('jam_u');
    updateHeader();
    location.hash = '#/home';
    toast('You are logged out.');
}
const PAGES = {

    // Home page
    home() {
        app.innerHTML = `<div class="hero">
              <div class="w">
                <h1>Building a strong, <em>resilient</em> future, one student at a time.</h1>
                <p>Jehoshua Academy of Marikina offers quality K–12 education from Prekindergarten to Senior High School.</p>
                <a class="btn a" href="#/admissions">Apply Now</a><a class="btn o" href="#/lessons">Explore Lessons</a><a class="btn o" href="#/contact">Contact Us</a>
              </div>
            </div>` +
            section(0, `<div class="two">
              <div>
                <h2>Welcome to Jehoshua</h2>
                <p>It started in 1994 as a small mission school with three classrooms. Today it is a three-story building that holds all of our learning communities, from Prekindergarten to Senior High School.</p>
                <p>Our school year theme: <i>“One Jehoshuan family, building a resilient and sustainable future for the nation.”</i></p>
                <a class="btn l" href="#/about">Read our story</a>
              </div>
              <div class="g">
                <div class="c stat"><b>1994</b>Year founded
                </div>
                <div class="c stat"><b>PreK–12</b>All levels in one campus
                </div>
                <div class="c stat"><b>7</b>Core values: S.H.O.W.I.N.G.
                </div>
              </div>
            </div>`) +
            section(0, `<h2>Featured Lessons</h2>
            <p class="sub">Learning modules for Grades 1 to 3. ${currentUser() ? 'Open any subject below.' : '🔒 Log in with your school email to open them.'}</p>
            <div class="g">${['Mathematics', 'English', 'Filipino', 'Science', 'Araling Panlipunan', 'MAPEH'].map(s => `<a class="c" style="text-decoration:none;color:inherit" href="#/lessons" onclick="filters.s='${s}'">
            <h3>${s}</h3>
            <p>${lessonCount(s)} lessons and modules</p>
            <span class="tag">${currentUser() ? 'Open' : '🔒 Students only'}</span></a>`).join('')}</div>`, 'alt') +
            section(0, `<h2>Latest News</h2>
            <p class="sub">What’s happening in our school.</p>
            <div class="g">${newsCards()}</div>
            <p><a href="#/news">See all news and events →</a></p>`) +
            section(0, `<h2>Upcoming Events &amp; Deadlines</h2>
            <p class="sub">Exact dates are posted by the school offices.</p>
            <div class="g">${eventCards()}</div>`, 'alt') +
            section(0, `<h2>School Highlights</h2>
            <div class="g">
              <div class="c">
                <h3>Strong values</h3>
                <p>Strength, Humility, Obedience, Wisdom, Integrity, Nobility and God-fearing.</p>
              </div>
              <div class="c">
                <h3>Built from a mission</h3>
                <p>We began by giving free schooling to children from local orphanages.</p>
              </div>
              <div class="c">
                <h3>K–12 curriculum</h3>
                <p>Our lessons follow the K–12 program of the Philippines.</p>
              </div>
              <div class="c">
                <h3>Aid for students</h3>
                <p>Scholarships, discounts, ESC (Grades 7–10) and SHS vouchers may be available.</p>
              </div>
            </div>`) +
            section(0, `<h2>Ready to join the Jehoshuan family?</h2>
            <p>Start your application or ask us anything.</p>
            <a class="btn a" href="#/admissions">Apply / Enroll</a> <a class="btn o" href="#/contact">Contact Us</a> <a class="btn o" href="#/lessons">Explore Lessons</a>`, 'cta');
    },

    // About the School page
    about() {
        app.innerHTML = pageHeader('About the School', 'Jehoshua Academy of Marikina, Inc.') +
            section(0, `<h2>Our History</h2>
            <p>In June 1994, the late Kap Rudy “Odie” Francisco turned a 2,000 square meter patch of green land into a three-classroom school. It was called Mount Hebron Christian Learning Center, and it was a home for children from local orphanages who studied on full scholarship.</p>
            <p>In 1996, when the school’s name was registered, it was renamed Jehoshua. It is registered with the SEC as Jehoshua Academy of Marikina, Inc., a non-stock, non-profit school.</p>`) +
            section(0, `<div class="two">
              <div>
                <h2>Vision</h2>
                <p>To continue the transformation of being an integrated, responsive, and sustainable learning institution, resilient to an ever-changing world by the year 2030.</p>
              </div>
              <div>
                <h2>Mission</h2>
                <ul>
                  <li><b>Integrated:</b> balance among everyone in the school through respect for different cultures.</li>
                  <li><b>Responsive:</b> a tradition of excellence that meets the needs of global education.</li>
                  <li><b>Sustainable:</b> a transformative education system for modern thinking and practice.</li>
                </ul>
              </div>
            </div>`, 'alt') +
            section(0, `<h2>School Profile &amp; Values</h2>
            <p class="sub">Our core values spell SHOWING.</p>
            <div class="g">${[
                'Strength',
                'Humility',
                'Obedience',
                'Wisdom',
                'Integrity',
                'Nobility',
                'God-fearing'
            ].map(v => `<div class="c">
              <h3><span class="tag">${v[0]}</span> ${v}</h3>
            </div>`).join('')}</div>`) +
            section(0, `<h2>Campus &amp; Facilities</h2>
            <p>Our modern three-story building has classrooms, walkways and a covered court in the middle, plus service centers for the whole Jehoshuan community.</p>
            <img src="images/hero.jpg" alt="Jehoshua campus" style="width:100%;max-height:420px;object-fit:cover;border-radius:12px">`, 'alt') +
            section(0, `<h2>Why Choose Jehoshua?</h2>
            <div class="g">
              <div class="c">
                <h3>All levels, one campus</h3>
                <p>Prekindergarten to Senior High School.</p>
              </div>
              <div class="c">
                <h3>Caring community</h3>
                <p>One family that values respect and service.</p>
              </div>
              <div class="c">
                <h3>Online lessons</h3>
                <p>Students get learning materials with their school email.</p>
              </div>
              <div class="c">
                <h3>Flexible payment</h3>
                <p>Annual, semi-annual, quarterly or monthly.</p>
              </div>
            </div>`);
    },

    // Admissions and Enrollment page
    admissions() {
        const req = [
            'Original School Form 9 (SF-9) or Report Card',
            'Photocopy of PSA Birth Certificate',
            'Original Certificate of Good Moral',
            'Accomplished ESC Application Form (incoming Grade 7 applying for ESC)',
            'ESC Certificate from the previous private school (ESC grantees moving to Grades 8\u201310)',
            'Two (2) recent 2\u00D72 ID pictures'
        ];
        const ck = store.get('jam_ck') || [];
        app.innerHTML = pageHeader('Admissions &amp; Enrollment', 'Join the Jehoshuan family.') +
            section(0, `<div class="two">
              <div>
                <h2>Required Documents Checklist</h2>
                <p class="sub">Tick each one as you prepare it.</p>${req.map((r, i) => `<label style="display:block;margin:8px 0">
            <input type="checkbox" data-i="${i}" ${ck.includes(i) ? 'checked' : ''}> ${r}</label>`).join('')}<p>Submit these to the <b>Registrar’s Office</b>. Then pay the testing fee and take the entrance exam and interview.</p>
            </div>
            <div>
              <h2>How to Enroll</h2>
              <ol class="st">
                <li><b>Registration</b> – Submit documents, fill in the enrollment form and wait for checking.</li>
                <li><b>Data check</b> – Review your encoded information and ask for corrections.</li>
                <li><b>Assessment &amp; payment</b> – Go to the Cashier and pay tuition and fees.</li>
                <li><b>School account</b> – Your official school email is made or updated.</li>
                <li><b>ID picture</b> – Photo for your student ID.</li>
                <li><b>Books &amp; materials</b> – Claim books and modules.</li>
              </ol>
            </div>
            </div>`) +
            section(0, `<h2>Important Dates &amp; Notes</h2>
            <div class="g">
              <div class="c">
                <h3>Enrollment schedule</h3>
                <p>Announced through the official school channels.</p>
              </div>
              <div class="c">
                <h3>Who can enroll</h3>
                <p>Only a parent or legal guardian. Others need a signed letter and a copy of the parent’s valid ID.</p>
              </div>
              <div class="c">
                <h3>Late enrollment</h3>
                <p>Allowed if slots are open and the School Head approves.</p>
              </div>
            </div>
            <p><a class="btn" href="#/contact">Ask the Registrar</a></p>`, 'alt');
    },

    // Fees and Payments page
    fees() {
        app.innerHTML = pageHeader('Fees &amp; Payments', 'Know what to pay and how.') +
            section(0, `<h2>Tuition Fees</h2>
            <p class="sub">The school gives the tuition schedule at the Business Office before and during enrollment. Please ask there for the exact amounts.</p>
            <table>
              <tr>
                <th>Level</th>
                <th>Tuition per year</th>
                <th>Aid you may qualify for</th>
              </tr>${[
                [
                    'Prekindergarten &amp; Kindergarten',
                    'Ask Business Office',
                    'Scholarships / discounts'
                ],
                ['Grades 1–6', 'Ask Business Office', 'Scholarships / discounts'],
                [
                    'Grades 7\u201310 (Junior High)',
                    'Ask Business Office',
                    'ESC subsidy, scholarships'
                ],
                [
                    'Grades 11\u201312 (Senior High)',
                    'Ask Business Office',
                    'SHS voucher, scholarships'
                ]
            ].map(r => `<tr>
              <td>${r[0]}</td>
            <td>${r[1]}</td>
            <td>${r[2]}</td>
            </tr>`).join('')}</table>`) +
            section(0, `<div class="two">
              <div>
                <h2>Other Fees</h2>
                <ul>
                  <li>Testing fee (for the entrance exam)</li>
                  <li>Registration fee</li>
                  <li>Graduation fees (based on cost of materials)</li>
                  <li>Certificates, recommendations and transcripts (paid at the Business Office)</li>
                </ul>
              </div>
              <div>
                <h2>Payment Plans</h2>
                <ul>
                  <li>Annual</li>
                  <li>Semi-annual</li>
                  <li>Quarterly</li>
                  <li>Monthly</li>
                </ul>
                <p>Discounts may apply to tuition when paid in full. Pay only at the Business Office, bring your Student ID and keep every receipt.</p>
              </div>
            </div>`, 'alt') +
            section(0, `<h2>Refund Policy</h2>
            <ul>
              <li>Send your refund request in writing to the Registrar’s Office.</li>
              <li>The Business Office decides the amount based on how long you attended, services given and fees already spent.</li>
              <li>Testing, registration and other marked fees are not refundable.</li>
              <li>Transferring or withdrawing does not mean a full refund.</li>
            </ul>`);
    },

    // News and Events page
    news() {
        app.innerHTML = pageHeader('News &amp; Announcements', 'Stay updated.')
        + section(0, `<div class="g">${newsCards()}</div>`)
        + section(0, `<h2>Events Calendar</h2>
            <div class="g">${eventCards()}</div>`, 'alt');
    },

    // Contact Us and FAQ page
    contact() {
        const f = [
            [
                'How do I enroll?',
                'Bring the required documents to the Registrar\u2019s Office, then follow the 6 enrollment steps on the Admissions page.'
            ],
            [
                'Where do I get the tuition amounts?',
                'At the Business Office. They give the schedule of fees before and during enrollment.'
            ],
            [
                'Who can log in to the Lessons page?',
                'Only students and staff with a school email that ends with @jehoshuaacademy.org.'
            ],
            [
                'Can I pay monthly?',
                'Yes. Annual, semi-annual, quarterly and monthly plans are available.'
            ],
            [
                'I don\u2019t have a school email yet.',
                'The school makes your email in Step 4 of enrollment.'
            ]
        ];
        app.innerHTML = pageHeader('Contact Us', 'We are happy to help.')
        + section(0, `<div class="two">
              <div>
                <h2>Send a Message</h2>
                <form class="fm" id="cf">
                  <input name="n" placeholder="Your name" required>
                  <input name="e" type="email" placeholder="Your email" required>
                  <select name="t"><option>Admissions</option><option>Fees</option><option>Lessons / Portal</option><option>Other</option></select>
                  <textarea name="m" rows="5" placeholder="Your message" required></textarea>
                  <button>Send Message</button>
                </form>
              </div>
              <div>
                <h2>Visit or Call</h2>
                <p><b>Address:</b> 86 Southwest Dao Street, Marikina Heights, Marikina City<br><b>Mobile:</b> 0917-628-3102<br><b>Phone:</b> 8-696-9987<br><b>Email:</b> info@jehoshuaacademy.org</p>
                <a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Jehoshua+Academy+of+Marikina+86+Southwest+Dao+Street+Marikina+Heights">Open in Google Maps</a>
              </div>
            </div>`)
        + section(0, `<h2>Frequently Asked Questions</h2>${f.map(x => `<details>
              <summary>${x[0]}</summary>
            <p>${x[1]}</p>
            </details>`).join('')}`, 'alt');
        $('#cf').onsubmit = e => {
            e.preventDefault();
            const d = e.target;
            location.href = `mailto:info@jehoshuaacademy.org?subject=${encodeURIComponent(d.t.value + ' – ' + d.n.value)}&body=${encodeURIComponent(d.m.value + '\n\nFrom: ' + d.e.value)}`;
        };
    },

    // Policies page
    policies() {
        app.innerHTML = pageHeader('Policies', 'Privacy, terms and academic rules.')
        + section(0, `<h2>Privacy</h2>
            <p>We only collect the information needed for admission, enrollment and learning. Student records are kept by the Registrar’s Office and are not shared without a valid reason. Accounts on this website are saved only in your own browser in this demo.</p>
            <h2>Terms of Use</h2>
            <p>The Lessons page is for students and staff with a @jehoshuaacademy.org email. Do not share your login or copy the materials for other people.</p>
            <h2>Academic Policies</h2>
            <ul>
              <li>The school may deny admission for misconduct, failing school standards, rule violations, unpaid balances or full class size.</li>
              <li>Late enrollees must still finish all learning requirements for the grading period.</li>
              <li>Records and transfer papers are released only after clearance and payment of fees.</li>
            </ul>
            <p>For full details, read the Student Handbook S.Y. 2026–2027 at the Registrar’s Office.</p>`);
    },

    // Login / Sign up page
    login(m) {
        m = m || 'in';
        if (currentUser()) {
            return location.hash = '#/lessons';
        }
        app.innerHTML = pageHeader('Student Portal', 'Log in or sign up with your school email.')
        + section(0, `<div class="tabs"><button class="${m == 'in' ? 'on' : ''}" onclick="PAGES.login('in')">Log in</button><button class="${m == 'up' ? 'on' : ''}" onclick="PAGES.login('up')">Sign up</button>
            </div>
            <form class="fm" id="af">${m == 'up' ? '<input name="name" placeholder="Full name" required>' : ''}<input name="email" type="email" placeholder="you@jehoshuaacademy.org" required>
            <input name="pw" type="password" placeholder="Password (6+ characters)" required>
            <div class="err" id="msg">
            </div>
            <button>${m == 'in' ? 'Log in' : 'Create account'}</button><small>Only emails ending with <b>@jehoshuaacademy.org</b> can join.</small>
            </form>`);
        $('#af').onsubmit = async (e) => {
            e.preventDefault();
            const f = e.target;
            const em = f.email.value.trim().toLowerCase();
            const msg = $('#msg');
            if (!isSchoolEmail(em)) {
                msg.textContent = 'Please use your school email that ends with @jehoshuaacademy.org.';
                return;
            }
            if (f.pw.value.length < 6) {
                msg.textContent = 'Password needs at least 6 characters.';
                return;
            }
            const acc = store.get('jam_acc') || [];
            const h = await hashPassword(f.pw.value);
            let a = acc.find(x => x.email == em);
            if (m == 'up') {
                if (a) {
                    msg.textContent = 'This email already has an account. Please log in.';
                    return;
                }
                a = {
                    email: em,
                    name: f.name.value.trim(),
                    h
                };
            }
            else if (!a || a.h != h) {
                msg.textContent = 'Wrong email or password. New here? Click Sign up.';
                return;
            }
            msg.textContent = 'Sending your code…';
            const b = f.querySelector('button');
            b.disabled = true;
            const r = await callCodeServer('send', em);
            b.disabled = false;
            if (!r.ok) {
                msg.textContent = r.error;
                return;
            }
            showCodeStep(m, a, acc, r.demo);
        };
    },

    // Lessons list page (school email only)
    lessons() {
        if (!currentUser()) {
            return showLockScreen();
        }
        const gs = [...new Set(LESSONS.map(x => x[0]))].sort();
        app.innerHTML = pageHeader('Lessons &amp; Learning Resources', 'Choose your grade level and subject.')
        + section(0, `<div class="fl">
              <select id="fg"><option value="">All grades</option>${gs.map(g => `<option value="${g}">Grade ${g}</option>`).join('')}</select>
            <select id="fs"></select>
            <select id="ft"><option value="">All terms</option><option>1</option><option>2</option><option>3</option></select>
            <input id="fq" placeholder="Search lessons…" value="${escapeHtml(filters.q)}">
            </div>
            <p id="cnt" class="sub"></p>
            <div class="g" id="list">
            </div>`);
        const fg = $('#fg');
        const fs = $('#fs');
        const ft = $('#ft');
        const fq = $('#fq');
        fg.value = filters.g;
        ft.value = filters.t;
        const opts = () => {
            const l = [...new Set(LESSONS.filter(x => !filters.g || x[0] == filters.g).map(x => x[1]))];
            if (!l.includes(filters.s)) {
                filters.s = '';
            }
            fs.innerHTML = '<option value="">All subjects</option>' + l.map(s => `<option ${s == filters.s ? 'selected' : ''}>${s}</option>`).join('');
        };
        const fill = () => {
            const q = filters.q.toLowerCase();
            const r = LESSONS.map((x, i) => [x, i]).filter(([x]) => (!filters.g || x[0] == filters.g) && (!filters.s || x[1] == filters.s) && (!filters.t || x[2] == filters.t) && (!q || (x[4] + ' ' + x[1] + ' ' + x[5]).toLowerCase().includes(q)));
            $('#cnt').textContent = r.length + ' lessons found';
            $('#list').innerHTML = r.slice(0, 60).map(([x, i]) => `<div class="c"><span class="tag">Grade ${x[0]} · Term ${x[2]}</span>
            <h3>${escapeHtml(x[4])}</h3>
            <p>${x[1]}${x[5] ? ' – ' + x[5] : ''}</p>
            <a class="btn l" href="#/lesson/${i}">Details</a> ${driveUrl(x[7]) ? `<a class="btn" target="_blank" rel="noopener" href="${driveUrl(x[7])}">Open Lesson ↗</a>` : '<small>Link coming soon</small>'}</div>`).join('') + (r.length > 60 ? '<p>Showing the first 60. Use the filters to find more.</p>' : '');
        };
        fg.onchange = () => {
            filters.g = fg.value;
            opts();
            fill();
        };
        fs.onchange = () => {
            filters.s = fs.value;
            fill();
        };
        ft.onchange = () => {
            filters.t = ft.value;
            fill();
        };
        fq.oninput = () => {
            filters.q = fq.value;
            fill();
        };
        opts();
        fill();
    },

    // Single lesson page
    lesson(i) {
        if (!currentUser()) {
            return showLockScreen();
        }
        const x = LESSONS[i];
        if (!x) {
            return PAGES.lessons();
        }
        app.innerHTML = pageHeader(escapeHtml(x[4]), `Grade ${x[0]} · ${x[1]}${x[5] ? ' – ' + x[5] : ''} · Term ${x[2]}`)
        + section(0, `<p><a href="#/lessons">← Back to all lessons</a></p>
            <div class="two">
              <div>
                <h2>About this lesson</h2>
                <p>${x[0] == 2 ? `This is the Learning Activity Sheet (LAS) for Grade 2 ${x[1]}, Term ${x[2]}, Week ${x[3]}.` : `Module ${x[3]} of Grade ${x[0]} ${x[1]}, Term ${x[2]}. Read the lesson, do the activities, then check your answers.`}</p>
            <h3>Lesson material</h3>
            <p>${driveUrl(x[7]) ? `<a class="btn" target="_blank" rel="noopener" href="${driveUrl(x[7])}">Open Lesson on Google Drive ↗</a>` : 'The link for this lesson is not added yet.'}</p>
            </div>
            <div>
              <h2>Good to know</h2>
              <div class="c">
                <p>The lesson opens in a new tab on Google Drive. If it asks for permission, sign in with your school Google account.</p>${x[6] ? `<p><small>File: ${escapeHtml(x[6])}</small></p>` : ''}</div>
            </div>
            </div>`);
    },

    // Search results page
    search(q) {
        q = decodeURIComponent(q || '').toLowerCase();
        const searchPages = [
            [
                'About the School',
                '#/about',
                'history vision mission values campus facilities why'
            ],
            [
                'Admissions &amp; Enrollment',
                '#/admissions',
                'admission enroll requirements documents steps apply'
            ],
            ['Fees &amp; Payments', '#/fees', 'tuition fees payment refund miscellaneous'],
            ['News &amp; Events', '#/news', 'news announcement events calendar'],
            ['Contact Us &amp; FAQ', '#/contact', 'contact email phone map faq question'],
            ['Policies', '#/policies', 'privacy terms academic policy'],
            ['Lessons', '#/lessons', 'lessons modules subjects learning']
        ];
        const pr = searchPages.filter(p => (p[0] + ' ' + p[2]).toLowerCase().includes(q));
        const lr = currentUser() ? LESSONS.map((x, i) => [x, i]).filter(([x]) => (x[4] + ' ' + x[1]).toLowerCase().includes(q)).slice(0, 20) : [];
        app.innerHTML = pageHeader('Search results', `“${escapeHtml(q)}”`)
        + section(0, `<h2>Pages</h2>${pr.map(p => `<p><a href="${p[1]}">${p[0]}</a></p>`).join('') || '<p>No pages found.</p>'}<h2>Lessons</h2>${currentUser() ? (lr.map(([x, i]) => `<p><a href="#/lesson/${i}">${escapeHtml(x[4])}</a> – Grade ${x[0]} ${x[1]}</p>`).join('') || '<p>No lessons found.</p>') : '<p>🔒 <a href="#/login">Log in with your school email</a> to search lessons.</p>'}`);
    }
};

// ===== Email verification code step (login and sign up) =====
const demoCodes = {};

async function callCodeServer(act, em, code) {
    if (VERIFY_URL) {
        try {
            const r = await fetch(VERIFY_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: act,
                    email: em,
                    code: code || ''
                })
            });
            return await r.json();
        }
        catch (e) {
            return {
                ok: false,
                error: 'Could not reach the verification server. Please try again.'
            };
        }
    }
    if (act == 'send') {
        const al = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const b = crypto.getRandomValues(new Uint8Array(6));
        demoCodes[em] = {
            c: [...b].map(x => al[x % 32]).join(''),
            t: Date.now() + 6e5,
            n: 0
        };
        return {
            ok: true,
            demo: demoCodes[em].c
        };
    }
    const d = demoCodes[em];
    if (!d || Date.now() > d.t) {
        return {
            ok: false,
            error: 'Code expired. Please ask for a new one.'
        };
    }
    if (++d.n > 5) {
        delete demoCodes[em];
        return {
            ok: false,
            error: 'Too many tries. Please ask for a new code.'
        };
    }
    if ((code || '').trim().toUpperCase() == d.c) {
        delete demoCodes[em];
        return { ok: true };
    }
    return {
        ok: false,
        error: 'Wrong code. Please check and try again.'
    };
}

function showCodeStep(m, a, acc, demo) {
    app.innerHTML = pageHeader('Check your email', demo ? 'Demo mode – no email was sent' : 'We sent a 6-character code to ' + escapeHtml(a.email))
        + section(0, `${demo ? `<div class="c" style="margin-bottom:16px;max-width:460px"><b>Demo mode:</b> no email server is connected yet. Your code is <b style="font-size:1.3rem;letter-spacing:3px">${demo}</b>. Real emails are sent once the school connects the verification server.
            </div>` : ''}<form class="fm" id="vf">
              <input name="c" maxlength="6" placeholder="6-character code" autocomplete="one-time-code" style="text-transform:uppercase;letter-spacing:6px;font-size:1.4rem;text-align:center" required>
              <div class="err" id="msg">
              </div>
              <button>Verify &amp; ${m == 'in' ? 'Log in' : 'Create account'}</button><button type="button" class="btn l" id="rs">Send a new code (30s)</button><small>The code lasts 10 minutes. Check your spam folder too. <a href="#/login" onclick="PAGES.login('${m}');return false">Use a different email</a></small>
            </form>`);
    const rs = $('#rs');
    let t = 30;
    rs.disabled = true;
    const iv = setInterval(() => {
        if (!document.body.contains(rs)) {
            return clearInterval(iv);
        }
        t--;
        rs.textContent = t > 0 ? 'Send a new code (' + t + 's)' : 'Send a new code';
        if (t <= 0) {
            rs.disabled = false;
            clearInterval(iv);
        }
    }, 1000);
    rs.onclick = async () => {
        rs.disabled = true;
        const r = await callCodeServer('send', a.email);
        if (!r.ok) {
            $('#msg').textContent = r.error;
            return;
        }
        showCodeStep(m, a, acc, r.demo);
    };
    $('#vf').onsubmit = async (e) => {
        e.preventDefault();
        const msg = $('#msg');
        const b = e.target.querySelector('button');
        b.disabled = true;
        const r = await callCodeServer('verify', a.email, e.target.c.value);
        b.disabled = false;
        if (!r.ok) {
            msg.textContent = r.error;
            return;
        }
        if (m == 'up') {
            acc.push(a);
            store.set('jam_acc', acc);
        }
        store.set('jam_u', {
            email: a.email,
            name: a.name.split(' ')[0] || 'Student',
            t: Date.now()
        });
        updateHeader();
        location.hash = '#/lessons';
    };
}

// ===== Lessons page filter memory =====
const filters = {
    g: '',
    s: '',
    t: '',
    q: ''
};

// ===== Lock screen and not-found page =====
function showLockScreen() {
    app.innerHTML = pageHeader('Lessons &amp; Learning Resources', 'For Jehoshua students and staff only.')
        + section(0, `<div class="lock">
              <div style="font-size:3rem">🔒
              </div>
              <h2>Please log in first</h2>
              <p>The lessons can only be opened with a school email that ends with <b>@jehoshuaacademy.org</b>.</p>
              <a class="btn" href="#/login">Login / Student Portal</a>
            </div>`);
}

function showNotFound() {
    app.innerHTML = pageHeader('Page not found', '')
        + section(0, '<a class="btn" href="#/home">Go home</a>');
}

function renderRoute() {
    const [, p, a] = (location.hash || '#/home').split('/');
    const f = PAGES[p];
    if (!f) {
        showNotFound();
    }
    else {
        f(a);
    }
    updateHeader();
    $('#nav').classList.remove('open');
    window.scrollTo(0, 0);
}
document.addEventListener('change', e => {
    const c = e.target;
    if (c.dataset && c.dataset.i !== undefined) {
        const k = [...document.querySelectorAll('[data-i]')].filter(z => z.checked).map(z => +z.dataset.i);
        store.set('jam_ck', k);
    }
});
$('#sf').onsubmit = e => {
    e.preventDefault();
    const q = $('#q').value.trim();
    if (q) {
        location.hash = '#/search/' + encodeURIComponent(q);
    }
};
$('#mb').onclick = () => $('#nav').classList.toggle('open');

// ===== Light / dark mode switch =====
const htmlRoot = document.documentElement;
const isDark = () => {
    const t = htmlRoot.dataset.theme;
    return t ? t == 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
};
const svgIcon = d => `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
const ICONS = {
    bulb: svgIcon('M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.4 1 2.5h6c0-1.1.3-1.8 1-2.5A6 6 0 0 0 12 3z'),
    moon: svgIcon('M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z')
};

function setTheme(x) {
    if (x) {
        htmlRoot.dataset.theme = x;
        store.set('jam_th', x);
    }
    const d = isDark();
    $('#tg').innerHTML = d ? ICONS.bulb : ICONS.moon;
    $('#tg').title = d ? 'Switch to light mode' : 'Switch to dark mode';
}
$('#tg').onclick = () => setTheme(isDark() ? 'light' : 'dark');
setTheme(store.get('jam_th'));
try {
    matchMedia('(prefers-color-scheme:dark)').addEventListener('change', () => setTheme());
}
catch (e) {
}

addEventListener('hashchange', renderRoute);
renderRoute();
