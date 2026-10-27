import type { Config, Context } from "@netlify/functions";
import { asc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../../db/index.js";
import { posts } from "../../db/schema.js";

const toPost = ({ id, title, datetime, body }: typeof posts.$inferSelect) => ({
  id,
  title,
  datetime,
  body,
});

const readPost = async (req: Request) => {
  const { title, datetime, body } = await req.json();
  if (typeof title !== "string" || !title.trim()) return null;
  return {
    title,
    datetime: typeof datetime === "string" ? datetime : new Date().toLocaleString(),
    body: typeof body === "string" ? body : "",
  };
};

export default async (req: Request, context: Context) => {
  const { id } = context.params;

  if (!id) {
    if (req.method === "GET") {
      const rows = await db.select().from(posts).orderBy(asc(posts.createdAt));
      return Response.json(rows.map(toPost));
    }

    if (req.method === "POST") {
      const values = await readPost(req);
      if (!values) return Response.json({ error: "Title is required" }, { status: 400 });
      const [created] = await db
        .insert(posts)
        .values({ id: randomUUID(), ...values })
        .returning();
      return Response.json(toPost(created), { status: 201 });
    }

    return new Response("Method not allowed", { status: 405 });
  }

  if (req.method === "GET") {
    const [row] = await db.select().from(posts).where(eq(posts.id, id));
    if (!row) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(toPost(row));
  }

  if (req.method === "PUT") {
    const values = await readPost(req);
    if (!values) return Response.json({ error: "Title is required" }, { status: 400 });
    const [updated] = await db.update(posts).set(values).where(eq(posts.id, id)).returning();
    if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(toPost(updated));
  }

  if (req.method === "DELETE") {
    await db.delete(posts).where(eq(posts.id, id));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: ["/api/posts", "/api/posts/:id"],
};
