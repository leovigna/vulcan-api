# Migration `20200418105524-migrate0`

This migration has been generated by Leo Vigna at 4/18/2020, 10:55:24 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Operator" (
    "id" SERIAL,
    "name" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."ContractDefinition" (
    "compilerOutput" text  NOT NULL ,
    "id" SERIAL,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Contract" (
    "address" text  NOT NULL ,
    "networkId" text  NOT NULL ,
    "specId" integer   ,
    PRIMARY KEY ("address")
) 

CREATE TABLE "public"."OracleAggregator" (
    "answerRenderFormat" text   ,
    "contractAddress" text  NOT NULL ,
    "path" text   ,
    "title" text   ,
    PRIMARY KEY ("contractAddress")
) 

CREATE TABLE "public"."Event" (
    "address" text   ,
    "blockHash" text   ,
    "blockNumber" integer   ,
    "contractAddress" text   ,
    "event" text   ,
    "id" text  NOT NULL ,
    "logIndex" integer   ,
    "oracleAggregatorContractAddress" text   ,
    "returnValues" text   ,
    "signature" text   ,
    "transactionHash" text   ,
    "transactionIndex" integer   ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."DiscordChannel" (
    "guildId" text   ,
    "id" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

ALTER TABLE "public"."Contract" ADD FOREIGN KEY ("specId")REFERENCES "public"."ContractDefinition"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."OracleAggregator" ADD FOREIGN KEY ("contractAddress")REFERENCES "public"."Contract"("address") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200418105524-migrate0
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,56 @@
+// output   = "../src/generated/client"
+generator client {
+  provider = "prisma-client-js"
+}
+
+datasource db {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+model Operator {
+  id   Int    @default(autoincrement()) @id
+  name String
+}
+
+model ContractDefinition {
+  compilerOutput String
+  id             Int        @default(autoincrement()) @id
+  Contract       Contract[]
+}
+
+model Contract {
+  address            String              @id
+  networkId          String
+  specId             Int?
+  ContractDefinition ContractDefinition? @relation(fields: [specId], references: [id])
+  OracleAggregator   OracleAggregator[]
+}
+
+model OracleAggregator {
+  answerRenderFormat String?
+  contractAddress    String   @id
+  path               String?
+  title              String?
+  Contract           Contract @relation(fields: [contractAddress], references: [address])
+}
+
+model Event {
+  address                         String?
+  blockHash                       String?
+  blockNumber                     Int?
+  contractAddress                 String?
+  event                           String?
+  id                              String  @id
+  logIndex                        Int?
+  oracleAggregatorContractAddress String?
+  returnValues                    String?
+  signature                       String?
+  transactionHash                 String?
+  transactionIndex                Int?
+}
+
+model DiscordChannel {
+  id      String  @id
+  guildId String?
+}
```


