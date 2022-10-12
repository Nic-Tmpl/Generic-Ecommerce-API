CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "password" varchar,
  "email" varchar,
  "first_name" varchar,
  "last_name" varchar,
  "created" timestamp,
  "modified" timestamp
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "status" varchar,
  "total" decimal,
  "created" timestamp,
  "modified" timestamp
);

CREATE TABLE "order_item" (
  "order_id" int,
  "product_id" int,
  "quantity" int
);

CREATE TABLE "categories" (
  "id" int PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "description" text,
  "category" int,
  "price" decimal
);

CREATE TABLE "cart" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int,
  "total" decimal NOT NULL,
  "created" timestamp,
  "modified" timestamp
);

CREATE TABLE "cart_item" (
  "cart_id" int,
  "product_id" int,
  "quantity" int
);

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "order_item" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category") REFERENCES "categories" ("id");

ALTER TABLE "cart" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cart_item" ADD FOREIGN KEY ("cart_id") REFERENCES "cart" ("id") ON DELETE CASCADE;

ALTER TABLE "cart_item" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
