import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.log("⚠️  No DATABASE_URL found, using default for development");
  process.env.DATABASE_URL = "postgresql://memory:memory@localhost:5432/memory";
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: true,
  },
});
