/*
  Warnings:

  - You are about to drop the column `displayInterval` on the `Settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Monitors" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "displayInterval";
