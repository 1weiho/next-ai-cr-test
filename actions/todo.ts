"use server"

import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { todosTable } from "@/db/schema"

// Create a new todo
export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string

  if (!title?.trim()) {
    return { error: "Title is required" }
  }

  await db.insert(todosTable).values({
    title,
    description: description || null,
    updatedAt: new Date(),
  })

  revalidatePath("/")
  return { success: true }
}

// Delete a todo
export async function deleteTodo(id: number) {
  await db.delete(todosTable).where(eq(todosTable.id, id))
  revalidatePath("/")
  return { success: true }
}

// Toggle todo completion status
export async function toggleTodoCompletion(id: number, completed: boolean) {
  await db
    .update(todosTable)
    .set({
      completed: !completed,
      updatedAt: new Date(),
    })
    .where(eq(todosTable.id, id))

  revalidatePath("/")
  return { success: true }
}

