import { TodoService } from "../services/todoService.js";

const todoService = new TodoService();

const getAllTodos = async (req, res) => {
  try {
    const todos = await todoService.list();
    res.status(200).send(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const createTodo = async (req, res) => {
  try {
    const todo = req.body;
    const createdTodo = await todoService.create(todo);
    res.status(201).send(createdTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = req.body;
    await todoService.update(id, todo);
    res.status(204).send();
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await todoService.delete(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

async function deleteCompleted(req, res) {
  try {
    await todoService.deleteCompleted();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting completed todos:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

export { getAllTodos, createTodo, updateTodo, deleteTodo, deleteCompleted };
