import { useMutation, useQuery } from '@tanstack/react-query'
import type { Todo } from '@/db/schema/todos'
import { getAllTodos, insertTodo } from '@/db/serverfns/todos'

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
      {/** biome-ignore lint/a11y/useButtonType: this is a placeholder button component, meant to be replaced */}
      <button className="mt-4" onClick={() => addTodo({ title: 'New todo' })}>
        Add todo
      </button>
    </section>
  )
}
