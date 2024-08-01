-- AlterTable
CREATE SEQUENCE jobs_per_day_id_seq;
ALTER TABLE "jobs_per_day" ALTER COLUMN "count" SET DEFAULT 0,
ALTER COLUMN "id" SET DEFAULT nextval('jobs_per_day_id_seq');
ALTER SEQUENCE jobs_per_day_id_seq OWNED BY "jobs_per_day"."id";

-- AlterTable
CREATE SEQUENCE skill_id_seq;
ALTER TABLE "skill" ALTER COLUMN "id" SET DEFAULT nextval('skill_id_seq');
ALTER SEQUENCE skill_id_seq OWNED BY "skill"."id";
