/*
  Warnings:

  - The `priority` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "priority",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 2;

-- DropEnum
DROP TYPE "Priority";
