import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://wellsz-todo-app-back.vercel.app/api"
    : "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getAllTodos() {
  try {
    const response = await api.get("/todos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar todos:", error);
    throw error;
  }
}

async function createTodo(todo) {
  try {
    const response = await api.post("/todos", todo);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar todo:", error);
    throw error;
  }
}

async function updateTodo(id, todo) {
  try {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar todo:", error);
    throw error;
  }
}

async function deleteTodo(id) {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar todo:", error);
    throw error;
  }
}

async function deleteCompleted() {
  try {
    const response = await api.delete(`/todos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar todos completas:", error);
    throw error;
  }
}

export default {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompleted,
};
