import express from "express";
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  deleteCompleted,
} from "./controllers/todoController.js";

const server = express();

server.use(express.json());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

server.get("/api/todos", getAllTodos);
server.post("/api/todos", createTodo);
server.put("/api/todos/:id", updateTodo);
server.delete("/api/todos/:id", deleteTodo);
server.delete("/api/todos", deleteCompleted);

server.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});
