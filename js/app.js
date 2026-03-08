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
 * - PART 5: hideLoadingSpinner hides spinner wrapper and shows cards container. loadAllIssuesFromApi fetches all issues, stores in allIssuesList, calls renderCurrentTab, then hideLoadingSpinner (or on error).
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
  if (name === 'DOCUMENTATION') return 'badge badge-accent';
  const fallbackClasses = ['badge badge-secondary', 'badge badge-success', 'badge badge-neutral'];
  return fallbackClasses[index % fallbackClasses.length];
};
/* getLabelBadgeClass – per line: name = label uppercased. BUG→red(badge-error), HELP WANTED→orange(badge-warning), ENHANCEMENT→blue(badge-info), DOCUMENTATION→ghost. Other labels use fallbackClasses by index so each badge has a different color. */

const buildLabelBadgeHtml = (label, index) => {
  const badgeClass = getLabelBadgeClass(label, index);
  return `<span class="rounded-lg ${badgeClass} p-2 text-[12px] uppercase">${label}</span>`;
};
/* buildLabelBadgeHtml – per line: get badge class for this label and index; return one <span> with that class and label text. */

const createElement = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  const htmlElements = arr.map((el, index) => buildLabelBadgeHtml(el, index));
  return htmlElements.join(' ');
};
/* createElement – per line: if arr not array or empty return ''. Map each label to badge HTML via buildLabelBadgeHtml; join with space. */

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
/* initializeSearchToggle – per line: get search button, input, panel. On button click: stopPropagation, toggle 'expanded' on panel, focus or blur input. On document click: if click outside panel and not on button and panel is open, remove 'expanded' to close. */

// ==================== PART 4: HELPER FUNCTIONS ====================
const truncateDescriptionByLetters = (text, maxLetters) => {
  if (!text || typeof text !== 'string') return '-';
  if (text.length <= maxLetters) return text;
  return text.slice(0, maxLetters) + ' ...';
};
/* truncateDescriptionByLetters – per line: if no text or not string return '-'. If length <= maxLetters return as is. Else return first maxLetters chars plus ' ...'. */

const getFilteredIssuesByTab = (issuesList, tabId) => {
  if (!Array.isArray(issuesList)) return [];
  if (tabId === 'all') return issuesList;
  const statusToMatch = tabId === 'open' ? 'open' : 'closed';
  return issuesList.filter(
    (singleIssue) => (singleIssue.status || '').toLowerCase() === statusToMatch
  );
};
/* getFilteredIssuesByTab – per line: if issuesList not array return []. If tabId 'all' return full list. statusToMatch = 'open' or 'closed'. Return filtered array where issue.status matches. */

const updateIssueCountDisplay = (count) => {
  const countDisplayElement = document.getElementById('issue-count-text-unit');
  if (countDisplayElement) countDisplayElement.textContent = count;
};
/* updateIssueCountDisplay – per line: get element that shows issue count; set its textContent to count. */

// ---------- Modal helpers: used only when building modal HTML in JS ----------
const formatIssueDate = (createdAt) => {
  if (!createdAt) return '-';
  const date = new Date(createdAt);
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
};
/* formatIssueDate – per line: if no createdAt return '-'. Create Date, return formatted string (DD/MM/YYYY). */

const getStatusBadgeClass = (isOpen) => (isOpen ? 'badge badge-success' : 'badge bg-purple-500 text-white');
const getStatusDisplayText = (isOpen) => (isOpen ? 'Opened' : 'Closed');

const getPriorityBadgeClass = (priority) => {
  const p = (priority || '').toUpperCase();
  if (p === 'HIGH') return 'badge badge-error';
  if (p === 'LOW') return 'badge badge-ghost';
  return 'badge badge-warning';
};
/* getPriorityBadgeClass – per line: uppercase priority; HIGH→error, LOW→ghost, else→warning. */

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
    <div class="flex flex-col gap-4">
      <h2 class="font-bold text-xl pr-8 mb-5">${title}</h2>
      <div class="flex flex-wrap items-center gap-2 mb-3 text-sm text-base-content/70">
        <span class="${statusClass} text-xs">${statusText}</span>
        <span>Opened by ${authorName} • ${dateStr}</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 mb-4">${labelsHtml}</div>
      <div class="mb-4 text-sm">${description}</div>
      <div class="bg-base-200 p-4 rounded-lg flex justify-between gap-4 mb-6 text-sm">
        <div>
          <span class="text-base-content/70">Assignee:</span>
          <span class="block font-medium mt-0.5">${assigneeName}</span>
        </div>
        <div>
          <span class="text-base-content/70">Priority:</span>
          <div class="mt-0.5"><span class="${priorityClass} badge-sm">${priorityText}</span></div>
        </div>
      </div>
    </div>
    <form method="dialog" class="flex justify-end">
      <button type="submit" class="btn btn-primary">Close</button>
    </form>
  `;
};
/* buildModalHtml – per line: read issue fields (title, status, author, date, labels, description, assignee, priority). Build full modal HTML string with close form, title, status badge + meta line, labels row, description, two-column assignee/priority, Close button. Return template string. */

// ==================== PART 5: LOAD DATA + RENDER TAB ====================
const hideLoadingSpinner = () => {
  const spinnerWrapper = document.getElementById('loading-spinner-wrapper');
  const cardsWrapper = document.getElementById('cards-container-wrapper');
  if (spinnerWrapper) spinnerWrapper.classList.add('hidden');
  if (cardsWrapper) cardsWrapper.classList.remove('hidden');
};
/* hideLoadingSpinner – per line: get spinner wrapper and cards-container-wrapper DOM. Add 'hidden' to spinner; remove 'hidden' from cards wrapper so cards grid is visible. */

const loadAllIssuesFromApi = () => {
  const apiUrl = `${API_BASE_URL}/issues`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      allIssuesList = data.data || [];
      renderCurrentTab();
      hideLoadingSpinner();
    })
    .catch((error) => {
      console.error('[LOAD] Error:', error);
      hideLoadingSpinner();
    });
};
/* loadAllIssuesFromApi – per line: apiUrl = list endpoint. fetch(apiUrl) calls API. .then(response => response.json()) parses JSON. .then(data => ...) stores data.data in allIssuesList, calls renderCurrentTab() to show cards, then hideLoadingSpinner() to hide spinner and show cards area. .catch logs errors and hides spinner so user sees cards (or empty state). */

const renderCurrentTab = () => {
  const filteredList = getFilteredIssuesByTab(allIssuesList, currentSelectedTabId);
  const loadMoreWrapperElement = document.getElementById('load-more-wrapper');
  const listToDisplay = filteredList.slice(0, currentVisibleCount);
  displayIssueCards(listToDisplay);
  updateIssueCountDisplay(filteredList.length);
  if (loadMoreWrapperElement) {
    const hasMore = filteredList.length > currentVisibleCount;
    loadMoreWrapperElement.classList.toggle('hidden', !hasMore);
  }
};
/* renderCurrentTab – per line: filteredList = issues for current tab (all/open/closed). listToDisplay = first currentVisibleCount items. displayIssueCards renders them. updateIssueCountDisplay shows total filtered count. hasMore = true if more items exist; toggle Load more button visibility. */

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
/* displayIssueCards – per line: get cards container; clear it. If no issues, show "No issues found" and return. For each issue: isIssueOpen from status; set border/image/alt by open vs closed; shortDescription = truncated text; create div with classes and data-issue-id; set innerHTML with card layout (title, description, labels, author, date); add click handler to loadIssueDetailById(id); append card to container. */

// ==================== PART 7: MODAL (load from API then display with template string) ====================
const loadIssueDetailById = async (issueId) => {
  const modalElement = document.getElementById('issue-modal');
  const modalContentElement = document.getElementById('modal-issue-content');
  if (!modalElement || !modalContentElement) return;
  if (String(issueId).startsWith('local-')) {
    const localIssue = allIssuesList.find((i) => i.id === issueId);
    if (localIssue) {
      modalContentElement.innerHTML = '';
      modalElement.showModal();
      displayIssueInModal(localIssue);
      return;
    }
  }
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

/* loadIssueDetailById – per line: get modal and content div. If issueId starts with 'local-', find issue in allIssuesList, show modal and displayIssueInModal(localIssue), return (no API). Else set content "Loading...", showModal(). apiUrl = single-issue endpoint. fetch→response→jsonData; issue = jsonData.data or jsonData. displayIssueInModal(issue). On catch: log error, set content to error message. displayIssueInModal: set content div innerHTML = buildModalHtml(issue). */

// ==================== PART 8: LOAD MORE BUTTON ====================
const initializeLoadMoreButton = () => {
  const loadMoreButtonElement = document.getElementById('load-more-btn');
  if (!loadMoreButtonElement) return;
  loadMoreButtonElement.addEventListener('click', () => {
    currentVisibleCount += ISSUES_PER_PAGE;
    renderCurrentTab();
  });
};
/* initializeLoadMoreButton – per line: get Load more button. On click: add ISSUES_PER_PAGE to currentVisibleCount, call renderCurrentTab to show more cards and update count. */

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
    currentVisibleCount = ISSUES_PER_PAGE;
    renderCurrentTab();

    document.querySelectorAll('#tabs-container [data-tab]').forEach((btn) => btn.classList.remove('btn-active'));
    clickedTabButton.classList.add('btn-active');
  });
};
/* initializeTabButtons – per line: get tabs container; set first tab (all) as active. On container click: find clicked tab via closest('[data-tab]'). Set currentSelectedTabId from data-tab; reset currentVisibleCount to ISSUES_PER_PAGE; renderCurrentTab. Remove btn-active from all tabs, add to clicked tab. */

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
/* initializeSearchInput – per line: get search input. searchTimeoutId holds debounce timer. On input: clear previous timeout, set new timeout 300ms to call performIssueSearch. On Enter: preventDefault, clear timeout, call performIssueSearch immediately. */

// ==================== PART 11: RUN (sab setup ekbar) ====================
initializeSearchToggle();
initializeSearchInput();
initializeTabButtons();
initializeLoadMoreButton();
loadAllIssuesFromApi();

// Expose for newIssue.js: add new issue to list and re-render (demo only; not saved to server).
window.addNewIssueToApp = (issue) => {
  allIssuesList.push(issue);
  renderCurrentTab();
};
/* addNewIssueToApp – per line: push issue onto allIssuesList; call renderCurrentTab to re-render cards and count. */
