const ISSUES_PER_PAGE = 8;
const DESCRIPTION_MAX_TEXT = 50;
const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';

let allIssuesList = [];
let currentSelectedTabId = 'all';
let currentVisibleCount = ISSUES_PER_PAGE;

const getLabelBadgeClass = (labelName, index) => {
  const name = (labelName || '').toUpperCase().trim();
  if (name === 'BUG') return 'badge badge-error';
  if (name === 'HELP WANTED') return 'badge badge-warning';
  if (name === 'ENHANCEMENT') return 'badge badge-info';
  if (name === 'DOCUMENTATION') return 'badge badge-accent';
  const fallbackClasses = ['badge badge-secondary', 'badge badge-success', 'badge badge-neutral'];
  return fallbackClasses[index % fallbackClasses.length];
};

const buildLabelBadgeHtml = (label, index) => {
  const badgeClass = getLabelBadgeClass(label, index);
  return `<span class="rounded-lg ${badgeClass} p-2 text-[12px] uppercase">${label}</span>`;
};

const createElement = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  const htmlElements = arr.map((el, index) => buildLabelBadgeHtml(el, index));
  return htmlElements.join(' ');
};

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
    <div class="flex flex-col gap-2">
      <h2 class="font-bold text-xl pr-8 mb-2">${title}</h2>
      <div class="flex flex-wrap items-center gap-2 mb-3 text-sm text-base-content/70">
        <span class="${statusClass} text-xs">${statusText}</span>
        <span>Opened by ${authorName} • ${dateStr}</span>
      </div>
      <div class="flex flex-wrap items-center gap-2 mb-2">${labelsHtml}</div>
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

const hideLoadingSpinner = () => {
  const spinnerWrapper = document.getElementById('loading-spinner-wrapper');
  const cardsWrapper = document.getElementById('cards-container-wrapper');
  if (spinnerWrapper) spinnerWrapper.classList.add('hidden');
  if (cardsWrapper) cardsWrapper.classList.remove('hidden');
};

const loadAllIssuesFromApi = () => {
  const apiUrl = `${API_BASE_URL}/issues`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      allIssuesList = data.data || [];
      renderCurrentTab();
      hideLoadingSpinner();
    })
    .catch(() => {
      hideLoadingSpinner();
    });
};

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

const displayIssueCards = (issuesToDisplay) => {
  const cardsContainerElement = document.getElementById('cards-container');
  if (!cardsContainerElement) return;
  cardsContainerElement.innerHTML = '';
  if (!issuesToDisplay || issuesToDisplay.length === 0) {
    cardsContainerElement.innerHTML = '<p class="col-span-full text-center py-8 text-base-content/70">No issues found</p>';
    return;
  }
  issuesToDisplay.forEach((singleIssue, index) => {
    const isIssueOpen = (singleIssue.status || '').toLowerCase() === 'open';
    const topBorderClass = isIssueOpen ? 'border-t-4 border-t-[#00A96E]' : 'border-t-4 border-t-[#A855F7]';
    const statusImageSrc = isIssueOpen ? './assets/Open-Status.png' : './assets/Closed-Status.png';
    const statusImageAlt = isIssueOpen ? 'open-issue' : 'closed-issue';
    const shortDescription = truncateDescriptionByLetters(singleIssue.description || '', DESCRIPTION_MAX_TEXT);
    const cardWrapperElement = document.createElement('div');
    cardWrapperElement.className = `anim-card ${topBorderClass} cursor-pointer h-full rounded-lg`;
    cardWrapperElement.style.animationDelay = `${index * 0.05}s`;
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
    cardWrapperElement.addEventListener('click', () => loadIssueDetailById(singleIssue));
    cardsContainerElement.appendChild(cardWrapperElement);
  });
};

const loadIssueDetailById = (idOrIssue) => {
  const modalElement = document.getElementById('issue-modal');
  const modalContentElement = document.getElementById('modal-issue-content');
  if (!modalElement || !modalContentElement) return;
  if (typeof idOrIssue === 'object' && idOrIssue !== null && idOrIssue.id != null) {
    modalContentElement.innerHTML = '';
    modalElement.showModal();
    if (window.animationsAddModalIn) window.animationsAddModalIn('issue-modal');
    displayIssueInModal(idOrIssue);
    return;
  }
  const issueId = idOrIssue;
  const cachedIssue = allIssuesList.find((i) => i.id === issueId);
  if (cachedIssue) {
    modalContentElement.innerHTML = '';
    modalElement.showModal();
    if (window.animationsAddModalIn) window.animationsAddModalIn('issue-modal');
    displayIssueInModal(cachedIssue);
    return;
  }
  modalContentElement.innerHTML = '<p class="text-error">Issue not found.</p>';
  modalElement.showModal();
};

const displayIssueInModal = (issue) => {
  const modalContentElement = document.getElementById('modal-issue-content');
  if (!modalContentElement) return;
  modalContentElement.innerHTML = buildModalHtml(issue);
};

const initializeLoadMoreButton = () => {
  const loadMoreButtonElement = document.getElementById('load-more-btn');
  if (!loadMoreButtonElement) return;
  loadMoreButtonElement.addEventListener('click', () => {
    currentVisibleCount += ISSUES_PER_PAGE;
    renderCurrentTab();
  });
};

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
    .catch(() => {
      displayIssueCards([]);
      updateIssueCountDisplay(0);
      if (loadMoreWrapperElement) loadMoreWrapperElement.classList.add('hidden');
    });
};

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

initializeSearchToggle();
initializeSearchInput();
initializeTabButtons();
initializeLoadMoreButton();
loadAllIssuesFromApi();

window.addNewIssueToApp = (issue) => {
  allIssuesList.push(issue);
  renderCurrentTab();
};
