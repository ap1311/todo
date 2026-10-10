/* ==========================================================================
   To-Do List — vanilla JavaScript
   Persists tasks in localStorage.
   ========================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "todo.tasks.v1";

  // --- DOM references -------------------------------------------------------
  var form = document.getElementById("todo-form");
  var input = document.getElementById("todo-input");
  var list = document.getElementById("todo-list");
  var emptyState = document.getElementById("empty-state");
  var emptyStateTitle = document.getElementById("empty-state-title");
  var emptyStateText = document.getElementById("empty-state-text");
  var countLabel = document.getElementById("todo-count");
  var clearButton = document.getElementById("clear-completed");
  var filterButtons = document.querySelectorAll(".filters__button");

  // --- State ----------------------------------------------------------------
  var tasks = loadTasks();
  var currentFilter = "all";

  // --- Persistence ----------------------------------------------------------
  function loadTasks() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      // Normalise each stored task to the expected shape.
      return parsed
        .filter(function (task) {
          return task && typeof task.text === "string";
        })
        .map(function (task) {
          return {
            id: String(task.id || createId()),
            text: task.text,
            completed: Boolean(task.completed),
          };
        });
    } catch (error) {
      console.warn("Could not read saved tasks:", error);
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn("Could not save tasks:", error);
    }
  }

  function createId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // --- Rendering ------------------------------------------------------------
  function getVisibleTasks() {
    if (currentFilter === "active") {
      return tasks.filter(function (task) {
        return !task.completed;
      });
    }
    if (currentFilter === "completed") {
      return tasks.filter(function (task) {
        return task.completed;
      });
    }
    return tasks;
  }

  function render() {
    var visible = getVisibleTasks();
    list.innerHTML = "";

    visible.forEach(function (task) {
      list.appendChild(createTaskElement(task));
    });

    // Empty state: shown whenever there is nothing to display.
    updateEmptyState(visible.length);
    updateCount();
    updateClearButton();
  }

  function updateEmptyState(visibleCount) {
    emptyState.hidden = visibleCount > 0;
    if (visibleCount > 0) return;

    if (tasks.length === 0) {
      emptyStateTitle.textContent = "Nothing here yet";
      emptyStateText.textContent = "Add your first task above to get started.";
    } else if (currentFilter === "active") {
      emptyStateTitle.textContent = "All caught up";
      emptyStateText.textContent = "Every task is completed. Nice work!";
    } else if (currentFilter === "completed") {
      emptyStateTitle.textContent = "No completed tasks";
      emptyStateText.textContent = "Complete a task to see it here.";
    }
  }

  function createTaskElement(task) {
    var item = document.createElement("li");
    item.className = "todo-item" + (task.completed ? " is-completed" : "");
    item.dataset.id = task.id;

    // Checkbox (toggle completed)
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-item__checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    // Text (textContent keeps user input safe from HTML injection)
    var text = document.createElement("span");
    text.className = "todo-item__text";
    text.textContent = task.text;

    // Delete button
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "todo-item__delete";
    remove.innerHTML = "&#10005;"; // ✕
    remove.setAttribute("aria-label", "Delete task");
    remove.addEventListener("click", function () {
      deleteTask(task.id);
    });

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(remove);
    return item;
  }

  function updateCount() {
    var remaining = tasks.filter(function (task) {
      return !task.completed;
    }).length;
    countLabel.textContent =
      remaining + (remaining === 1 ? " task left" : " tasks left");
  }

  function updateClearButton() {
    var hasCompleted = tasks.some(function (task) {
      return task.completed;
    });
    clearButton.disabled = !hasCompleted;
  }

  // --- Actions --------------------------------------------------------------
  function addTask(text) {
    tasks.push({
      id: createId(),
      text: text,
      completed: false,
    });
    saveTasks();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map(function (task) {
      return task.id === id
        ? { id: task.id, text: task.text, completed: !task.completed }
        : task;
    });
    saveTasks();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter(function (task) {
      return task.id !== id;
    });
    saveTasks();
    render();
  }

  function clearCompleted() {
    tasks = tasks.filter(function (task) {
      return !task.completed;
    });
    saveTasks();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(function (button) {
      var isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    render();
  }

  // --- Event wiring ---------------------------------------------------------
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    addTask(value);
    input.value = "";
    input.focus();
  });

  clearButton.addEventListener("click", clearCompleted);

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setFilter(button.dataset.filter);
    });
  });

  // Keep multiple tabs in sync.
  window.addEventListener("storage", function (event) {
    if (event.key === STORAGE_KEY) {
      tasks = loadTasks();
      render();
    }
  });

  // --- Init -----------------------------------------------------------------
  render();
})();
