import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: text().primaryKey(),
  title: text().notNull(),
  datetime: text().notNull(),
  body: text().notNull().default(""),
  createdAt: timestamp("created_at").defaultNow(),
});
