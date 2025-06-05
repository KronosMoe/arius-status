/*
  Warnings:

  - Added the required column `index` to the `StatusPageMonitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StatusPageMonitor" ADD COLUMN     "index" INTEGER NOT NULL;
