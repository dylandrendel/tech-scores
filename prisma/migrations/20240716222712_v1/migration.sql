/*
  Warnings:

  - Made the column `count` on table `jobs_per_day` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs_per_day" ALTER COLUMN "count" SET NOT NULL;

-- AlterTable
ALTER TABLE "skill" RENAME CONSTRAINT "trend_pkey" TO "skill_pkey";
