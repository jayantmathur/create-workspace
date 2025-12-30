import { useMutation, useQuery } from '@tanstack/react-query'
import type { Todo } from '@/db/schema/todos'
import { getAllTodos, insertTodo } from '@/lib/todos'
import { Button } from './ui/button'

export function TodosList() {
  const { data: todosList, refetch } = useQuery<Todo[]>({
    queryFn: getAllTodos,
    queryKey: ['todos'],
    refetchInterval: 3000,
  })

  const { mutate: addTodo } = useMutation({
    mutationFn: (data: Todo) => insertTodo({ data }),
    onSuccess: () => refetch(),
  })

  return (
    <section>
      <h2 className="text-2xl font-semibold w-96">Todos</h2>
      <ul className="w-full">
        {todosList?.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <Button className="mt-4" onClick={() => addTodo({ title: 'New todo' })}>
        Add todo
      </Button>
    </section>
  )
}
