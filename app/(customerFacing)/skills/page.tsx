import { PercentsChartStacked } from '@/components/PercentsChartStacked';
import db from '@/db/db';
import React from 'react';

export default async function Skills() {
  const skills = await db.skill.findMany({
    include: {
      jobs_per_day: true,
      skill_types: true,
    },
  });
  const skillTypes = await db.skill_type.findMany();
  const dayCounts = await db.count_jobs_read_per_day.findMany();
  return (
    <PercentsChartStacked
      skills={skills}
      dayCounts={dayCounts}
      skillTypes={skillTypes}
    />
  );
}
