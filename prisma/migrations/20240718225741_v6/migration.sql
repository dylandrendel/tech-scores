-- CreateTable
CREATE TABLE "count_jobs_read_per_day" (
    "count" INTEGER NOT NULL DEFAULT 0,
    "date" DATE NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "count_jobs_read_per_day_date_key" ON "count_jobs_read_per_day"("date");
