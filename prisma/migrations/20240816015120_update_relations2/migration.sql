-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trabajo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'false',
    "empleadoId" INTEGER NOT NULL,
    "facturaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Trabajo_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "employ" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Trabajo_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Trabajo" ("createdAt", "descripcion", "empleadoId", "estado", "facturaId", "id", "precio", "titulo") SELECT "createdAt", "descripcion", "empleadoId", "estado", "facturaId", "id", "precio", "titulo" FROM "Trabajo";
DROP TABLE "Trabajo";
ALTER TABLE "new_Trabajo" RENAME TO "Trabajo";
CREATE TABLE "new_Vale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cantidad" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'false',
    "empleadoId" INTEGER NOT NULL,
    "facturaId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vale_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "employ" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Vale_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Vale" ("cantidad", "createdAt", "descripcion", "empleadoId", "estado", "facturaId", "id") SELECT "cantidad", "createdAt", "descripcion", "empleadoId", "estado", "facturaId", "id" FROM "Vale";
DROP TABLE "Vale";
ALTER TABLE "new_Vale" RENAME TO "Vale";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
