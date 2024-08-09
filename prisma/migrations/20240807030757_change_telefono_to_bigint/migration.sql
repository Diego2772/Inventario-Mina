/*
  Warnings:

  - You are about to alter the column `telefono` on the `employ` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employ" (
    "cedula" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "sangre" TEXT NOT NULL,
    "telefono" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_employ" ("apellido", "cedula", "createdAt", "nombre", "sangre", "telefono") SELECT "apellido", "cedula", "createdAt", "nombre", "sangre", "telefono" FROM "employ";
DROP TABLE "employ";
ALTER TABLE "new_employ" RENAME TO "employ";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
