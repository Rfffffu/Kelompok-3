// ============================================================
// To Do List - Starter
// Baca README.md untuk daftar lengkap fitur yang harus dibuat
// dan hint pengerjaannya sebelum mulai coding.
// ============================================================

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Struktur satu task: { id, text, completed }
// NOTE: "completed" sudah disiapkan di data model, tapi belum
// dipakai di mana pun. Itu tugas kamu di Fitur #1.
let tasks = [];
let nextId = 1;
let currentFilter = "all";

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return;

    tasks = parsed;
    nextId = Math.max(0, ...tasks.map((task) => task.id)) + 1;
  } catch {
    // data malformat/diubah atau browser error
    tasks = [];
    nextId = 1;
    localStorage.removeItem("tasks");
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  // TODO (Fitur #4 - Simpan ke localStorage):
  // Setiap kali renderTasks() dipanggil, data "tasks" sudah berubah,
  // jadi ini tempat yang pas untuk menyimpan ulang ke localStorage.
  localStorage.setItem("tasks", JSON.stringify(tasks));
  
  // TODO (Fitur #5 - Counter):
  // Update elemen #task-counter di sini setiap kali renderTasks() dipanggil,
  // isinya jumlah task yang belum selesai. Contoh: "3 task tersisa".
  const taskCounter = document.getElementById('task-counter');
  const taskRemaining = tasks.filter((task) => !task.completed).length;

  taskCounter.textContent = `${taskRemaining} task tersisa`;
  if (tasks.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "Belum ada task. Tambahkan satu di atas!";
    taskList.appendChild(emptyState);

    // ketika list kosong perlu disave agar tidak menyisakan 1 task yg dihapus
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return;
  }

  // Fitur #3 - Filter Task:
  // Filter "tasks" sesuai tombol filter yang sedang aktif
  // (semua / aktif / selesai) sebelum di-loop.
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  // Ada task, tapi tidak ada yang cocok dengan filter yang dipilih
  if (filteredTasks.length === 0) {
    const emptyFilter = document.createElement("li");
    emptyFilter.className = "empty-state";
    emptyFilter.textContent = "Tidak ada task pada filter ini.";
    taskList.appendChild(emptyFilter);
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    // TODO (Fitur #1 - Tandai Selesai):
    // Tambahkan <input type="checkbox"> di sini yang mencerminkan
    // task.completed, dan tambahkan class "completed" pada `li`
    // kalau task.completed === true.
    const checkBtn = document.createElement("input");
    checkBtn.type = "checkbox";
    checkBtn.className = "check-btn";
    checkBtn.checked = task.completed;
    if (task.completed) {
      li.classList.add("completed");
    }

    checkBtn.addEventListener("change", () => {
      toggleComplete(task.id);
    });
    //TODO (Fitur #1 - ENDS)

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";

    // TODO (Fitur #2 - Edit Task):
    // Tambahkan tombol "Edit" di sini.
    const edit = document.createElement("button");
    edit.className = "editbtn";
    edit.textContent = "Edit";

    edit.addEventListener("click", function () {
      const box = document.createElement("input");
      box.type = "text";
      box.className = "editbox";
      box.value = task.text;

      const save = document.createElement("button");
      save.className = "savebtn";
      save.textContent = "Simpan";

      function simpan() {
        edittask(task.id, box.value);
      }
      save.addEventListener("click", function () {
        simpan();
      });
      box.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
          simpan();
        }
      });

      li.replaceChild(box, span);
      li.replaceChild(save, edit);
      box.focus();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(edit);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  taskCounter.textContent = `${taskRemaining} task tersisa`;
}

function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === "") return;

  tasks.push({
    id: nextId++,
    text: trimmed,
    completed: false,
  });

  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
}

// TODO (Fitur #1 - Tandai Selesai):
// Buat function toggleComplete(id) yang membalik nilai task.completed
// untuk task dengan id yang cocok, lalu panggil renderTasks().
function toggleComplete(id) {
  const task = tasks.find((task) => task.id === id);
  if (!task) return;
  task.completed = !task.completed;
  renderTasks();
}

// TODO (Fitur #2 - Edit Task):
// Buat function editTask(id, newText) yang mengubah task.text
function edittask(id, newText) {

  const str = newText.trim();

  if (str === "") {
    renderTasks();
    return;
  }
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === id) {
      tasks[i].text = str;
      break;
    }
  }

  renderTasks();
}

// TODO (Fitur #6 - Clear Completed):
// Buat function clearCompleted() yang menghapus semua task dengan
// completed === true dari array "tasks", lalu panggil renderTasks().
// Jangan lupa tambahkan event listener untuk tombol #clear-completed.
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
}

const delCompleted = document.querySelector(".del-completed");
delCompleted.addEventListener("click", clearCompleted);

// Fitur #3 - Filter Task:
// Ubah currentFilter saat tombol filter diklik, tandai tombol yang aktif,
// lalu render ulang daftar task.
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

loadTasks();
renderTasks();