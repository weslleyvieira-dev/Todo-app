import { randomUUID } from "crypto";
import sql from "../config/database.js";

await sql`DROP TABLE IF EXISTS videos`;

await sql`
  CREATE TABLE IF NOT EXISTS todos (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT false,
    position INTEGER NOT NULL DEFAULT 0
  )`;

console.log("Todos table created successfully.");

await sql`
  INSERT INTO todos (id, title, completed, position) VALUES
    (${randomUUID()}, 'Buy groceries', false, 0),
    (${randomUUID()}, 'Walk the dog', false, 1),
    (${randomUUID()}, 'Read a book', true, 2),
    (${randomUUID()}, 'Clean the house', false, 3),
    (${randomUUID()}, 'Finish project', true, 4),
    (${randomUUID()}, 'Call mom', false, 5),
    (${randomUUID()}, 'Prepare dinner', false, 6),
    (${randomUUID()}, 'Exercise', true, 7),
    (${randomUUID()}, 'Attend meeting', false, 8),
    (${randomUUID()}, 'Submit report', true, 9)`;

console.log("Todos inserted successfully.");

await sql.end();
console.log("Database connection closed.");
