INSERT INTO "posts" ("id", "title", "datetime", "body", "created_at") VALUES
('DjhLzkHoFxU', 'software developer', 'October 27, 2026 9:08:27 AM', 'A Software Developer is a professional who designs, develops, tests, and maintains software applications using programming languages such as Java, Python, JavaScript, and others.', now() + interval '0 millisecond'),
('sGANb3Uw7MU', 'java', 'October 27, 2026 9:10:30 AM', 'A Java Developer is a software professional who develops, tests, and maintains applications using the Java programming language.', now() + interval '1 millisecond')
ON CONFLICT ("id") DO NOTHING;
