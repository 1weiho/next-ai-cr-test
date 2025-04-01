"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2, CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { createTodo } from "@/actions/todo"

export function TodoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    // Add the due date to the form data if selected
    if (dueDate) {
      formData.set("dueDate", dueDate.toISOString())
    }

    try {
      const result = await createTodo(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        // Reset the form
        const form = document.getElementById("todo-form") as HTMLFormElement
        form.reset()
        setDueDate(undefined)

        toast.success("Todo created successfully")
      }
    } catch (error) {
      toast.error("Failed to create todo")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form id="todo-form" action={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="What needs to be done?" required disabled={isSubmitting} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" name="description" placeholder="Add details" rows={3} disabled={isSubmitting} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
            {dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => setDueDate(undefined)}
                disabled={isSubmitting}
              >
                Clear date
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Todo"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

