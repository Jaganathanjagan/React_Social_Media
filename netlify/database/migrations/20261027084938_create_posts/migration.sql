CREATE TABLE "posts" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"datetime" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
