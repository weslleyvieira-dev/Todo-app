import { randomUUID } from "crypto";
import sql from "../config/database.js";

export class TodoService {
  async list() {
    let todos = await sql`
      SELECT * FROM todos
      ORDER BY position`;

    return todos;
  }

  async create(todo) {
    await sql`
    UPDATE todos
    SET position = position + 1`;

    await sql`
    INSERT INTO todos (id, title, completed, position)
    VALUES (${randomUUID()}, ${todo.title}, false, 0)`;

    return todo;
  }

  async update(id, todo) {
    const { title, completed, position } = todo;
    await sql`
      UPDATE todos
      SET title = ${title}, completed = ${completed}, position = ${position}
      WHERE id = ${id}`;
  }

  async delete(id) {
    await sql`
      DELETE FROM todos
      WHERE id = ${id}`;
  }

  async deleteCompleted() {
    await sql`
      DELETE FROM todos
      WHERE completed = ${true}`;
  }
}
