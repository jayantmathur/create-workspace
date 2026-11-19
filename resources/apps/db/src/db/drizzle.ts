// import { drizzle } from 'drizzle-orm/neon-http'
import { drizzle } from "drizzle-orm/postgres-js";

export const db = drizzle(process.env.DATABASE_URL as string);

/*

Use `DefaultAzureCredential` + `mysql2`. This gives you passwordless authentication locally (Azure CLI) and in production (Managed Identity).

# Local development

```bash
az login
```
Connect to your Azure VPN, then run your application normally.

# Production

Enable Managed Identity on your Azure application and grant it access to your Azure MySQL database.

No database password, no stored tokens, and no manual switching between local and production authentication.

```ts
import { DefaultAzureCredential } from "@azure/identity";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

const credential = new DefaultAzureCredential();

const pool = mysql.createPool({
  host: process.env.AZURE_MYSQL_HOST!,
  port: process.env.AZURE_MYSQL_PORT!,
  user: process.env.AZURE_MYSQL_USER!,
  database: process.env.AZURE_MYSQL_DATABASE!,
  ssl: { rejectUnauthorized: true },
  authPlugins: {
    mysql_clear_password: () => async () => {
      const token = await credential.getToken(
        "https://ossrdbms-aad.database.windows.net/.default",
      );

      if (!token) throw new Error("Failed to acquire Azure token");

      return Buffer.from(`${token.token}\0`);
    },
  },
});

export const db = drizzle({ client: pool });
```

*/
