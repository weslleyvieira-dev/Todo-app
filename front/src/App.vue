<script setup>
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";
import api from "./services/api.js";

const isDarkMode = ref(localStorage.getItem("theme") === "dark");
const actualFilter = ref("");
const todoList = ref([]);
const newTodo = ref("");

onMounted(async () => {
  updateList();
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
});

async function createTodo(todo) {
  if (!todo) return console.error("Todo vazia");

  const item = {
    title: todo,
    completed: false,
    position: 0,
  };
  await api.createTodo(item);
  updateList();
  newTodo.value = "";
}

async function updateTodo(todo) {
  await api.updateTodo(todo.id, todo);
  updateList();
}

async function deleteTodo(todo) {
  await api.deleteTodo(todo.id);
  updateList();
}

async function deleteCompleted() {
  await api.deleteCompleted();
  updateList();
}

async function updateList() {
  try {
    const todos = await api.getAllTodos();
    todoList.value = todos
      .sort((a, b) => a.position - b.position)
      .map((t) => ({ ...t }));
  } catch (error) {
    console.error("Error fetching todos:", error);
  }

  if (actualFilter.value === "active") {
    todoList.value = todoList.value.filter((t) => !t.completed);
  } else if (actualFilter.value === "completed") {
    todoList.value = todoList.value.filter((t) => t.completed);
  }
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

async function onDragEnd() {
  todoList.value.forEach((todo, index) => {
    todo.position = index;
    api.updateTodo(todo.id, todo);
  });
}
</script>

<template>
  <main>
    <div class="content">
      <div class="top">
        <h1>TODO</h1>
        <img
          class="theme-button"
          :src="`/assets/icons/${
            isDarkMode ? 'icon-sun.svg' : 'icon-moon.svg'
          }`"
          alt="Theme"
          @click="toggleTheme()"
        />
      </div>
      <div class="add-todo">
        <input @click="createTodo(newTodo)" class="check" type="checkbox" />
        <input
          v-model.trim="newTodo"
          class="text"
          type="text"
          placeholder="Create a new todo..."
          @keydown.enter="createTodo(newTodo)"
        />
      </div>
      <div class="list">
        <draggable
          v-model="todoList"
          handle=".drag-handle"
          @end="onDragEnd"
          class="todo-list"
          item-key="id"
        >
          <template #item="{ element: todo }">
            <li class="list-items drag-handle" :key="todo.id">
              <input
                class="check"
                type="checkbox"
                :checked="todo.completed"
                @click="(todo.completed = !todo.completed), updateTodo(todo)"
              />
              <p class="item" :class="{ completed: todo.completed }">
                {{ todo.title }}
              </p>
              <img
                @click="deleteTodo(todo)"
                class="delete"
                src="/assets/icons/icon-cross.svg"
              />
            </li>
          </template>
        </draggable>
        <div class="filters">
          <p class="count-list">{{ todoList.length }} items left</p>
          <div class="state-filter">
            <p
              @click="(actualFilter = ''), updateList()"
              :class="{ selected: actualFilter === '' }"
            >
              All
            </p>
            <p
              @click="(actualFilter = 'active'), updateList()"
              :class="{ selected: actualFilter === 'active' }"
            >
              Active
            </p>
            <p
              @click="(actualFilter = 'completed'), updateList()"
              :class="{ selected: actualFilter === 'completed' }"
            >
              Completed
            </p>
          </div>
          <p @click="deleteCompleted()" class="clear-list">Clear Completed</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background: url("/assets/backgrounds/bg-desktop-light.jpg"), var(--bg-primary);
  background-repeat: no-repeat;
  background-size: contain;
  height: 100vh;
  width: 100vw;
}

[data-theme="dark"] {
  main {
    background: url("/assets/backgrounds/bg-desktop-dark.jpg"),
      var(--bg-primary);
    background-repeat: no-repeat;
    background-size: contain;
    height: 100vh;
    width: 100vw;
  }
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100%;
  width: 100%;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 40%;
  margin: 4.375rem 0 3rem;
}

.top h1 {
  color: white;
  font-weight: bold;
  font-size: 2.5rem;
  letter-spacing: 1rem;
}

.top .theme-button {
  cursor: pointer;
}

.add-todo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 4rem;
  width: 40%;
  background-color: var(--bg-secundary);
  border-radius: 0.4rem;
  gap: 1.5rem;
  padding: 0 1.5rem;
  resize: none;
  box-sizing: border-box;
  flex-shrink: 0;
  box-shadow: 0 35px 50px -15px var(--shadow-color);
}

.add-todo input {
  background-color: var(--bg-secundary);
  border: none;
}

.add-todo .text {
  height: 1.5rem;
  width: 100%;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.add-todo .text:hover {
  color: var(--text-primary-hover);
}

.add-todo .text::placeholder {
  color: var(--text-secundary);
  opacity: 1;
}

.add-todo .check,
.list-items .check {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: transparent;
  border: 1px solid var(--text-terciary-alt);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  box-sizing: border-box;
}

.add-todo .check:hover,
.list-items .check:hover {
  border-color: var(--text-blue);
}

.list-items .check:checked {
  background: var(--check-bg-gradient);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-items .check:checked::after {
  content: url("/assets/icons/icon-check.svg");
  width: 0.75rem;
  height: 0.75rem;
}

.list-items:hover {
  cursor: grab;
}

.list {
  max-height: 50dvh;
  width: 40%;
  margin: 1.5rem 0 3rem;
  background-color: var(--bg-secundary);
  border-radius: 0.4rem 0.4rem 0 0;
  resize: none;
  box-sizing: border-box;
  box-shadow: 0 35px 50px -15px var(--shadow-color);
}

.list .todo-list {
  max-height: 100%;
  display: flex;
  flex-direction: column;
  list-style: none;
  overflow-y: auto;
}

.list-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--text-terciary-alt);
  gap: 1.5rem;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.list-items:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.list-items.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  background-color: rgba(255, 255, 255, 0.1);
}

.list-items.drag-over {
  border-top: 2px solid var(--text-blue);
  transform: translateY(2px);
}

.list-items[draggable="true"] {
  cursor: grab;
}

.list-items[draggable="true"]:active {
  cursor: grabbing;
}

.list-items .item {
  color: var(--text-primary);
  font-size: 1.125rem;
  flex: 1;
  text-align: left;
}

.list-items .item.completed {
  text-decoration: line-through;
  color: var(--text-terciary);
}

.list-items .delete {
  visibility: hidden;
  cursor: pointer;
  height: 1.125rem;
  width: 1.125rem;
}

.list-items:hover .delete {
  visibility: visible;
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
  color: var(--text-filter);
  background-color: var(--bg-secundary);
  font-size: 0.875rem;
  border-radius: 0 0 0.4rem 0.4rem;
  resize: none;
  box-sizing: border-box;
}

.filters .state-filter {
  display: flex;
  gap: 1.125rem;
}

.filters .state-filter * {
  color: var(--text-filter);
  font-weight: bold;
}

.filters .state-filter *.selected {
  color: var(--text-blue);
}

.filters .state-filter *:hover,
.clear-list:hover {
  color: var(--text-primary-hover);
  cursor: pointer;
}

@media (max-width: 1023px) {
  main {
    background: url("/assets/backgrounds/bg-mobile-light.jpg"),
      var(--bg-primary);
    background-repeat: no-repeat;
    background-size: contain;
  }

  [data-theme="dark"] {
    main {
      background: url("/assets/backgrounds/bg-mobile-dark.jpg"),
        var(--bg-primary);
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .top {
    width: calc(100% - 3rem);
    margin: 3rem 0 2.5rem;
  }

  .top h1 {
    font-size: 1.5rem;
  }

  .top .theme-button {
    width: 20px;
    height: 20px;
  }

  .add-todo {
    width: calc(100% - 3rem);
    height: 3rem;
    gap: 0.75rem;
    padding: 1.25rem;
  }

  .add-todo .check,
  .list-items .check {
    width: 1.25rem !important;
    height: 1.25rem !important;
    flex-shrink: 0;
  }

  .add-todo .text {
    height: 1rem;
    font-size: 0.875rem;
  }

  .list {
    width: calc(100% - 3rem);
    margin: 1rem 0 3rem;
  }

  .list-items {
    height: 3.25rem;
    padding: 1.25rem;
    gap: 0.75rem;
  }

  .list-items .item {
    font-size: 1rem;
  }

  .list-items .delete {
    visibility: visible;
    width: 1rem;
    height: 1rem;
  }

  .filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 1rem;
    padding: 1.25rem;
    height: auto;
  }

  .filters .count-list {
    grid-column: 1;
    grid-row: 1;
  }

  .filters .clear-list {
    grid-column: 2;
    grid-row: 1;
    text-align: right;
  }

  .filters .state-filter {
    margin-top: 1rem;
    grid-column: 1 / -1;
    grid-row: 2;
    justify-self: center;
  }
}
</style>
