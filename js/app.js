function initSearch() {
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');
  const searchPanel = document.getElementById('search-toggle-panel');

  if (!searchBtn || !searchPanel) return;

  // Search icon click: toggle panel (smooth expand er jonno 'expanded' use)
  searchBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    searchPanel.classList.toggle('expanded');
    if (searchPanel.classList.contains('expanded')) {
      searchInput.focus();
    } else {
      searchInput.blur();
    }
  });

  // Baire click korle panel close
  document.addEventListener('click', function (e) {
    if (
      !searchPanel.contains(e.target) &&
      !searchBtn.contains(e.target) &&
      searchPanel.classList.contains('expanded')
    ) {
      searchPanel.classList.remove('expanded');
    }
  });
}

// *********************************************
// *********************************************
// *********************************************



const loadIssues = () => {
  const url = 'https://phi-lab-server.vercel.app/api/v1/lab/issues';
  fetch(url)
    .then(res => res.json())
    .then(data => displayIssues(data.data));
}

const displayIssues = (issues) => {
  const cardsContainer = document.getElementById('cards-container');
  cardsContainer.innerHTML = '';
  issues.forEach(issue => {
    const card = document.createElement('div');
    card.innerHTML = `
       <div class="card card-compact shadow-lg w-full bg-base-100">
          <div class="top-part-card border-b-2 border-base-300 p-4">
            <div class="flex items-center justify-between gap-2 mb-3 ">
              <img src="./assets/Open-Status.png" alt="open-issue" class="w-6 h-6">
              <span class="priority-badge badge text-[12px] uppercase badge-soft badge-secondary">${issue.priority}</span>
            </div>
            <div>
              <h3 class="text-[14px] font-semibold">${issue.title}</h3>
              <p class="text-sm text-base-content/70">${issue.description}</p>
            </div>
          </div>
          <div class="bottom-part-card p-4 space-y-2">
            <span class="text-sm w-full block text-base-content/70">By ${issue.author}</span>
            <span class="text-sm w-full block text-base-content/70">${issue.createdAt}</span>
          </div>
        </div>
  `;
    cardsContainer.appendChild(card);
  });
}

loadIssues();
