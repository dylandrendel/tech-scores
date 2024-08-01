-- CreateTable
CREATE TABLE "skill_type" (
    "name" TEXT NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "skill_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_type_name_key" ON "skill_type"("name");

-- AddForeignKey
ALTER TABLE "skill" ADD CONSTRAINT "skill_type_fkey" FOREIGN KEY ("id") REFERENCES "skill_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
