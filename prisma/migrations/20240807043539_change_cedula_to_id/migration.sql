/*
  Warnings:

  - The primary key for the `employ` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `cedula` on the `employ` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - Added the required column `id` to the `employ` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" BIGINT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "sangre" TEXT NOT NULL,
    "telefono" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_employ" ("apellido", "cedula", "createdAt", "nombre", "sangre", "telefono") SELECT "apellido", "cedula", "createdAt", "nombre", "sangre", "telefono" FROM "employ";
DROP TABLE "employ";
ALTER TABLE "new_employ" RENAME TO "employ";
CREATE UNIQUE INDEX "employ_cedula_key" ON "employ"("cedula");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
