/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `StatusPages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StatusPages_slug_key" ON "StatusPages"("slug");
