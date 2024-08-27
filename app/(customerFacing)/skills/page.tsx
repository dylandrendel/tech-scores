import { PercentsChart } from '@/components/PercentsChart';
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
    <PercentsChart
      skills={skills}
      dayCounts={dayCounts}
      skillTypes={skillTypes}
    />
  );
}
