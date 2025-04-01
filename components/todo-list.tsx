import { Card, CardContent } from "@/components/ui/card"
import { Todo } from "@/db/schema"
import { TodoItem } from "./todo-item"

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No todos yet. Add one above!</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}

