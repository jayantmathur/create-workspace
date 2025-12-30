import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { db } from '@/db/drizzle' // your drizzle instance
import * as schema from '@/db/schema/auth'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
    schema: schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  //   socialProviders: {
  //     github: {
  //       clientId: process.env.GITHUB_CLIENT_ID as string,
  //       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  //     },
  //   },
})
