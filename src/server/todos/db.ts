// src/server/todos/db.ts

import { sql } from "@/lib/neon/sql";
import { unstable_noStore as noStore } from "next/cache";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

// ======================
// Queries
// ======================

export const getTodos = async (): Promise<Todo[]> => {
  noStore();
  const rows = await sql`
    SELECT id, title, completed
    FROM todosnew
    ORDER BY id DESC
  `;
  return rows as Todo[];
};

export const addTodo = async ({
  title,
}: {
  title: string;
}): Promise<Todo> => {
  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  const rows = await sql`
    INSERT INTO todosnew (title)
    VALUES (${title})
    RETURNING id, title, completed;
  `;

  return rows[0] as Todo;
};

export const deleteTodo = async ({
  id,
}: {
  id: number;
}): Promise<void> => {
  if (!id) throw new Error("ID is required");

  await sql`
    DELETE FROM todosnew WHERE id = ${id};
  `;
};

export const toggleTodo = async ({
  id,
}: {
  id: number;
}): Promise<Pick<Todo, "id" | "completed">> => {
  if (!id) throw new Error("ID is required");

  const rows = await sql`
    UPDATE todosnew
    SET completed = NOT completed
    WHERE id = ${id}
    RETURNING id, completed;
  `;

  return rows[0] as Pick<Todo, "id" | "completed">;
};

export const getTodoById = async (
  id: number
): Promise<Todo | null> => {
  noStore();
  if (!id) throw new Error("Invalid ID");

  const rows = await sql`
    SELECT id, title, completed
    FROM todosnew
    WHERE id = ${id};
  `;

  return rows[0] ? (rows[0] as Todo) : null;
};

export const updateTodo = async ({
  id,
  title,
}: {
  id: number;
  title: string;
}): Promise<Todo> => {
  if (!id || !title?.trim()) {
    throw new Error("Invalid data");
  }

  const rows = await sql`
    UPDATE todosnew
    SET title = ${title}
    WHERE id = ${id}
    RETURNING id, title, completed;
  `;

  return rows[0] as Todo;
};