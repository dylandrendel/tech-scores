/*
  Warnings:

  - Made the column `skill_id` on table `jobs_per_day` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `jobs_per_day` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `skill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs_per_day" ALTER COLUMN "skill_id" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "skill" ALTER COLUMN "name" SET NOT NULL;
