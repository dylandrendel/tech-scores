/*
  Warnings:

  - You are about to drop the column `skill_type_name` on the `skill` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "skill" DROP CONSTRAINT "skill_type_fkey";

-- AlterTable
ALTER TABLE "skill" DROP COLUMN "skill_type_name";

-- CreateTable
CREATE TABLE "_skillToskill_type" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_skillToskill_type_AB_unique" ON "_skillToskill_type"("A", "B");

-- CreateIndex
CREATE INDEX "_skillToskill_type_B_index" ON "_skillToskill_type"("B");

-- AddForeignKey
ALTER TABLE "_skillToskill_type" ADD CONSTRAINT "_skillToskill_type_A_fkey" FOREIGN KEY ("A") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_skillToskill_type" ADD CONSTRAINT "_skillToskill_type_B_fkey" FOREIGN KEY ("B") REFERENCES "skill_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
