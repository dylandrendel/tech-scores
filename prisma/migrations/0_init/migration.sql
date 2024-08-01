-- CreateTable
CREATE TABLE "jobs_per_day" (
    "skill_id" INTEGER,
    "date" DATE DEFAULT CURRENT_DATE,
    "count" INTEGER,
    "id" INTEGER NOT NULL,

    CONSTRAINT "jobs_per_day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "name" TEXT,
    "id" INTEGER NOT NULL,

    CONSTRAINT "trend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jobs_per_day" ADD CONSTRAINT "skill_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

