import { useMutation, useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/db/drizzle'
import { itemsList, type Listitem } from '@/db/schema/items-list'

export const getAllItems = createServerFn({ method: 'GET' }).handler(
  async () => await db.select().from(itemsList).orderBy(itemsList.createdAt),
)

export const getItem = createServerFn({ method: 'GET' })
  .inputValidator((data: Listitem) => data)
  .handler(async ({ data: newItem }: { data: Listitem }) => {
    const item = await db
      .select()
      .from(itemsList)
      .where(eq(itemsList.title, newItem.title))
    return item
  })

export const useListMutations = () => {
  const { refetch } = useQuery<Listitem[]>({
    queryFn: getAllItems,
    queryKey: ['items'],
    refetchInterval: 3000,
  })

  const { mutate: addItem } = useMutation({
    mutationFn: (data: Listitem) => insertFn({ data }),
    onSuccess: () => refetch(),
  })

  const { mutate: updateItem } = useMutation({
    mutationFn: (data: Listitem) => updateFn({ data }),
    onSuccess: () => refetch(),
  })

  const { mutate: deleteItem } = useMutation({
    mutationFn: (data: Listitem) => deleteFn({ data }),
    onSuccess: () => refetch(),
  })

  return {
    addItem,
    updateItem,
    deleteItem,
  }
}

/*

Server functions/API endpoints

*/

const insertFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Listitem) => data)
  .handler(
    async ({ data: newItem }: { data: Listitem }) =>
      await db.insert(itemsList).values(newItem),
  )

const updateFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Listitem) => data)
  .handler(
    async ({ data: newItem }: { data: Listitem }) =>
      newItem.id &&
      (await db
        .update(itemsList)
        .set(newItem)
        .where(eq(itemsList.id, newItem.id))),
  )

const deleteFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Listitem) => data)
  .handler(
    async ({ data: item }: { data: Listitem }) =>
      item.id && (await db.delete(itemsList).where(eq(itemsList.id, item.id))),
  )
