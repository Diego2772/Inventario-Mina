/*
  Warnings:

  - You are about to drop the column `sangre` on the `employ` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_employ" ("apellido", "cedula", "createdAt", "id", "nombre", "telefono") SELECT "apellido", "cedula", "createdAt", "id", "nombre", "telefono" FROM "employ";
DROP TABLE "employ";
ALTER TABLE "new_employ" RENAME TO "employ";
CREATE UNIQUE INDEX "employ_cedula_key" ON "employ"("cedula");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
