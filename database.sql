DROP DATABASE IF EXISTS launchstoredb;
-- para criar no banco de dados
CREATE DATABASE launchstoredb;

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "category_id" int NOT NULL,
  "user_id" int,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "old_price" int,
  "price" int NOT NULL,
  "quantity" int DEFAULT 1,
  "status" int DEFAULT 2,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL
);

INSERT INTO categories(name) VALUES ('comida');
INSERT INTO categories(name) VALUES ('eletronico');
INSERT INTO categories(name) VALUES ('automovel');

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL,
  "product_id" int 
);

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");
ALTER TABLE "files" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL, 
  "password" text NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "address" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

-- foreing key
ALTER TABLE "products" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

-- create procedure (funcao para pegar a hora para fazer a atualização)
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AUTO udpated_at products (criando o gatilho(trigger)) atualizacao de produtos 
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON products 
FOR EACH ROW 
EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO udpated_at user - para a atualizacao de usuarios
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users 
FOR EACH ROW 
EXECUTE PROCEDURE trigger_set_timestamp();

--connect pg simple table - para segurar a sessao de usuario
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)

WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

--token password RECOVERY
ALTER TABLE "users" ADD COLUMN reset_token text;
ALTER TABLE "users" ADD COLUMN reset_token_expires text;

-- apagando em cascata (para quando deletar usuario, deletar tambem os produtos anunciados por ele)
-- e quando deletar produtos, deletar tambem arquivos
ALTER TABLE "products"
DROP CONSTRAINT products_user_id_fkey,
ADD CONSTRAINT products_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "files"
DROP CONSTRAINT files_product_id_fkey,
ADD CONSTRAINT files_product_id_fkey
FOREIGN KEY ("product_id")
REFERENCES "products" ("id")
ON DELETE CASCADE;