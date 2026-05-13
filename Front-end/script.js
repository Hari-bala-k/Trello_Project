const API_BASE = 'http://localhost:8083';

const boardGrid = document.getElementById('boardsGrid');
const emptyBoards = document.getElementById('emptyBoards');
const dashboardView = document.getElementById('dashboardView');
const boardDetailView = document.getElementById('boardDetailView');
const boardTitle = document.getElementById('boardTitle');
const boardSubtitle = document.getElementById('boardSubtitle');
const listsContainer = document.getElementById('listsContainer');
const emptyLists = document.getElementById('emptyLists');
const spinnerOverlay = document.getElementById('spinnerOverlay');
const toastContainer = document.getElementById('toastContainer');
const modalOverlay = document.getElementById('modalOverlay');

const openBoardModalButtons = [
  document.getElementById('openBoardModal'),
  document.getElementById('openBoardModalTop'),
  document.getElementById('openBoardModalEmpty'),
];

const openListModalButtons = [
  document.getElementById('openListModal'),
  document.getElementById('openListModalEmpty'),
];

const boardModal = document.getElementById('boardModal');
const listModal = document.getElementById('listModal');

const boardForm = document.getElementById('boardForm');
const listForm = document.getElementById('listForm');

const boardNameInput = document.getElementById('boardNameInput');
const listNameInput = document.getElementById('listNameInput');

const backToDashboardBtn = document.getElementById('backToDashboard');
const themeToggle = document.getElementById('themeToggle');

let boards = [];
let currentBoard = null;
let lists = [];
let tasks = {};

window.addEventListener('DOMContentLoaded', initApp);

async function initApp() {
  setupModalListeners();
  bindEvents();
  renderTheme();
  await refreshBoards();
}

function bindEvents() {
  openBoardModalButtons.forEach((btn) => {
    btn.addEventListener('click', openBoardDialog);
  });

  openListModalButtons.forEach((btn) => {
    btn.addEventListener('click', openListDialog);
  });

  backToDashboardBtn.addEventListener('click', showDashboard);

  boardForm.addEventListener('submit', handleBoardSubmit);
  listForm.addEventListener('submit', handleListSubmit);

  themeToggle.addEventListener('click', toggleTheme);
}

function setupModalListeners() {
  [boardModal, listModal].forEach((dialog) => {

    dialog.addEventListener('close', hideModalOverlay);

    dialog.addEventListener('cancel', hideModalOverlay);

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });

  document.querySelectorAll('[data-close]').forEach((btn) => {

    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');

      if (dialog) {
        dialog.close();
      }
    });
  });
}

function toggleTheme() {
  document.documentElement.classList.toggle('light-theme');
  renderTheme();
}

function renderTheme() {

  const isLight = document.documentElement.classList.contains('light-theme');

  if (isLight) {

  document.documentElement.style.setProperty('--bg', '#f8f5f0');

  document.documentElement.style.setProperty('--surface', 'rgba(255,255,255,0.92)');

  document.documentElement.style.setProperty('--surface-strong', 'rgba(255,255,255,0.98)');

  document.documentElement.style.setProperty('--surface-soft', 'rgba(245,240,235,0.9)');

  /* TEXT COLORS */
  document.documentElement.style.setProperty('--text', '#1a1a1a');

  document.documentElement.style.setProperty('--muted', '#5f5f5f');

  document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.08)');

  document.documentElement.style.setProperty('--shadow', '0 24px 80px rgba(0,0,0,0.12)');

  document.body.style.background =
    'linear-gradient(rgba(255,255,255,0.82), rgba(255,255,255,0.88)), url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1920&auto=format&fit=crop")';

  document.body.style.backgroundSize = 'cover';

  document.body.style.backgroundPosition = 'center';

  document.body.style.backgroundAttachment = 'fixed';

  themeToggle.textContent = 'Dark Mode';

}

   else {

    document.documentElement.style.setProperty('--bg', '#0e1121');
    document.documentElement.style.setProperty('--surface', 'rgba(22,28,48,0.86)');
    document.documentElement.style.setProperty('--surface-strong', 'rgba(19,25,42,0.98)');
    document.documentElement.style.setProperty('--surface-soft', 'rgba(30,37,60,0.7)');
    document.documentElement.style.setProperty('--text', '#f6f7fb');
    document.documentElement.style.setProperty('--muted', '#98a0c2');
    document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.12)');
    document.documentElement.style.setProperty('--shadow', '0 24px 80px rgba(0,0,0,0.22)');

    document.body.style.background =
      'radial-gradient(circle at top, rgba(124,92,255,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(54,214,162,0.14), transparent 24%), #050714';

    themeToggle.textContent = 'Light mode';
  }
}

async function refreshBoards() {

  showSpinner();

  try {

    boards = await fetchBoards();

    renderBoardList();

  } catch (error) {

    showToast('Unable to load boards. Backend may not be running.', 'danger');

  } finally {

    hideSpinner();
  }
}

async function fetchBoards() {

  const response = await fetch(`${API_BASE}/board/get`);

  if (!response.ok) {
    throw new Error('Could not fetch boards');
  }

  return await response.json();
}

async function fetchLists(boardId) {

  const response = await fetch(`${API_BASE}/list/get/${boardId}`);

  if (!response.ok) {
    throw new Error('Could not fetch lists');
  }

  return await response.json();
}

async function handleBoardSubmit(event) {

  event.preventDefault();

  const name = boardNameInput.value.trim();

  if (!name) {
    showToast('Please enter board name', 'danger');
    return;
  }

  showSpinner();

  try {

    await createBoard({
      boardName: name
    });

    boardModal.close();

    boardNameInput.value = '';

    await refreshBoards();

    showToast('Board created successfully!', 'success');

  } catch (error) {

    showToast('Failed to create board.', 'danger');

  } finally {

    hideSpinner();
  }
}

async function createBoard(data) {

  const response = await fetch(`${API_BASE}/board/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create board');
  }

  return await response.text();
}

async function handleListSubmit(event) {

  event.preventDefault();

  const name = listNameInput.value.trim();

  if (!name) {
    showToast('Please enter list name', 'danger');
    return;
  }

  if (!currentBoard) {
    showToast('Please select a board first', 'danger');
    return;
  }

  showSpinner();

  try {

    await createList({
      boardId: currentBoard.id,
      listName: name
    });

    listModal.close();

    listNameInput.value = '';

    await loadBoard(currentBoard.id);

    showToast('List added successfully!', 'success');

  } catch (error) {

    showToast('Failed to create list.', 'danger');

  } finally {

    hideSpinner();
  }
}

async function createList(data) {

  const response = await fetch(`${API_BASE}/list/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create list');
  }

  return await response.text();
}

function openBoardDialog() {

  boardModal.showModal();

  showModalOverlay();

  boardNameInput.focus();
}

function openListDialog() {

  if (!currentBoard) {
    showToast('Select a board first.', 'danger');
    return;
  }

  listModal.showModal();

  showModalOverlay();

  listNameInput.focus();
}

function showModalOverlay() {
  modalOverlay.classList.remove('hidden');
}

function hideModalOverlay() {
  modalOverlay.classList.add('hidden');
}

function renderBoardList() {

  boardGrid.innerHTML = '';

  if (!boards || boards.length === 0) {

    emptyBoards.classList.remove('hidden');

    return;
  }

  emptyBoards.classList.add('hidden');

  boards.forEach((board) => {

    const card = document.createElement('article');

    card.className = 'board-card';

    card.innerHTML = `
      <div>
        <h3>${escapeHtml(board.boardName || 'Untitled Board')}</h3>
        <p>Manage your tasks and lists efficiently.</p>
      </div>

      <span class="board-chip">
        ${board.id} · View Lists
      </span>
    `;

    card.addEventListener('click', () => {
      loadBoard(board.id);
    });

    boardGrid.appendChild(card);
  });
}

async function loadBoard(boardId) {

  showSpinner();

  try {

    currentBoard = boards.find((b) => b.id === boardId);

    const boardLists = await fetchLists(boardId);

    lists = boardLists.map((list) => ({
      ...list,
      tasks: tasks[String(list.id)] || []
    }));

    renderBoardView();

    showBoardDetail();

  } catch (error) {

    showToast('Unable to load board lists.', 'danger');

  } finally {

    hideSpinner();
  }
}

function showDashboard() {

  boardDetailView.classList.add('hidden');

  dashboardView.classList.remove('hidden');

  currentBoard = null;
}

function showBoardDetail() {

  dashboardView.classList.add('hidden');

  boardDetailView.classList.remove('hidden');

  boardTitle.textContent = currentBoard.boardName;

  boardSubtitle.textContent = `Board ID: ${currentBoard.id}`;
}

function renderBoardView() {

  listsContainer.innerHTML = '';

  if (!lists || lists.length === 0) {

    emptyLists.classList.remove('hidden');

    return;
  }

  emptyLists.classList.add('hidden');

  lists.forEach((list) => {

    const column = document.createElement('article');

    column.className = 'list-column';

    column.innerHTML = `
      <div class="column-head">
        <h4>${escapeHtml(list.listName || 'Untitled List')}</h4>
      </div>

      <div class="card-list" id="list-${list.id}"></div>

      <div class="add-task-box">
        <input
          type="text"
          placeholder="Add a task"
          data-list-id="${list.id}"
          class="task-input"
        />

        <button
          class="btn btn-secondary add-task-btn"
          data-list-id="${list.id}"
        >
          Add Task
        </button>
      </div>
    `;

    listsContainer.appendChild(column);

    renderTasks(list);
  });

  bindTaskInputs();
}

function bindTaskInputs() {

  document.querySelectorAll('.add-task-btn').forEach((button) => {

    button.addEventListener('click', () => {

      const listId = button.dataset.listId;

      const input = document.querySelector(
        `.task-input[data-list-id="${listId}"]`
      );

      if (!input) return;

      const taskText = input.value.trim();

      if (!taskText) {
        showToast('Please enter task name', 'danger');
        return;
      }

      addTask(listId, taskText);

      input.value = '';
    });
  });

  document.querySelectorAll('.task-input').forEach((input) => {

    input.addEventListener('keypress', (event) => {

      if (event.key === 'Enter') {

        event.preventDefault();

        const button = document.querySelector(
          `.add-task-btn[data-list-id="${input.dataset.listId}"]`
        );

        button?.click();
      }
    });
  });
}

function addTask(listId, text) {

  tasks[listId] = tasks[listId] || [];

  tasks[listId].push({
    id: Date.now().toString(36),
    text
  });

  const listData = lists.find(
    (list) => String(list.id) === listId
  );

  if (listData) {
    listData.tasks = tasks[listId];
  }

  renderTasks(listData);

  showToast('Task added successfully!', 'success');
}

function renderTasks(list) {

  const listContainer = document.getElementById(`list-${list.id}`);

  if (!listContainer) return;

  listContainer.innerHTML = '';

  const taskItems = list.tasks ?? [];

  if (taskItems.length === 0) {

    listContainer.innerHTML = `
      <p style="color: var(--muted);">
        No tasks yet. Add your first card.
      </p>
    `;

    return;
  }

  taskItems.forEach((task) => {

    const card = document.createElement('section');

    card.className = 'task-card';

    card.draggable = true;

    card.innerHTML = `
      <p>${escapeHtml(task.text)}</p>
    `;

    listContainer.appendChild(card);
  });
}

function showSpinner() {
  spinnerOverlay.classList.remove('hidden');
}

function hideSpinner() {
  spinnerOverlay.classList.add('hidden');
}

function showToast(message, type = 'success') {

  const toast = document.createElement('div');

  toast.className = `toast ${type}`;

  toast.textContent = message;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}