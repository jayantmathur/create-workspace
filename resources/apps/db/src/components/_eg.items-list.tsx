import { useQuery } from '@tanstack/react-query'
import type { Listitem } from '@/db/schema/items-list'
import { getAllItems, useListMutations } from '@/lib/items-list'
import { Button } from './ui/button'

export function ItemsList() {
  const { data: items } = useQuery<Listitem[]>({
    queryFn: getAllItems,
    queryKey: ['items'],
    refetchInterval: 3000,
  })

  const { addItem } = useListMutations()

  return (
    <section>
      <h2 className="text-2xl font-semibold w-96">Items</h2>
      <ul className="w-full">
        {items?.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      <Button
        className="mt-4"
        onPointerUp={() => addItem({ title: 'New item' })}
      >
        Add item
      </Button>
    </section>
  )
}

/*

Sample route code

I.e., because for some reason I get the error MenuItem must be in Menu when used from a component like this

```tsx
<section className="container max-w-2xl flex flex-col p-4 sm:p-10">
	<h2 className="flex flex-row justify-between items-center text-start mb-8">
		List
		<Button
			variant="default"
			onPointerUp={() =>
				addItem({
					title: "New item",
				})
			}
		>
			<Plus />
			Add item
		</Button>
	</h2>
	<div className="flex flex-col gap-2">
		{items?.map(({ id, title, description }) => {
			return (
				<Item
					key={id}
					variant="outline"
					className={cn(
						":transition-all",
						"p-2",
						"has-aria-checked:border-transparent",
						"has-aria-checked:[&_.media]:opacity-25",
						"has-aria-checked:[&_.pencil]:opacity-25",
						"has-aria-checked:[&_.content>*]:line-through has-aria-checked:[&_.content>*]:opacity-25",
						"has-aria-checked:[&_.delete]:opacity-100 has-aria-checked:[&_.delete]:pointer-events-auto",
					)}
				>
					<ItemMedia className="media">
						<Checkbox />
					</ItemMedia>
					<ItemContent className="content">
						<ItemTitle>{title}</ItemTitle>
						<ItemDescription className="mt-0 text-xs">
							{description}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button
							className="pencil"
							variant="outline"
							size="icon-sm"
							onPointerUp={() => {
								updateItem({ id: id, title: "Updated item" });
							}}
						>
							<Pencil />
						</Button>
						<Button
							className="delete opacity-25 pointer-events-none"
							variant="destructive"
							size="icon-sm"
							onPointerUp={() => {
								deleteItem({ id: id, title });
							}}
						>
							<Trash2 />
						</Button>
					</ItemActions>
				</Item>
			);
		})}
	</div>
</section>
```

*/
