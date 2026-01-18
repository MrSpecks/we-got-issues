// API Base URL
const API_BASE_URL = '/api/v1/issues';

// DOM Elements
const createIssueBtn = document.getElementById('createIssueBtn');
const createIssueModal = document.getElementById('createIssueModal');
const editIssueModal = document.getElementById('editIssueModal');
const issuesContainer = document.getElementById('issuesContainer');
const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');
const searchInput = document.getElementById('searchInput');
const statsOpen = document.getElementById('statsOpen');
const statsInProgress = document.getElementById('statsInProgress');
const statsClosed = document.getElementById('statsClosed');
const statsTotal = document.getElementById('statsTotal');

// Store all issues globally
let allIssues = [];

// ==================== API Methods ====================

async function fetchIssues() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch issues');
    allIssues = await response.json();
    updateStats();
    renderIssues(allIssues);
    hideLoading();
  } catch (error) {
    showAlert('error', `Failed to load issues: ${error.message}`);
    hideLoading();
  }
}

async function createIssue(payload) {
  try {
    showLoading('Creating issue...');
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create issue');
    }

    const newIssue = await response.json();
    allIssues.push(newIssue);
    updateStats();
    renderIssues(allIssues);
    closeCreateModal();
    showAlert('success', '✨ Issue created successfully! Time to fix it (or procrastinate).');
    hideLoading();
  } catch (error) {
    showAlert('error', `Failed to create issue: ${error.message}`);
    hideLoading();
  }
}

async function updateIssue(issueId, payload) {
  try {
    showLoading('Updating issue...');
    const response = await fetch(`${API_BASE_URL}/${issueId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update issue');
    }

    const updatedIssue = await response.json();
    const index = allIssues.findIndex(i => i.id === issueId);
    if (index !== -1) {
      allIssues[index] = updatedIssue;
    }
    updateStats();
    renderIssues(allIssues);
    closeEditModal();
    showAlert('success', 'Issue updated. You got this! 💪');
    hideLoading();
  } catch (error) {
    showAlert('error', `Failed to update issue: ${error.message}`);
    hideLoading();
  }
}

async function deleteIssue(issueId) {
  if (!confirm('Are you sure? This issue will be gone forever. No backsies. 🗑️')) {
    return;
  }

  try {
    showLoading('Deleting issue...');
    const response = await fetch(`${API_BASE_URL}/${issueId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to delete issue');
    }

    allIssues = allIssues.filter(i => i.id !== issueId);
    updateStats();
    renderIssues(allIssues);
    showAlert('success', 'Issue deleted. Poof! It\'s gone. 👻');
    hideLoading();
  } catch (error) {
    showAlert('error', `Failed to delete issue: ${error.message}`);
    hideLoading();
  }
}

// ==================== UI Rendering ====================

function renderIssues(issues) {
  if (issues.length === 0) {
    issuesContainer.innerHTML = `
      <div class="no-issues">
        <div class="no-issues-icon">🤷</div>
        <div class="no-issues-title">No Issues Found</div>
        <p class="no-issues-text">Either you're doing great or you're not looking hard enough.</p>
      </div>
    `;
    return;
  }

  issuesContainer.innerHTML = issues.map(issue => `
    <div class="issue-item">
      <div class="issue-content">
        <div class="issue-header">
          <span class="issue-id">#${issue.id.substring(0, 8)}</span>
          <h3 class="issue-title">${escapeHtml(issue.title)}</h3>
        </div>
        <p class="issue-description">${escapeHtml(issue.description)}</p>
        <div class="issue-meta">
          <span class="badge badge-status ${issue.status}">${formatLabel(issue.status)}</span>
          <span class="badge badge-priority ${issue.priority}">${formatLabel(issue.priority)}</span>
        </div>
      </div>
      <div class="issue-actions">
        <button class="btn btn-secondary btn-small" onclick="openEditModal('${issue.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteIssue('${issue.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function updateStats() {
  const open = allIssues.filter(i => i.status === 'open').length;
  const inProgress = allIssues.filter(i => i.status === 'in_progress').length;
  const closed = allIssues.filter(i => i.status === 'closed').length;

  statsOpen.textContent = open;
  statsInProgress.textContent = inProgress;
  statsClosed.textContent = closed;
  statsTotal.textContent = allIssues.length;
}

// ==================== Modal Management ====================

function openCreateModal() {
  createIssueModal.classList.add('active');
  document.getElementById('createForm').reset();
  document.getElementById('formTitle').focus();
}

function closeCreateModal() {
  createIssueModal.classList.remove('active');
}

function openEditModal(issueId) {
  const issue = allIssues.find(i => i.id === issueId);
  if (!issue) return;

  document.getElementById('editIssueId').value = issue.id;
  document.getElementById('editTitle').value = issue.title;
  document.getElementById('editDescription').value = issue.description;
  document.getElementById('editPriority').value = issue.priority;
  document.getElementById('editStatus').value = issue.status;

  editIssueModal.classList.add('active');
  document.getElementById('editTitle').focus();
}

function closeEditModal() {
  editIssueModal.classList.remove('active');
}

// ==================== Form Handling ====================

document.getElementById('createForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('formTitle').value.trim();
  const description = document.getElementById('formDescription').value.trim();
  const priority = document.getElementById('formPriority').value;

  if (!title || !description) {
    showAlert('error', 'Please fill in all required fields.');
    return;
  }

  await createIssue({ title, description, priority });
});

document.getElementById('editForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const issueId = document.getElementById('editIssueId').value;
  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  const priority = document.getElementById('editPriority').value;
  const status = document.getElementById('editStatus').value;

  if (!title || !description) {
    showAlert('error', 'Please fill in all required fields.');
    return;
  }

  await updateIssue(issueId, { title, description, priority, status });
});

// ==================== Filtering and Searching ====================

function applyFilters() {
  let filtered = [...allIssues];

  const statusFilter = filterStatus?.value;
  const priorityFilter = filterPriority?.value;
  const searchTerm = searchInput?.value.toLowerCase().trim();

  if (statusFilter && statusFilter !== 'all') {
    filtered = filtered.filter(i => i.status === statusFilter);
  }

  if (priorityFilter && priorityFilter !== 'all') {
    filtered = filtered.filter(i => i.priority === priorityFilter);
  }

  if (searchTerm) {
    filtered = filtered.filter(i =>
      i.title.toLowerCase().includes(searchTerm) ||
      i.description.toLowerCase().includes(searchTerm)
    );
  }

  renderIssues(filtered);
}

// ==================== Event Listeners ====================

createIssueBtn?.addEventListener('click', openCreateModal);

document.getElementById('createModalClose')?.addEventListener('click', closeCreateModal);
document.getElementById('editModalClose')?.addEventListener('click', closeEditModal);

// Close modal when clicking overlay
createIssueModal?.addEventListener('click', (e) => {
  if (e.target === createIssueModal) closeCreateModal();
});

editIssueModal?.addEventListener('click', (e) => {
  if (e.target === editIssueModal) closeEditModal();
});

// Filter listeners
filterStatus?.addEventListener('change', applyFilters);
filterPriority?.addEventListener('change', applyFilters);
searchInput?.addEventListener('input', applyFilters);

// ==================== Alert Management ====================

function showAlert(type, message) {
  const alertsContainer = document.getElementById('alerts');
  if (!alertsContainer) return;

  const alertId = `alert-${Date.now()}`;
  const alertHTML = `
    <div class="alert alert-${type}" id="${alertId}">
      <span>${message}</span>
      <button class="alert-close" onclick="document.getElementById('${alertId}').remove()">×</button>
    </div>
  `;

  alertsContainer.insertAdjacentHTML('beforeend', alertHTML);

  // Auto-remove success/info alerts after 4 seconds
  if (type === 'success' || type === 'info') {
    setTimeout(() => {
      const alert = document.getElementById(alertId);
      if (alert) alert.remove();
    }, 4000);
  }
}

// ==================== Loading State ====================

function showLoading(message = 'Loading...') {
  const loading = document.getElementById('loadingState');
  if (loading) {
    loading.innerHTML = `
      <div class="loading">
        <div class="spinner"></div>
        <span class="loading-message">${message}</span>
      </div>
    `;
    loading.classList.remove('hidden');
  }
}

function hideLoading() {
  const loading = document.getElementById('loadingState');
  if (loading) {
    loading.classList.add('hidden');
  }
}

// ==================== Utility Functions ====================

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatLabel(text) {
  return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ==================== Keyboard Shortcuts ====================

document.addEventListener('keydown', (e) => {
  // Escape to close modals
  if (e.key === 'Escape') {
    closeCreateModal();
    closeEditModal();
  }

  // Ctrl+N or Cmd+N to create new issue
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    e.preventDefault();
    openCreateModal();
  }

  // Ctrl+/ or Cmd+/ to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === '/') {
    e.preventDefault();
    searchInput?.focus();
  }
});

// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', () => {
  showLoading('Loading your glorious issues...');
  fetchIssues();
});
