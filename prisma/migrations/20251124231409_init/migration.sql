-- CreateTable
CREATE TABLE "Photos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bucketname" TEXT NOT NULL,
    "originalname" TEXT NOT NULL,
    "transformed" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Photos_bucketname_key" ON "Photos"("bucketname");
