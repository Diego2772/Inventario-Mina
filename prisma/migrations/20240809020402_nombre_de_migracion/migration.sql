/*
  Warnings:

  - You are about to drop the column `createdAt` on the `employ` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_nombre_key";

-- CreateTable
CREATE TABLE "Trabajo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "facturaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trabajo_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "employ" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Trabajo_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "facturaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vale_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "employ" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vale_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Consumo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "empleadoId" INTEGER NOT NULL,
    "facturaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Consumo_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consumo_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "employ" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Consumo_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "empleadoId" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Factura_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "employ" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Registro" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facturaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" INTEGER NOT NULL,
    CONSTRAINT "Registro_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "telefono" TEXT NOT NULL
);
INSERT INTO "new_employ" ("apellido", "cedula", "id", "nombre", "telefono") SELECT "apellido", "cedula", "id", "nombre", "telefono" FROM "employ";
DROP TABLE "employ";
ALTER TABLE "new_employ" RENAME TO "employ";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
