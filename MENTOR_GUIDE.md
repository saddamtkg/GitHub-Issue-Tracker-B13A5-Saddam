# 🎓 GitHub Issue Tracker – Mentor Guide (Part by Part)

Ei guide ta tomake step-by-step bujhabe: HTML/CSS structure, JS functions er chinta, requirements, ar challenges. Ekdom easy vabe, part by part.

---

## 📌 Part 1: Assignment er Requirements (Ki Ki Lagbe – Highlight)

### Main Requirements (Must Have)

| # | Requirement | Short Note |
|---|-------------|------------|
| 1 | **Login Page** | Logo, title, sub-title, 2 input (username, password), sign-in button, demo credential text |
| 2 | **Main Page – Navbar** | Logo/name bam e, search input + button dan e |
| 3 | **Tab Section** | 3 tab: **All**, **Open**, **Closed** |
| 4 | **Below Tab** | Icon, issue count, text bam e; open/closed marker dan e |
| 5 | **Display** | Issues card e 4-column layout (Figma moto) |
| 6 | **Card e show** | Title, Description, Status, Category, Author, Priority, Label, CreatedAt |
| 7 | **Card click** | Card er title (tree name) e click korle **modal** open hobe, full issue info |
| 8 | **Login** | Default admin: `username: admin`, `password: admin123` diye sign in |
| 9 | **Tab switch** | All / Open / Closed click korle oi tab er data load hobe |
| 10 | **Responsive** | Mobile e responsive hona lagbe |

### API Endpoints (Jegulo use korbi)

- **All issues:** `https://phi-lab-server.vercel.app/api/v1/lab/issues`
- **Single issue (by id):** `https://phi-lab-server.vercel.app/api/v1/lab/issue/{id}`
- **Search:** `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={searchText}`

---

## 📌 Part 2: Challenges (Assignment er Challenge gulo – Highlight)

Ei gulo extra marks / impression er jonno. Sob gulo try kora valo.

| Challenge | Ki korte hobe |
|-----------|----------------|
| 1 | **Card border by category** – Open card = **green** top border, Closed card = **purple** top border |
| 2 | **Loading spinner** – Data load howar somoy spinner dekhao |
| 3 | **Active tab** – Je tab select ache, sei tab e “active” style (e.g. underline / background) |
| 4 | **Search** – Search input theke text diye API call kore search result dekhao |
| 5 | **8 meaningful commits** – Git e 8 ta meaningful commit (feature/fix wise) |

---

## 📌 Part 3: HTML Structure – Kivabe Sajabo

### 3.1 Overall Page Structure (2 ta page)

1. **Login Page** – `index.html` e thakbe, first e ei page load hobe.
2. **Main Page (Dashboard)** – Login success hole ei page (e.g. `dashboard.html` ba single page e condition diye hide/show).

**Simple approach:** Ekta `index.html` e duita “section”:
- `#login-section` (start e visible)
- `#main-section` (start e hidden, login por visible)

### 3.2 Login Page HTML Structure

```
Login Section
├── Logo (img or text)
├── Title (h1)
├── Sub-title (p)
├── Form
│   ├── Input 1: Username
│   ├── Input 2: Password
│   └── Button: Sign In
└── Demo credential text (Username: admin, Password: admin123)
```

**Example structure (semantic):**

```html
<section id="login-section">
  <div class="login-container">
    <div class="logo">...</div>
    <h1>GitHub Issue Tracker</h1>
    <p class="subtitle">Your subtitle text</p>
    <form id="login-form">
      <input type="text" id="username" placeholder="Username" />
      <input type="password" id="password" placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
    <p class="demo-credential">Username: admin | Password: admin123</p>
  </div>
</section>
```

### 3.3 Main Page HTML Structure

```
Main Section
├── Navbar
│   ├── Logo/Name (left)
│   └── Search input + Search button (right)
├── Tab Section
│   ├── Tabs: [All] [Open] [Closed]
│   ├── Bar: icon + issue count + text (left), open/closed marker (right)
│   └── (Optional) filters
└── Card Container (grid - 4 columns)
    └── Cards (dynamically JS diye add korbi)
```

**Example:**

```html
<section id="main-section" class="hidden">
  <nav class="navbar">
    <div class="logo">Issue Tracker</div>
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Search issues..." />
      <button id="search-btn">Search</button>
    </div>
  </nav>

  <div class="tabs-container">
    <div class="tabs">
      <button class="tab active" data-tab="all">All</button>
      <button class="tab" data-tab="open">Open</button>
      <button class="tab" data-tab="closed">Closed</button>
    </div>
    <div class="tab-info">
      <span class="issue-count">...</span>
      <span class="open-closed-marker">...</span>
    </div>
  </div>

  <div id="loading-spinner" class="hidden">Loading...</div>
  <div id="cards-container" class="cards-grid">
    <!-- Cards JS diye inject hobe -->
  </div>
</section>

<!-- Modal (card title click e open) -->
<div id="modal" class="modal hidden">
  <div class="modal-content">
    <button class="modal-close">&times;</button>
    <div id="modal-body"><!-- Issue details --></div>
  </div>
</div>
```

**Important IDs/Classes (JS er jonno):**

- `#login-form`, `#username`, `#password`
- `#main-section`, `#search-input`, `#search-btn`
- `.tab`, `data-tab="all|open|closed"`
- `#cards-container`, `#loading-spinner`
- `#modal`, `#modal-body`, `.modal-close`

---

## 📌 Part 4: CSS Structure – Kivabe Sajabo

### 4.1 Layout Ideas

- **Login:** Center layout – flexbox use kore `min-height: 100vh`, `justify-content: center`, `align-items: center`.
- **Navbar:** `display: flex`, `justify-content: space-between`, `align-items: center`.
- **Tabs:** 3 ta button side by side – flex/grid.
- **Cards:** **4-column grid** – `display: grid`, `grid-template-columns: repeat(4, 1fr)`. Mobile e `1fr` kore 1 column kora jay.
- **Modal:** Fixed overlay (`position: fixed`, full screen), moddhe content box. Close button top-right.

### 4.2 Card Border (Challenge)

- Open issue card: `border-top: 4px solid green;`
- Closed issue card: `border-top: 4px solid purple;`
- JS theke card create korar somoy `status` / `category` onujayi ekta class add korbi, e.g. `.card.open`, `.card.closed`.

### 4.3 Active Tab

- `.tab.active` – background color ba border-bottom diye highlight koro.

### 4.4 Responsive (Mobile)

- `@media (max-width: 768px)` (or 576px):
  - Grid: `grid-template-columns: 1fr;` (1 column).
  - Navbar: stack kora (flex-direction: column) ba search full width.
  - Font size, padding kom kora.

### 4.5 Spinner

- Ekta div with class `.spinner` – CSS e animation (rotate) diye loading icon. JS theke load start e show, data load hoye gele hide.

---

## 📌 Part 5: JavaScript – Function Chinta (Step by Step)

Tomar “function chinta” strong korar jonno, ekta ekta kaj ke alada function e vag kore chinta koro.

### 5.1 Data Load – “Kichu load korte hole ki ki lagbe?”

- **Fetch** = API theke data ana.
- **Thought:** “Amake ekta URL theke data niye ashte hobe” → **function: `fetchIssues(url)`** ba `loadIssues(filter)`.
- Filter = 'all' | 'open' | 'closed'. URL same thakle (all issues), tarpor client e filter korte paro, ba API onujayi alada URL (jodi thake).

**Mental model:**

```
loadIssues(filter)
  → spinner show
  → fetch(API_URL)
  → parse JSON
  → filter by status (all / open / closed) jodi client e koro
  → renderCards(data)
  → spinner hide
```

### 5.2 Login – “User ke verify kore main page e pathabo”

- **Thought:** “Form submit hole username/password check kore, thik hole main section show korbo.”
- **function: `handleLogin(event)`**
  - `event.preventDefault()` – form reload bondho.
  - `username === 'admin' && password === 'admin123'` → login success.
  - Success: `loginSection.classList.add('hidden')`, `mainSection.classList.remove('hidden')`, maybe `loadIssues('all')` call.
  - Fail: alert ba error message.

### 5.3 Tab Change – “Tab e click korle ki hobe?”

- **Thought:** “Button e click hole filter change hobe, UI update hobe.”
- **function: `handleTabClick(event)`**
  - Kon tab e click hoyeche ta `data-tab` theke nebe (all/open/closed).
  - Sob `.tab` theke `active` class remove, je tab e click hoyeche sei tab e `active` add.
  - `loadIssues(selectedTab)` ba already loaded data theke filter kore `renderCards(filteredData)`.

### 5.4 Cards Render – “Data theke UI banabo”

- **Thought:** “Array of issues → protita issue er jonno ekta card HTML.”
- **function: `renderCards(issues)`**
  - `cardsContainer.innerHTML = ''` (purano clear).
  - `issues.forEach(issue => { ... })` – protita issue er jonno:
    - Card element banao (createElement ba template string).
    - Card e: Title, Description, Status, Category, Author, Priority, Label, CreatedAt.
    - Open/Closed onujayi top border class (green/purple).
    - Title e click listener: `openModal(issue.id)` ba `openModal(issue)`.

### 5.5 Modal – “Ekta issue er detail dekhabo”

- **Thought:** “Card e click → modal open, single issue er data load (by id) ba already issue object pass kore detail show.”
- **function: `openModal(issueId)`** ba `openModal(issue)`
  - Modal theke: single issue API call `GET .../issue/{id}` ba direct `issue` use.
  - `modalBody` e title, description, status, category, author, priority, label, createdAt set koro.
  - Modal show: `modal.classList.remove('hidden')`.
- **function: `closeModal()`**
  - Close button / overlay click e `modal.classList.add('hidden')`.

### 5.6 Search – “Search text diye result dekhabo”

- **Thought:** “Search box e text diye button click (ba Enter) → API te search query pathabo.”
- **function: `handleSearch()`**
  - `searchText = searchInput.value.trim()`.
  - URL: `.../issues/search?q=${encodeURIComponent(searchText)}`.
  - Fetch kore result niye `renderCards(results)`.

### 5.7 Spinner – “Load howar somoy dekhabo”

- **function: `showSpinner()`** – spinner element theke `hidden` remove.
- **function: `hideSpinner()`** – spinner e `hidden` add.
- Fetch er age `showSpinner()`, fetch complete (then/catch) e `hideSpinner()`.

---

## 📌 Part 6: Function Summary (Ek Line e Ki Kaj)

| Function | Kaj |
|----------|-----|
| `handleLogin(e)` | Form submit handle, credential check, login/main section switch |
| `loadIssues(filter)` | API theke issues load, spinner, then renderCards |
| `renderCards(issues)` | Issues array theke card HTML baniye container e add, card click → modal |
| `handleTabClick(e)` | Tab select, active class update, loadIssues(filter) call |
| `openModal(id/issue)` | Modal e issue detail show, modal visible |
| `closeModal()` | Modal hide |
| `handleSearch()` | Search API call, result renderCards e pathano |
| `showSpinner()` / `hideSpinner()` | Loading state show/hide |

---

## 📌 Part 7: Flow (Ekdom Short)

1. Page load → Login section visible.
2. Admin/admin123 diye login → Main section visible, `loadIssues('all')`.
3. All/Open/Closed tab → `loadIssues(tab)` + active tab style.
4. Card title click → Modal open, issue detail.
5. Search type + Search click → Search API → result cards.
6. Card border: open = green, closed = purple (class theke).

---

## 📌 Part 8: Pro Hote Kivabe Chinta Korbi (Mindset)

1. **Ek time e ekta kaj** – Login, tab, card, modal, search alada alada function. Ekta function e besi kaj na.
2. **Name meaningful dao** – `handleLogin`, `renderCards`, `openModal` – naam thekei bujhe jabi ki korche.
3. **Data flow clear rakho** – API → data → render. Data kothay theke asche, kothay jacche seta clear thakle bug kom.
4. **Console.log use koro** – API response, filter result, event object – projonto debug e help kore.
5. **Small step e test** – Login complete kore test, tarpor card load, tarpor modal. Ek sathe sob na kore alada alada test koro.

---

## 📌 Part 9: Checklist (Submit er Age)

- [ ] Login page – design + credential check
- [ ] Main page – navbar + search
- [ ] 3 tabs – All, Open, Closed + active style
- [ ] Cards – 4-column, all fields (title, description, status, category, author, priority, label, createdAt)
- [ ] Card top border – open = green, closed = purple
- [ ] Card title click → modal with full info
- [ ] Loading spinner
- [ ] Search functionality
- [ ] Mobile responsive
- [ ] 8 meaningful Git commits
- [ ] README + question answers (nijer lekha, copy-paste na)

---

Tomar next step: **QUESTION_ANSWERS_BUNGLISH.md** file ta kholo – README er 5 ta question er answer Bunglish e sekhane dewa ache. Ar kono part jodi aro detail e chao, bolo kon part (e.g. “modal ta aro step by step bolo” ba “fetch code exact kivabe likhbo”).
