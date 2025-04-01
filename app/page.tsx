import { TodoList } from "@/components/todo-list"
import { TodoForm } from "@/components/todo-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/db"

export default async function Home() {
  const todos = await db.query.todosTable.findMany({
    orderBy: (todosTable, {desc}) => [desc(todosTable.createdAt)]
  })

  return (
    <main className="container mx-auto py-10 px-4 md:px-0">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Todo List</CardTitle>
          <CardDescription>Manage your tasks efficiently</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TodoForm />
          <TodoList todos={todos} />
        </CardContent>
      </Card>
    </main>
  )
}

