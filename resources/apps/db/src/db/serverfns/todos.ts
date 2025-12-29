import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '../drizzle'
import { type Todo, todos } from '../schema/todos'

export const getAllTodos = createServerFn({ method: 'GET' }).handler(
  async () => {
    const data = await db.select().from(todos)
    return data
  },
)

export const getTodo = createServerFn({ method: 'GET' })
  .inputValidator((data: Todo) => data)
  .handler(async ({ data: newTodo }: { data: Todo }) => {
    const todo = await db
      .select()
      .from(todos)
      .where(eq(todos.title, newTodo.title))
    return todo
  })

export const insertTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: Todo) => data)
  .handler(async ({ data }: { data: Todo }) => {
    const newTodo: typeof todos.$inferInsert = data
    await db.insert(todos).values(newTodo)
    return `Created new entry: ${JSON.stringify(newTodo)}`
  })

export const updateTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: Todo) => data)
  .handler(async ({ data: newTodo }: { data: Todo }) => {
    await db.update(todos).set(newTodo).where(eq(todos.title, newTodo.title))
    return `Updated entry: ${JSON.stringify(newTodo)}`
  })

export const deleteTodo = createServerFn({ method: 'POST' })
  .inputValidator((data: Todo) => data)
  .handler(async ({ data: todo }: { data: Todo }) => {
    await db.delete(todos).where(eq(todos.title, todo.title))
    return `Deleted entry: ${JSON.stringify(todo)}`
  })
