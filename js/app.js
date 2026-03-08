/**
 * ============================================================
 * HOME PAGE - Small functions, clear names, modal HTML from template string in JS.
 * API is called only in loadAllIssuesFromApi (list) and loadIssueDetailById (single issue).
 * Variables are created where they are needed; each section has per-line explanation.
 * ============================================================
 *
 * WHAT EACH LINE/SECTION DOES:
 * - PART 1: Constants used across the app (page size, API URL).
 * - PART 2: State variables (all issues list, current tab, visible count).
 * - Label helpers: getLabelBadgeClass() gives a different badge color per label (BUG=red, HELP WANTED=orange, etc.).
 * - buildLabelBadgeHtml() creates one <span> for a label; createElement() creates all labels for a card.
 * - PART 3: Search icon toggles the search panel; click outside closes it.
 * - PART 4: truncateDescriptionByLetters = cut text to max length; getFilteredIssuesByTab = filter by tab; updateIssueCountDisplay = update "5 Issues".
 * - Modal helpers: formatIssueDate, getStatusBadgeClass, getStatusDisplayText, getPriorityBadgeClass, buildModalHtml (full modal HTML string).
 * - PART 5: loadAllIssuesFromApi fetches all issues and stores in allIssuesList, then calls renderCurrentTab.
 * - renderCurrentTab filters by tab, shows slice in "All" or full list in Open/Closed, shows/hides Load more.
 * - PART 6: displayIssueCards clears container, loops each issue, builds card HTML with createElement(labels), appends and adds click -> loadIssueDetailById(id).
 * - PART 7: loadIssueDetailById gets modal + content div, shows "Loading...", fetch(apiUrl) -> response -> json() -> issue, then displayIssueInModal(issue).
 * - displayIssueInModal sets content div innerHTML = buildModalHtml(issue).
 * - PART 8: Load more button adds ISSUES_PER_PAGE to currentVisibleCount and calls renderCurrentTab.
 * - PART 9: Tab buttons set currentSelectedTabId, call renderCurrentTab, toggle btn-active class.
 * - PART 10: performIssueSearch reads search input, if empty calls renderCurrentTab; else fetch search API and displayIssueCards(results). initializeSearchInput: input event with 300ms debounce and Enter key call performIssueSearch.
 * - PART 11: Run all initializers and loadAllIssuesFromApi once.
 */

// ==================== PART 1: CONSTANTS ====================
const ISSUES_PER_PAGE = 8;                    // Number of issues to show at a time in "All" tab
const DESCRIPTION_MAX_TEXT = 50;              // Max letters to show in card description before "..."
const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';

// ==================== PART 2: STATE ====================
let allIssuesList = [];                       // Full list of issues from API (used for tabs + load more)
let currentSelectedTabId = 'all';             // Which tab is active: "all" | "open" | "closed"
let currentVisibleCount = ISSUES_PER_PAGE;   // How many issues to show in "All" tab (8, 16, 24...)

// ==================== LABEL BADGE COLORS (each label = different color) ====================
const getLabelBadgeClass = (labelName, index) => {
  const name = (labelName || '').toUpperCase().trim();
  if (name === 'BUG') return 'badge badge-error';
  if (name === 'HELP WANTED') return 'badge badge-warning';
  if (name === 'ENHANCEMENT') return 'badge badge-info';
  if (name === 'DOCUMENTATION') return 'badge badge-ghost';
  const fallbackClasses = ['badge badge-secondary', 'badge badge-accent', 'badge badge-neutral'];
  return fallbackClasses[index % fallbackClasses.length];
};
/* getLabelBadgeClass – per line: name = label uppercased. BUG→red(badge-error), HELP WANTED→orange(badge-warning), ENHANCEMENT→blue(badge-info), DOCUMENTATION→ghost. Other labels use fallbackClasses by index so each badge has a different color. */

// Builds HTML for one label badge (used in cards and modal).
const buildLabelBadgeHtml = (label, index) => {
  const badgeClass = getLabelBadgeClass(label, index);
  return `<span class="rounded-lg ${badgeClass} p-2 text-[12px] uppercase">${label}</span>`;
};

// Card labels: array of labels -> HTML string of badges (each label different color).
const createElement = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  const htmlElements = arr.map((el, index) => buildLabelBadgeHtml(el, index));
  return htmlElements.join(' ');
};

// ==================== PART 3: SEARCH TOGGLE ====================
const initializeSearchToggle = () => {
  const searchButtonElement = document.getElementById('search-btn');
  const searchInputElement = document.getElementById('search-input');
  const searchPanelElement = document.getElementById('search-toggle-panel');
  if (!searchButtonElement || !searchPanelElement) return;

  searchButtonElement.addEventListener('click', (event) => {
    event.stopPropagation();
    searchPanelElement.classList.toggle('expanded');
    if (searchPanelElement.classList.contains('expanded')) {
      searchInputElement.focus();
    } else {
      searchInputElement.blur();
    }
  });

  document.addEventListener('click', (event) => {
    const clickedInsidePanel = searchPanelElement.contains(event.target);
    const clickedOnSearchButton = searchButtonElement.contains(event.target);
    const panelIsOpen = searchPanelElement.classList.contains('expanded');
    if (!clickedInsidePanel && !clickedOnSearchButton && panelIsOpen) {
      searchPanelElement.classList.remove('expanded');
    }
  });
};

// ==================== PART 4: HELPER FUNCTIONS ====================
const truncateDescriptionByLetters = (text, maxLetters) => {
  if (!text || typeof text !== 'string') return '-';
  if (text.length <= maxLetters) return text;
  return text.slice(0, maxLetters) + ' ...';
};

const getFilteredIssuesByTab = (issuesList, tabId) => {
  if (!Array.isArray(issuesList)) return [];
  if (tabId === 'all') return issuesList;
  const statusToMatch = tabId === 'open' ? 'open' : 'closed';
  return issuesList.filter(
    (singleIssue) => (singleIssue.status || '').toLowerCase() === statusToMatch
  );
};

const updateIssueCountDisplay = (count) => {
  const countDisplayElement = document.getElementById('issue-count-text-unit');
  if (countDisplayElement) countDisplayElement.textContent = count;
};

// ---------- Modal helpers: used only when building modal HTML in JS ----------
const formatIssueDate = (createdAt) => {
  if (!createdAt) return '-';
  const date = new Date(createdAt);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const getStatusBadgeClass = (isOpen) => (isOpen ? 'badge badge-success' : 'badge bg-purple-500 text-white');

const getStatusDisplayText = (isOpen) => (isOpen ? 'Opened' : 'Closed');

const getPriorityBadgeClass = (priority) => {
  const p = (priority || '').toUpperCase();
  if (p === 'HIGH') return 'badge badge-error';
  if (p === 'LOW') return 'badge badge-ghost';
  return 'badge badge-warning';
};

// Builds the full modal HTML from issue object (template string).
const buildModalHtml = (issue) => {
  const title = issue.title || 'No title';
  const statusLower = (issue.status || '').toLowerCase();
  const isOpen = statusLower === 'open';
  const statusClass = getStatusBadgeClass(isOpen);
  const statusText = getStatusDisplayText(isOpen);
  const authorName = issue.author || issue.assignee || '-';
  const dateStr = formatIssueDate(issue.createdAt);
  const labelsList = Array.isArray(issue.labels) ? issue.labels : (issue.label ? [issue.label] : []);
  const labelsHtml = labelsList.map((label, i) => buildLabelBadgeHtml(label, i)).join(' ');
  const description = issue.description || '-';
  const assigneeName = issue.assignee || issue.author || '-';
  const priorityText = (issue.priority || '-').toUpperCase();
  const priorityClass = getPriorityBadgeClass(issue.priority);

  return `
    <form method="dialog" class="absolute right-2 top-2">
      <button type="submit" class="btn btn-sm btn-circle btn-ghost">✕</button>
    </form>
    <h2 class="font-bold text-xl pr-8 mb-2">${title}</h2>
    <div class="flex flex-wrap items-center gap-2 mb-3 text-sm text-base-content/70">
      <span class="${statusClass} text-xs">${statusText}</span>
      <span>Opened by ${authorName} • ${dateStr}</span>
    </div>
    <div class="flex flex-wrap items-center gap-2 mb-4">${labelsHtml}</div>
    <div class="mb-4 text-sm">${description}</div>
    <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
      <div>
        <span class="text-base-content/70">Assignee:</span>
        <span class="block font-medium mt-0.5">${assigneeName}</span>
      </div>
      <div>
        <span class="text-base-content/70">Priority:</span>
        <div class="mt-0.5"><span class="${priorityClass} badge-sm">${priorityText}</span></div>
      </div>
    </div>
    <form method="dialog" class="flex justify-end">
      <button type="submit" class="btn btn-primary">Close</button>
    </form>
  `;
};

// ==================== PART 5: LOAD DATA + RENDER TAB ====================
const loadAllIssuesFromApi = () => {
  const apiUrl = `${API_BASE_URL}/issues`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      allIssuesList = data.data || [];
      renderCurrentTab();
    })
    .catch((error) => console.error('[LOAD] Error:', error));
};
/* loadAllIssuesFromApi – per line: apiUrl = list endpoint. fetch(apiUrl) calls API. .then(response => response.json()) parses JSON. .then(data => ...) stores data.data in allIssuesList and calls renderCurrentTab() to show cards. .catch logs errors. */

const renderCurrentTab = () => {
  const filteredList = getFilteredIssuesByTab(allIssuesList, currentSelectedTabId);
  const loadMoreWrapperElement = document.getElementById('load-more-wrapper');

  if (currentSelectedTabId === 'all') {
    const listToDisplay = filteredList.slice(0, currentVisibleCount);
    displayIssueCards(listToDisplay);
    updateIssueCountDisplay(listToDisplay.length);
    if (loadMoreWrapperElement) {
      const hasMore = filteredList.length > currentVisibleCount;
      loadMoreWrapperElement.classList.toggle('hidden', !hasMore);
    }
  } else {
    currentVisibleCount = ISSUES_PER_PAGE;
    displayIssueCards(filteredList);
    updateIssueCountDisplay(filteredList.length);
    if (loadMoreWrapperElement) loadMoreWrapperElement.classList.add('hidden');
  }
};

// ==================== PART 6: DISPLAY CARDS ====================
const displayIssueCards = (issuesToDisplay) => {
  const cardsContainerElement = document.getElementById('cards-container');
  if (!cardsContainerElement) return;

  cardsContainerElement.innerHTML = '';
  if (!issuesToDisplay || issuesToDisplay.length === 0) {
    cardsContainerElement.innerHTML = '<p class="col-span-full text-center py-8 text-base-content/70">No issues found</p>';
    return;
  }

  issuesToDisplay.forEach((singleIssue) => {
    const isIssueOpen = (singleIssue.status || '').toLowerCase() === 'open';
    const topBorderClass = isIssueOpen ? 'border-t-4 border-t-[#00A96E]' : 'border-t-4 border-t-[#A855F7]';
    const statusImageSrc = isIssueOpen ? './assets/Open-Status.png' : './assets/Closed-Status.png';
    const statusImageAlt = isIssueOpen ? 'open-issue' : 'closed-issue';
    const shortDescription = truncateDescriptionByLetters(singleIssue.description || '', DESCRIPTION_MAX_TEXT);
    const cardWrapperElement = document.createElement('div');
    cardWrapperElement.className = `${topBorderClass} cursor-pointer h-full rounded-lg`;
    cardWrapperElement.setAttribute('data-issue-id', singleIssue.id);
    cardWrapperElement.innerHTML = `
      <div class="card card-compact shadow-lg w-full bg-base-100 h-full flex flex-col">
        <div class="top-part-card border-b-2 border-base-300 p-4 flex-1 flex flex-col min-h-0">
          <div class="flex items-center justify-between gap-2 mb-5 shrink-0">
            <img src="${statusImageSrc}" alt="${statusImageAlt}" class="w-6 h-6">
            <span class="priority-badge badge text-[12px] uppercase badge-soft badge-secondary">${singleIssue.priority || '-'}</span>
          </div>
          <div class="min-h-0 flex-1 flex flex-col justify-between">
            <h3 class="text-[14px] font-semibold mb-2">${singleIssue.title || 'No title'}</h3>
            <p class="text-sm text-base-content/70 mb-2">${shortDescription}</p>
            <div class="labels-wrapper flex items-center gap-2 mt-2">${createElement(singleIssue.labels || [])}</div>
          </div>
        </div>
        <div class="bottom-part-card p-4 space-y-2 mt-auto shrink-0 border-t border-base-300">
          <span class="text-sm w-full block text-base-content/70">By ${singleIssue.author || '-'}</span>
          <span class="text-sm w-full block text-base-content/70">${singleIssue.createdAt || '-'}</span>
        </div>
      </div>
    `;
    cardWrapperElement.addEventListener('click', () => loadIssueDetailById(singleIssue.id));
    cardsContainerElement.appendChild(cardWrapperElement);
  });
};

// ==================== PART 7: MODAL (load from API then display with template string) ====================
const loadIssueDetailById = async (issueId) => {
  const modalElement = document.getElementById('issue-modal');
  const modalContentElement = document.getElementById('modal-issue-content');
  if (!modalElement || !modalContentElement) return;
  modalContentElement.innerHTML = '<p class="text-base-content/70">Loading...</p>';
  modalElement.showModal();
  const apiUrl = `${API_BASE_URL}/issue/${issueId}`;
  try {
    const response = await fetch(apiUrl);
    const jsonData = await response.json();
    const issue = jsonData.data || jsonData;
    displayIssueInModal(issue);
  } catch (err) {
    console.error('[MODAL] Error:', err);
    modalContentElement.innerHTML = '<p class="text-error">Could not load issue details.</p>';
  }
};

const displayIssueInModal = (issue) => {
  const modalContentElement = document.getElementById('modal-issue-content');
  if (!modalContentElement) return;
  modalContentElement.innerHTML = buildModalHtml(issue);
};

/* loadIssueDetailById – per line:
   modalElement = dialog DOM node; modalContentElement = div where we put HTML.
   Set content to "Loading...", then showModal() so user sees loading state.
   apiUrl = single-issue endpoint. fetch(apiUrl) returns response; response.json() returns jsonData.
   issue = jsonData.data or jsonData (API shape may vary). displayIssueInModal(issue) fills modal with buildModalHtml(issue).
   On catch: log error and set content to error message.
   displayIssueInModal: get content div, set its innerHTML to buildModalHtml(issue) (full modal HTML from template string). */

// ==================== PART 8: LOAD MORE BUTTON ====================
const initializeLoadMoreButton = () => {
  const loadMoreButtonElement = document.getElementById('load-more-btn');
  if (!loadMoreButtonElement) return;
  loadMoreButtonElement.addEventListener('click', () => {
    currentVisibleCount += ISSUES_PER_PAGE;   // 8 kore barhao
    renderCurrentTab();                       // Abar card + count update
  });
};

// ==================== PART 9: TAB BUTTONS ====================
const initializeTabButtons = () => {
  const tabsContainerElement = document.getElementById('tabs-container');
  if (!tabsContainerElement) return;

  const allTabButton = document.querySelector('#tabs-container [data-tab="all"]');
  if (allTabButton) allTabButton.classList.add('btn-active');

  tabsContainerElement.addEventListener('click', (event) => {
    const clickedTabButton = event.target.closest('[data-tab]');
    if (!clickedTabButton) return;

    currentSelectedTabId = clickedTabButton.getAttribute('data-tab');
    renderCurrentTab();

    document.querySelectorAll('#tabs-container [data-tab]').forEach((btn) => btn.classList.remove('btn-active'));
    clickedTabButton.classList.add('btn-active');
  });
};

// ==================== PART 10: SEARCH (Live + Enter, button nai) ====================

const performIssueSearch = () => {
  const searchInputElement = document.getElementById('search-input');
  const loadMoreWrapperElement = document.getElementById('load-more-wrapper');
  if (!searchInputElement) return;
  const searchQuery = searchInputElement.value.trim();
  if (searchQuery.length === 0) {
    if (loadMoreWrapperElement) loadMoreWrapperElement.classList.remove('hidden');
    renderCurrentTab();
    return;
  }
  const searchUrl = `${API_BASE_URL}/issues/search?q=${encodeURIComponent(searchQuery)}`;
  fetch(searchUrl)
    .then((res) => res.json())
    .then((data) => {
      const resultsList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      displayIssueCards(resultsList);
      updateIssueCountDisplay(resultsList.length);
      if (loadMoreWrapperElement) loadMoreWrapperElement.classList.add('hidden');
    })
    .catch((err) => {
      console.error('[SEARCH] Error:', err);
      displayIssueCards([]);
      updateIssueCountDisplay(0);
      if (loadMoreWrapperElement) loadMoreWrapperElement.classList.add('hidden');
    });
};
/* performIssueSearch – per line: get search input and load-more wrapper. searchQuery = trimmed input. If empty, show load-more and renderCurrentTab (normal tab view). Else searchUrl = search API with q= query. fetch(searchUrl) calls API. Parse JSON; resultsList = data.data or data. displayIssueCards(resultsList) and update count; hide load-more. On catch: show empty cards, count 0, hide load-more. */

// Live search (input event, 300ms debounce) + Enter key
const initializeSearchInput = () => {
  const searchInputElement = document.getElementById('search-input');
  if (!searchInputElement) return;

  let searchTimeoutId = null;
  searchInputElement.addEventListener('input', () => {
    if (searchTimeoutId) clearTimeout(searchTimeoutId);
    searchTimeoutId = setTimeout(() => {
      performIssueSearch();
      searchTimeoutId = null;
    }, 300);
  });

  searchInputElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTimeoutId) clearTimeout(searchTimeoutId);
      searchTimeoutId = null;
      performIssueSearch();
    }
  });
};

// ==================== PART 11: RUN (sab setup ekbar) ====================
initializeSearchToggle();
initializeSearchInput();
initializeTabButtons();
initializeLoadMoreButton();
loadAllIssuesFromApi();
