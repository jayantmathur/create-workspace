//* import { eq } from 'drizzle-orm'
//* import { todos } from './db/schema/todos'
//* import { db } from './drizzle'

// async function modifyTodos() {
//*   const newTodo: typeof todos.$inferInsert = {
//     title: 'Todo title',
//     description: 'Todo description',
//     completed: false,
//*   }

//*   await db.insert(todos).values(newTodo)
//   console.log('New todo created!')

//*   const todosList = await db.select().from(todos)
//   console.log('Getting all todos from the database: ', todosList)

//    const todosList: {
//      id: number;
//      title: string;
//      description: string;
//      completed: boolean;
//      createdAt: Date;
//      updatedAt: Date;
//    }[]

//*   await db
//*     .update(todos)
//*     .set({
//*       completed: true,
//*     })
//*     .where(eq(todos.title, newTodo.title))
//   console.log('Todo info updated!')

//*   await db.delete(todos).where(eq(todos.title, todos.title))
//   console.log('User deleted!')
// }
