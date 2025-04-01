"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Loader2, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format, isPast, isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { deleteTodo, toggleTodoCompletion } from "@/actions/todo";
import { Todo } from "@/db/schema";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      await deleteTodo(todo.id);
      toast.success("Todo deleted successfully");
    } catch (error) {
      toast.error("Failed to delete todo");
      setIsDeleting(false);
    }
  }

  async function handleToggle() {
    setIsToggling(true);

    try {
      await toggleTodoCompletion(todo.id, todo.completed);
    } catch (error) {
      toast.error("Failed to update todo");
    } finally {
      setIsToggling(false);
    }
  }

  // Determine due date status
  const getDueDateStatus = () => {
    if (!todo.dueDate) return null;

    const date = new Date(todo.dueDate);

    if (todo.completed) {
      return { label: "Completed", variant: "outline" as const };
    } else if (isPast(date) && !isToday(date)) {
      return { label: "Overdue", variant: "destructive" as const };
    } else if (isToday(date)) {
      return { label: "Today", variant: "secondary" as const };
    } else {
      return { label: "Upcoming", variant: "secondary" as const };
    }
  };

  const dueDateStatus = todo.dueDate ? getDueDateStatus() : null;

  return (
    <Card className={todo.completed ? "bg-muted" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-1">
            {isToggling ? (
              <div className="h-5 w-5 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggle}
                className="h-5 w-5"
              />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3
              className={`font-medium ${
                todo.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={`text-sm ${
                  todo.completed
                    ? "line-through text-muted-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {todo.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <p className="text-xs text-muted-foreground">
                Created: {new Date(todo.createdAt).toLocaleString()}
              </p>

              {todo.dueDate && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Due: {format(new Date(todo.dueDate), "PPP")}
                  </span>

                  {dueDateStatus && (
                    <Badge
                      variant={dueDateStatus.variant}
                      className="ml-1 text-xs"
                    >
                      {dueDateStatus.label}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
