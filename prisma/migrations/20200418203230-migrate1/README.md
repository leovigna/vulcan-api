# Migration `20200418203230-migrate1`

This migration has been generated by Leo Vigna at 4/18/2020, 8:32:30 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."NodeOperator" (
    "id" SERIAL,
    "name" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."JobSpec" (
    "id" text  NOT NULL ,
    "operatorId" integer   ,
    PRIMARY KEY ("id")
) 

ALTER TABLE "public"."JobSpec" ADD FOREIGN KEY ("operatorId")REFERENCES "public"."NodeOperator"("id") ON DELETE SET NULL  ON UPDATE CASCADE

DROP TABLE "public"."Operator";
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200418105524-migrate0..20200418203230-migrate1
--- datamodel.dml
+++ datamodel.dml
@@ -1,19 +1,25 @@
-// output   = "../src/generated/client"
 generator client {
   provider = "prisma-client-js"
 }
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url      = env("DATABASE_URL")
 }
-model Operator {
-  id   Int    @default(autoincrement()) @id
-  name String
+model NodeOperator {
+  id       Int       @default(autoincrement()) @id
+  name     String
+  JobSpecs JobSpec[]
 }
+model JobSpec {
+  id           String        @id
+  operatorId   Int?
+  NodeOperator NodeOperator? @relation(fields: [operatorId], references: [id])
+}
+
 model ContractDefinition {
   compilerOutput String
   id             Int        @default(autoincrement()) @id
   Contract       Contract[]
```


