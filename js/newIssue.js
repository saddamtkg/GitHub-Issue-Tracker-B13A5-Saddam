(function () {
  const newIssueModal = document.getElementById('new-issue-modal');
  const newIssueForm = document.getElementById('new-issue-form');
  const addNewIssueBtn = document.getElementById('add-new-issue');
  const newIssueCancelBtn = document.getElementById('new-issue-cancel');
  const newIssueToastEl = document.getElementById('new-issue-toast');

  if (!newIssueModal || !newIssueForm || !addNewIssueBtn) return;

  addNewIssueBtn.addEventListener('click', () => {
    newIssueForm.reset();
    hideToast();
    newIssueModal.showModal();
    if (window.animationsAddModalIn) window.animationsAddModalIn('new-issue-modal');
  });

  if (newIssueCancelBtn) {
    newIssueCancelBtn.addEventListener('click', () => newIssueModal.close());
  }

  newIssueForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof window.addNewIssueToApp !== 'function') return;

    const title = document.getElementById('new-issue-title').value.trim();
    const description = document.getElementById('new-issue-description').value.trim();
    const status = document.getElementById('new-issue-status').value;
    const priority = document.getElementById('new-issue-priority').value;
    const author = document.getElementById('new-issue-author').value.trim();
    const assignee = document.getElementById('new-issue-assignee').value.trim();
    const labelsInput = document.getElementById('new-issue-labels').value.trim();
    const labels = labelsInput ? labelsInput.split(',').map((s) => s.trim()).filter(Boolean) : [];

    const issue = {
      id: 'local-' + Date.now(),
      title: title || 'No title',
      description: description || '-',
      status: status,
      priority: priority,
      author: author || '-',
      assignee: assignee || author || '-',
      labels: labels,
      createdAt: new Date().toISOString(),
    };

    window.addNewIssueToApp(issue);
    newIssueModal.close();
    newIssueForm.reset();
    showToast();
  });

  function hideToast() {
    if (!newIssueToastEl) return;
    newIssueToastEl.classList.add('hidden');
    newIssueToastEl.innerHTML = '';
  }

  function showToast() {
    if (!newIssueToastEl) return;
    newIssueToastEl.className = 'row-width mt-2';
    newIssueToastEl.classList.remove('hidden');
    newIssueToastEl.innerHTML = `
      <div class="alert alert-info shadow-lg border border-base-300">
        <div>
          <strong>Issue added to the list.</strong>
          <p class="text-sm mt-1 opacity-90">
            It is not saved on the server — it will disappear when you reload the page.
            When API support is available, new issues will be saved to the server.
          </p>
        </div>
        <button type="button" class="btn btn-sm btn-ghost" id="new-issue-toast-close">✕</button>
      </div>
    `;
    const closeBtn = newIssueToastEl.querySelector('#new-issue-toast-close');
    if (closeBtn) closeBtn.addEventListener('click', hideToast);
    newIssueToastEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(hideToast, 8000);
  }
})();
