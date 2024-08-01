import { SkillCard } from '@/components/SkillCard';
import db from '@/db/db';

export default async function Dashboard() {
  const skills = await db.skill.findMany({
    include: {
      jobs_per_day: true,
    },
  });
  const dayCounts = await db.count_jobs_read_per_day.findMany();
  // sort the skills by the total number of jobs in the last 5 days
  skills.sort((a, b) => {
    const aCount = a.jobs_per_day
      .slice(0, 5)
      .reduce((acc, job) => acc + job.count, 0);
    const bCount = b.jobs_per_day
      .slice(0, 5)
      .reduce((acc, job) => acc + job.count, 0);
    return bCount - aCount;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill, i) => (
        <SkillCard
          key={skill.id}
          index={i}
          skill={skill}
          jobs_per_day={skill.jobs_per_day}
          dayCounts={dayCounts}
        />
      ))}
    </div>
  );
}
