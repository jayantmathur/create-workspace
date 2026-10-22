import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const itemsList = pgTable('itemsList', {
  id: text('id')
    .primaryKey()
    .$default(() => crypto.randomUUID().replaceAll('-', '')),
  title: text('title').notNull(),
  description: text('description'),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Listitem = typeof itemsList.$inferInsert
