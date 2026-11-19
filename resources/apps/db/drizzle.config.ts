import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/**/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});

// export default defineConfig({
//   out: './drizzle',
//   schema: './src/db/**/schema',
//   dialect: 'mysql',
//   dbCredentials: {
//     host: process.env.AZURE_MYSQL_HOST!,
//     port: process.env.AZURE_MYSQL_PORT!,
//     user: process.env.AZURE_MYSQL_USER!,
//     database: process.env.AZURE_MYSQL_DATABASE!,
//     ssl: { rejectUnauthorized: true },
//   },
// })
