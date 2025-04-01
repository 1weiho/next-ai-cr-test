import { db } from '@/db'
import { todosTable } from '@/db/schema'

async function seedTodos() {
  const todos = Array.from({ length: 10 }, (_, i) => ({
    title: `Todo ${i + 1}`,
    description: `Description for Todo ${i + 1}`,
    completed: false,
  }))

  await db.insert(todosTable).values(todos)

  const seededTodos = await db.select().from(todosTable)
  console.log(`Seeded ${seededTodos.length} todos`)
}

seedTodos()
