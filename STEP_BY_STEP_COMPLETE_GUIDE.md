# 🗺️ GitHub Issue Tracker – Suru Theke Sese Step-by-Step Guide

Ei note e **surur theke ses** projonto tumi **kothay ki file/folder** banabe, **kivabe** HTML (Tailwind + DaisyUI), **JS file kivabe manage** korbe, ar **kon line e console kothay** check korbe – sob line-by-line easy vabe bola hoyeche. Kono komti nei.

---

# 📁 Part A: Folder & File Structure (Prothome Ei Gulo Banao)

## Kothay ki create korbe

```
B13-A5-Github-Issue-Tracker-main/
├── index.html          ← Ekta matro HTML file (login + main dui section)
├── js/
│   └── app.js          ← Sob JS logic ekhane (manage kora easy korar jonno part e vag kore likhbi)
├── css/
│   └── style.css       ← (Optional) Jodi kichu custom style dao
└── README.md           ← Assignment requirement onujayi + question answers
```

**Keno ei structure:**
- **index.html** – Tailwind/DaisyUI CDN diye; login section + main section duita ekhane. Page reload na diye JS diye hide/show.
- **js/app.js** – Ekta file e thakle o tumi **comment diye block** vag kore likhbi (Login, Load Issues, Tabs, Cards, Modal, Search). Ete readable thakbe.
- **css/style.css** – Beshi lagbe na; jodi spinner ba kichu custom animation dao tahole.

---

# 📌 Part B: Step-by-Step Kajer Order (Kivabe Korbi – Serial e)

| Step | Kaj | Kothay Check (Console) |
|------|-----|------------------------|
| **B.1** | HTML structure + Tailwind/DaisyUI link | Browser e dekho – login form dikche kina |
| **B.2** | Login – form submit, credential check, section switch | `console.log('Login success')` |
| **B.3** | Fetch all issues API, raw data dekha | `console.log(data)` API response |
| **B.4** | Spinner show/hide + load issues | Network tab + UI e spinner |
| **B.5** | Cards render – All issues 4-column e | `console.log(issues)` array length |
| **B.6** | Tab (All/Open/Closed) – filter + active style | `console.log(currentTab)` |
| **B.7** | Card border green/purple (open/closed) | UI e dekho |
| **B.8** | Card title click → Modal open, single issue API | `console.log(issueId)` / `console.log(issue)` |
| **B.9** | Modal close (button + overlay) | Click kore test |
| **B.10** | Search – input + button, search API, result render | `console.log(searchText)`, `console.log(results)` |
| **B.11** | Responsive (mobile) | DevTools device mode |
| **B.12** | README + 5 question answer | - |

---

# 📌 Part C: index.html – Tailwind + DaisyUI (Line by Line)

## C.1 Head – CDN (Tailwind + DaisyUI)

Tailwind ar DaisyUI **CDN** diye use korbi. Egi theke install kichu lage na.

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GitHub Issue Tracker</title>
  <!-- Tailwind CSS with DaisyUI -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/daisyui@4.4.19/dist/full.min.js" crossorigin="anonymous"></script>
</head>
<body>
  <!-- content -->
  <script src="js/app.js"></script>
</body>
</html>
```

**Line by line:**
- `data-theme="light"` – DaisyUI theme (light/dark/cupcake etc. change korte paro).
- Tailwind script – tailwind class gulo kaj korbe (flex, grid, p-4, etc.).
- DaisyUI script – btn, card, modal, input style gulo ready kore dey.
- `app.js` – body er **shes** e load korbi, jate DOM ready thake.

---

## C.2 Login Section (DaisyUI/Tailwind class diye)

**Structure:** Logo → Title → Subtitle → Form (username, password, button) → Demo credential.

```html
<!-- ========== LOGIN SECTION ========== -->
<section id="login-section" class="min-h-screen flex items-center justify-center bg-base-200">
  <div class="card w-full max-w-md bg-base-100 shadow-xl">
    <div class="card-body">
      <!-- Logo / Title -->
      <h1 class="text-2xl font-bold text-center">GitHub Issue Tracker</h1>
      <p class="text-center text-base-content/70">Sign in to continue</p>

      <form id="login-form" class="form-control mt-4 gap-4">
        <input type="text" id="username" placeholder="Username" class="input input-bordered w-full" />
        <input type="password" id="password" placeholder="Password" class="input input-bordered w-full" />
        <button type="submit" class="btn btn-primary">Sign In</button>
      </form>

      <p class="text-sm text-center text-base-content/60 mt-2">
        Demo: Username: <strong>admin</strong> | Password: <strong>admin123</strong>
      </p>
    </div>
  </div>
</section>
```

**Kothay ki:**
- `min-h-screen flex items-center justify-center` – poora screen e center.
- `card`, `card-body` – DaisyUI card.
- `input input-bordered`, `btn btn-primary` – DaisyUI form.
- **ID gulo JS e use hobe:** `#login-section`, `#login-form`, `#username`, `#password`.

---

## C.3 Main Section (Start e Hidden)

Login success hole ei section dekhabe. Prothome **hidden** rakho (Tailwind: `hidden`).

```html
<!-- ========== MAIN SECTION (Dashboard) ========== -->
<section id="main-section" class="hidden min-h-screen bg-base-200">
  <!-- Navbar -->
  <div class="navbar bg-base-100 shadow-lg flex flex-wrap gap-2 justify-between px-4 py-3">
    <div class="flex items-center gap-2">
      <a class="text-xl font-bold">Issue Tracker</a>
    </div>
    <div class="flex gap-2 flex-1 max-w-md">
      <input type="text" id="search-input" placeholder="Search issues..." class="input input-bordered flex-1" />
      <button id="search-btn" class="btn btn-primary btn-sm">Search</button>
    </div>
  </div>

  <!-- Tabs -->
  <div class="container mx-auto px-4 py-4">
    <div class="tabs tabs-boxed mb-4 flex gap-2 flex-wrap">
      <button type="button" class="tab tab-active" data-tab="all">All</button>
      <button type="button" class="tab" data-tab="open">Open</button>
      <button type="button" class="tab" data-tab="closed">Closed</button>
    </div>

    <!-- Issue count / info bar (optional text) -->
    <div class="flex items-center gap-2 mb-4 text-sm text-base-content/70">
      <span id="issue-count-text">Loading...</span>
    </div>

    <!-- Loading Spinner -->
    <div id="loading-spinner" class="hidden flex justify-center items-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <!-- Cards Grid (4 columns) -->
    <div id="cards-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Cards JS diye inject hobe -->
    </div>
  </div>
</section>
```

**Kothay ki:**
- `#main-section` – JS e `.hidden` remove kore dekhabe.
- `#search-input`, `#search-btn` – search er jonno.
- `.tab` + `data-tab="all|open|closed"` – tab select + filter.
- `#issue-count-text` – “X issues” show korar jonno.
- `#loading-spinner` – DaisyUI `loading loading-spinner`; JS e show/hide.
- `#cards-container` – `grid`; JS e card gulo append korbi.

---

## C.4 Modal (Card Title Click e)

DaisyUI modal – normally hidden. JS theke class change kore open/close.

```html
<!-- ========== MODAL (Single Issue Detail) ========== -->
<dialog id="modal" class="modal">
  <div class="modal-box max-w-2xl">
    <form method="dialog">
      <button type="submit" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 class="font-bold text-lg" id="modal-title">Issue Title</h3>
    <div id="modal-body" class="py-4 text-sm">
      <!-- Description, Status, Category, Author, Priority, Label, CreatedAt -->
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="submit">close</button>
  </form>
</dialog>
```

**Kothay ki:**
- `dialog` – HTML5 dialog; DaisyUI ei tag ke style kore.
- `#modal` – JS e `.showModal()` / `.close()` use korbi.
- `#modal-title`, `#modal-body` – single issue er detail bhora.

---

# 📌 Part D: JS File Manage – Function Readable Korar Structure (app.js)

## D.1 File er moddhe block/part (comment diye)

Ekta boro file e thakleo **section comment** diye part alada kore felo. Ete kono function kothay ache bujhte subidha.

```javascript
// ==================== CONSTANTS ====================
// ==================== DOM ELEMENTS ====================
// ==================== LOGIN ====================
// ==================== LOAD & RENDER ISSUES ====================
// ==================== TABS ====================
// ==================== MODAL ====================
// ==================== SEARCH ====================
// ==================== INIT / EVENT LISTENERS ====================
```

Prothome **CONSTANTS** (API URL, demo user), tarpor **DOM** reference, tarpor **ekta ekta functionality** block.

---

## D.2 Constants Block (Line by Line)

```javascript
// ==================== CONSTANTS ====================
const API_ALL_ISSUES = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
const API_SINGLE_ISSUE = (id) => `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
const API_SEARCH = (q) => `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(q)}`;

const DEMO_USER = { username: 'admin', password: 'admin123' };
```

**Kivabe chinta korbi:**
- API base same; id ba query change hocche. Tai **function** diye URL banano (template literal).
- `encodeURIComponent(q)` – search text e space/special char thakle URL safe thake.

**Console check:** Eta run howar por kono error na. Optional: `console.log(API_SINGLE_ISSUE(33))` – URL thik ache kina.

---

## D.3 DOM Elements (Ek jaygay sob reference)

```javascript
// ==================== DOM ELEMENTS ====================
const loginSection = document.getElementById('login-section');
const mainSection = document.getElementById('main-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const tabsContainer = document.querySelector('.tabs');
const cardsContainer = document.getElementById('cards-container');
const loadingSpinner = document.getElementById('loading-spinner');
const issueCountText = document.getElementById('issue-count-text');

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
```

**Kivabe chinta korbi:** Sob element **ekbar** upore niye neoa – pore function gulo te direct use korbi. Name clear hole code pora easy.

**Console check:** Page load por `console.log(loginForm, cardsContainer)` – null na hole DOM thik ache.

---

## D.4 LOGIN Block – Line by Line

**Chinta:** Form submit → prevent reload → username/password read → match korle main section show, na hole alert.

```javascript
// ==================== LOGIN ====================
function handleLogin(event) {
  event.preventDefault();  // Form submit e page reload bondho

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Console: credential asche kina check
  console.log('Login attempt:', { username, password: password ? '***' : '' });

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    loginSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    console.log('Login success – loading issues');
    loadIssues('all');  // Prothom bar main page e issues load
  } else {
    alert('Invalid username or password. Use admin / admin123');
    console.log('Login failed – wrong credential');
  }
}

// Form submit e handleLogin call hobe (init e attach korbi)
```

**Kothay console:**
- Form submit er somoy: `Login attempt: { username: '...', password: '***' }`.
- Success: `Login success – loading issues`.
- Fail: `Login failed – wrong credential`.

---

## D.5 LOAD & RENDER ISSUES – Line by Line

### Step 1: Spinner show/hide (reusable)

```javascript
// ==================== LOAD & RENDER ISSUES ====================
function showSpinner() {
  loadingSpinner.classList.remove('hidden');
}
function hideSpinner() {
  loadingSpinner.classList.add('hidden');
}
```

**Console:** Nije test: `showSpinner()` call korle spinner dikche, `hideSpinner()` e off.

---

### Step 2: Fetch all issues

**Chinta:** API theke data ana → JSON parse → filter (all/open/closed) → cards render. Error hole catch.

```javascript
let allIssuesData = [];  // Cache – bar bar API call na korte

async function loadIssues(filter) {
  showSpinner();
  cardsContainer.innerHTML = '';  // Purano card clear

  console.log('loadIssues called, filter:', filter);

  try {
    const res = await fetch(API_ALL_ISSUES);
    const data = await res.json();
    console.log('API response (all issues):', data);  // Prothom bar structure bujhar jonno

    if (Array.isArray(data)) {
      allIssuesData = data;
    } else if (data?.data && Array.isArray(data.data)) {
      allIssuesData = data.data;  // Jodi API { data: [...] } format e dey
    } else {
      allIssuesData = [];
    }

    let filtered = allIssuesData;
    if (filter === 'open') {
      filtered = allIssuesData.filter((issue) => issue.status?.toLowerCase() === 'open');
    } else if (filter === 'closed') {
      filtered = allIssuesData.filter((issue) => issue.status?.toLowerCase() === 'closed');
    }

    console.log('Filtered issues count:', filtered.length);
    issueCountText.textContent = `${filtered.length} issue(s)`;
    renderCards(filtered);
  } catch (err) {
    console.error('Load issues error:', err);
    issueCountText.textContent = 'Failed to load issues';
  } finally {
    hideSpinner();
  }
}
```

**Kothay console:**
- `loadIssues called, filter: all` (or open/closed).
- `API response (all issues):` – full response ekbar dekhe structure bujho (array na object).
- `Filtered issues count: 10` – filter thik kaj korche kina.

---

### Step 3: Render cards (array theke HTML)

**Chinta:** Protita issue er jonno ekta card div; title, description, status, category, author, priority, label, createdAt. Open/Closed onujayi **top border** (green/purple). Title e click → modal.

```javascript
function renderCards(issues) {
  cardsContainer.innerHTML = '';
  console.log('renderCards, count:', issues?.length);

  if (!issues?.length) {
    cardsContainer.innerHTML = '<p class="col-span-full text-center py-8">No issues found</p>';
    return;
  }

  issues.forEach((issue) => {
    const isOpen = (issue.status || '').toLowerCase() === 'open';
    const borderClass = isOpen ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-purple-500';

    const card = document.createElement('div');
    card.className = `card bg-base-100 shadow-xl border ${borderClass}`;
    card.innerHTML = `
      <div class="card-body p-4">
        <h3 class="card-title text-sm cursor-pointer hover:underline" data-issue-id="${issue.id}">${issue.title || 'No title'}</h3>
        <p class="text-xs line-clamp-2">${issue.description || '-'}</p>
        <div class="flex flex-wrap gap-1 text-xs">
          <span class="badge badge-ghost">${issue.status || '-'}</span>
          <span class="badge badge-outline">${issue.category || '-'}</span>
          <span>Author: ${issue.author || '-'}</span>
          <span>Priority: ${issue.priority || '-'}</span>
          <span>Label: ${issue.label || '-'}</span>
          <span>${issue.createdAt || '-'}</span>
        </div>
      </div>
    `;

    const titleEl = card.querySelector('[data-issue-id]');
    titleEl.addEventListener('click', () => openModal(issue.id));

    cardsContainer.appendChild(card);
  });
}
```

**Line by line:**
- `isOpen` – status 'open' hole green, na hole purple.
- `borderClass` – Tailwind: `border-t-4 border-t-green-500` / `border-t-purple-500`.
- `data-issue-id` – click e kon issue er modal open hobe ta janar jonno.
- Title e click → `openModal(issue.id)`.

**Console:** `renderCards, count: 10` – render loop e asche kina.

---

## D.6 TABS Block – Line by Line

**Chinta:** Tab button e click → active class sorbo theke sorbo tab e theke aktu tab e dao → filter onujayi loadIssues call.

```javascript
// ==================== TABS ====================
function handleTabClick(event) {
  const tabBtn = event.target.closest('.tab');
  if (!tabBtn) return;

  const tab = tabBtn.getAttribute('data-tab');
  console.log('Tab clicked:', tab);

  document.querySelectorAll('.tab').forEach((el) => el.classList.remove('tab-active'));
  tabBtn.classList.add('tab-active');

  loadIssues(tab);
}
```

**Console:** `Tab clicked: open` – tab change hocche kina.

---

## D.7 MODAL Block – Line by Line

**Chinta:** Card theke issue id pawa → single issue API call (ba cached theke find) → modal e title + body set → modal open. Close → dialog close.

```javascript
// ==================== MODAL ====================
async function openModal(issueId) {
  console.log('Opening modal for issue id:', issueId);
  showSpinner();

  try {
    const res = await fetch(API_SINGLE_ISSUE(issueId));
    const issue = await res.json();
    const data = issue?.data || issue;
    console.log('Single issue:', data);

    modalTitle.textContent = data.title || 'Issue';
    modalBody.innerHTML = `
      <p><strong>Description:</strong> ${data.description || '-'}</p>
      <p><strong>Status:</strong> ${data.status || '-'}</p>
      <p><strong>Category:</strong> ${data.category || '-'}</p>
      <p><strong>Author:</strong> ${data.author || '-'}</p>
      <p><strong>Priority:</strong> ${data.priority || '-'}</p>
      <p><strong>Label:</strong> ${data.label || '-'}</p>
      <p><strong>CreatedAt:</strong> ${data.createdAt || '-'}</p>
    `;
    modal.showModal();
  } catch (err) {
    console.error('Modal load error:', err);
  } finally {
    hideSpinner();
  }
}
```

**Console:** `Opening modal for issue id: 33`, `Single issue: { ... }` – data thik asche kina.

---

## D.8 SEARCH Block – Line by Line

**Chinta:** Search box e text → button click (ba Enter) → search API → result array → renderCards.

```javascript
// ==================== SEARCH ====================
function handleSearch() {
  const query = searchInput.value.trim();
  console.log('Search query:', query);

  if (!query) {
    loadIssues('all');  // Khali hole full list
    return;
  }

  showSpinner();
  cardsContainer.innerHTML = '';

  fetch(API_SEARCH(query))
    .then((res) => res.json())
    .then((data) => {
      const list = Array.isArray(data) ? data : data?.data || [];
      console.log('Search results count:', list.length);
      issueCountText.textContent = `${list.length} result(s)`;
      renderCards(list);
    })
    .catch((err) => {
      console.error('Search error:', err);
      issueCountText.textContent = 'Search failed';
    })
    .finally(hideSpinner);
}
```

**Console:** `Search query: notifications`, `Search results count: 5`.

---

## D.9 INIT – Event Listeners (Ek jaygay)

Sob listener ekhane attach korle flow clear thake.

```javascript
// ==================== INIT / EVENT LISTENERS ====================
function init() {
  loginForm.addEventListener('submit', handleLogin);

  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', handleTabClick);
  });

  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  console.log('App initialized');
}

init();
```

**Console:** Page load e `App initialized` – script run hocche kina.

---

# 📌 Part E: Kothay Ki Console Diye Check Korbi (Summary)

| Jayga | Console / Check |
|-------|------------------|
| DOM | `console.log(loginForm, cardsContainer)` – null na |
| Login submit | `Login attempt:`, `Login success` / `Login failed` |
| loadIssues | `loadIssues called, filter:`, `API response:`, `Filtered issues count:` |
| renderCards | `renderCards, count:` |
| Tab | `Tab clicked: all/open/closed` |
| Modal | `Opening modal for issue id:`, `Single issue:` |
| Search | `Search query:`, `Search results count:` |
| Init | `App initialized` |

---

# 📌 Part F: One Page e Full Flow (Dhoron)

1. **Page load** → `init()` → login form visible.
2. **Admin / admin123** diye submit → `handleLogin` → login section hide, main section show → `loadIssues('all')`.
3. **loadIssues** → spinner → fetch → `renderCards` → spinner hide.
4. **All/Open/Closed** click → `handleTabClick` → active class + `loadIssues(tab)`.
5. **Card title** click → `openModal(id)` → fetch single issue → modal show.
6. **Modal** close → DaisyUI dialog close (button/backdrop).
7. **Search** type + click/Enter → `handleSearch` → search API → `renderCards(results)`.

---

# 📌 Part G: API Response Shape (Jodi Alada Hoy)

Assignment API jodi `{ data: [ ... ] }` format e day, tahole:

- All issues: `const list = data.data || data;`
- Single issue: `const issue = res.data || res;`

Structure bar bar `console.log(data)` diye dekhe adjust koro.

---

Ei guide onujayi tumi **ekta ek step** complete kore console diye verify koro; tarpor next step. Function gulo alada block e thakay **readable** thakbe, ar line-by-line comment/console diye **chinta sokti** barbe. Kono ekta part aro detail e chao hole bolo – oi part ta alada file e ba ekhanei expand kore debo.

---

# 📌 Part H: Folder & File Create Korar Exact Steps

1. **Project folder** khulo: `B13-A5-Github-Issue-Tracker-main`
2. **js** folder banao: andar e `app.js` file (New File → `js/app.js`)
3. **index.html** root e rakho (already README.md ache, same level e index.html)
4. (Optional) **css** folder + `style.css` – jodi custom style dao

**File create order (suggested):**
- Prothom `index.html` – head + body, CDN + login + main + modal (Part C copy kore paste).
- Tarpor `js/app.js` – prothom empty, tarpor ekta ek block (Constants → DOM → Login → …) add koro ar test koro.

---

# 📌 Part I: Full app.js (Copy Base – Hints Soho)

Tumi nijer moto kore edit korte paro. API response structure (array na `{ data: [] }`) onujayi `loadIssues` e condition adjust koro.

```javascript
// ==================== CONSTANTS ====================
const API_ALL_ISSUES = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
const API_SINGLE_ISSUE = (id) => `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
const API_SEARCH = (q) => `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(q)}`;
const DEMO_USER = { username: 'admin', password: 'admin123' };

// ==================== DOM ELEMENTS ====================
const loginSection = document.getElementById('login-section');
const mainSection = document.getElementById('main-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const tabsContainer = document.querySelector('.tabs');
const cardsContainer = document.getElementById('cards-container');
const loadingSpinner = document.getElementById('loading-spinner');
const issueCountText = document.getElementById('issue-count-text');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

// ==================== LOGIN ====================
function handleLogin(event) {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  console.log('Login attempt:', { username, password: password ? '***' : '' });
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    loginSection.classList.add('hidden');
    mainSection.classList.remove('hidden');
    console.log('Login success – loading issues');
    loadIssues('all');
  } else {
    alert('Invalid username or password. Use admin / admin123');
    console.log('Login failed');
  }
}

// ==================== SPINNER ====================
function showSpinner() { loadingSpinner.classList.remove('hidden'); }
function hideSpinner() { loadingSpinner.classList.add('hidden'); }

// ==================== LOAD & RENDER ISSUES ====================
let allIssuesData = [];

async function loadIssues(filter) {
  showSpinner();
  cardsContainer.innerHTML = '';
  console.log('loadIssues, filter:', filter);
  try {
    const res = await fetch(API_ALL_ISSUES);
    const data = await res.json();
    console.log('API response:', data);
    if (Array.isArray(data)) allIssuesData = data;
    else if (data?.data && Array.isArray(data.data)) allIssuesData = data.data;
    else allIssuesData = [];

    let filtered = allIssuesData;
    if (filter === 'open') filtered = allIssuesData.filter((i) => (i.status || '').toLowerCase() === 'open');
    else if (filter === 'closed') filtered = allIssuesData.filter((i) => (i.status || '').toLowerCase() === 'closed');

    console.log('Filtered count:', filtered.length);
    issueCountText.textContent = `${filtered.length} issue(s)`;
    renderCards(filtered);
  } catch (err) {
    console.error('Load error:', err);
    issueCountText.textContent = 'Failed to load';
  } finally {
    hideSpinner();
  }
}

function renderCards(issues) {
  cardsContainer.innerHTML = '';
  console.log('renderCards, count:', issues?.length);
  if (!issues?.length) {
    cardsContainer.innerHTML = '<p class="col-span-full text-center py-8">No issues found</p>';
    return;
  }
  issues.forEach((issue) => {
    const isOpen = (issue.status || '').toLowerCase() === 'open';
    const borderClass = isOpen ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-purple-500';
    const card = document.createElement('div');
    card.className = `card bg-base-100 shadow-xl border ${borderClass}`;
    card.innerHTML = `
      <div class="card-body p-4">
        <h3 class="card-title text-sm cursor-pointer hover:underline" data-issue-id="${issue.id}">${issue.title || 'No title'}</h3>
        <p class="text-xs line-clamp-2">${issue.description || '-'}</p>
        <div class="flex flex-wrap gap-1 text-xs">
          <span class="badge badge-ghost">${issue.status || '-'}</span>
          <span class="badge badge-outline">${issue.category || '-'}</span>
          <span>Author: ${issue.author || '-'}</span>
          <span>Priority: ${issue.priority || '-'}</span>
          <span>Label: ${issue.label || '-'}</span>
          <span>${issue.createdAt || '-'}</span>
        </div>
      </div>
    `;
    card.querySelector('[data-issue-id]').addEventListener('click', () => openModal(issue.id));
    cardsContainer.appendChild(card);
  });
}

// ==================== TABS ====================
function handleTabClick(event) {
  const tabBtn = event.target.closest('.tab');
  if (!tabBtn) return;
  const tab = tabBtn.getAttribute('data-tab');
  console.log('Tab clicked:', tab);
  document.querySelectorAll('.tab').forEach((el) => el.classList.remove('tab-active'));
  tabBtn.classList.add('tab-active');
  loadIssues(tab);
}

// ==================== MODAL ====================
async function openModal(issueId) {
  console.log('Opening modal, id:', issueId);
  showSpinner();
  try {
    const res = await fetch(API_SINGLE_ISSUE(issueId));
    const issue = await res.json();
    const data = issue?.data || issue;
    console.log('Single issue:', data);
    modalTitle.textContent = data.title || 'Issue';
    modalBody.innerHTML = `
      <p><strong>Description:</strong> ${data.description || '-'}</p>
      <p><strong>Status:</strong> ${data.status || '-'}</p>
      <p><strong>Category:</strong> ${data.category || '-'}</p>
      <p><strong>Author:</strong> ${data.author || '-'}</p>
      <p><strong>Priority:</strong> ${data.priority || '-'}</p>
      <p><strong>Label:</strong> ${data.label || '-'}</p>
      <p><strong>CreatedAt:</strong> ${data.createdAt || '-'}</p>
    `;
    modal.showModal();
  } catch (err) {
    console.error('Modal error:', err);
  } finally {
    hideSpinner();
  }
}

// ==================== SEARCH ====================
function handleSearch() {
  const query = searchInput.value.trim();
  console.log('Search:', query);
  if (!query) { loadIssues('all'); return; }
  showSpinner();
  cardsContainer.innerHTML = '';
  fetch(API_SEARCH(query))
    .then((res) => res.json())
    .then((data) => {
      const list = Array.isArray(data) ? data : data?.data || [];
      console.log('Search results:', list.length);
      issueCountText.textContent = `${list.length} result(s)`;
      renderCards(list);
    })
    .catch((err) => { console.error('Search error:', err); issueCountText.textContent = 'Search failed'; })
    .finally(hideSpinner);
}

// ==================== INIT ====================
function init() {
  loginForm.addEventListener('submit', handleLogin);
  document.querySelectorAll('.tab').forEach((btn) => btn.addEventListener('click', handleTabClick));
  searchBtn.addEventListener('click', handleSearch);
  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSearch(); });
  console.log('App initialized');
}
init();
```

**Hint:** API jodi direct array na diye `{ data: [...] }` dey, tahole `loadIssues` er moddhe `allIssuesData = data.data` part ta already ache. Response ekbar `console.log(data)` diye dekhe structure match koro.
