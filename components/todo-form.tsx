"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createTodo } from "@/actions/todo"

export function TodoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const result = await createTodo(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        formRef.current?.reset()

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
      <form ref={formRef} action={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Input name="title" placeholder="What needs to be done?" required disabled={isSubmitting} />
          </div>
          <div className="space-y-2">
            <Textarea name="description" placeholder="Add details (optional)" rows={3} disabled={isSubmitting} />
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

