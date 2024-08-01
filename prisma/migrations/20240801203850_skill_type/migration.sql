/*
  Warnings:

  - Added the required column `skill_type_name` to the `skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "skill" DROP CONSTRAINT "skill_type_fkey";

-- AlterTable
ALTER TABLE "skill" ADD COLUMN     "skill_type_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_type_fkey" FOREIGN KEY ("skill_type_name") REFERENCES "skill_type"("name") ON DELETE NO ACTION ON UPDATE CASCADE;
