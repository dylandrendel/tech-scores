import { SkillCard } from '@/components/SkillCard';
import db from '@/db/db';

export default async function SkillPage({
  params,
}: {
  params: { name: string };
}) {
  // parse the name for url characters and convert back to original string
  const name = decodeURIComponent(params.name);

  const skill = await db.skill.findUnique({
    where: {
      name,
    },
    include: {
      jobs_per_day: true,
      skill_types: true,
    },
  });

  const dayCounts = await db.count_jobs_read_per_day.findMany();

  if (!skill) {
    return <div>Not found</div>;
  } else {
    return (
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold mt-4">{name}</h1>
        <div className="flex flex-col items-center gap-2">
          {skill.skill_types.map((skillType) => (
            <div key={skillType.id}>
              <h3 className="text-2xl">{skillType.name}</h3>
            </div>
          ))}
        </div>
        <SkillCard
          skill={skill}
          jobs_per_day={skill.jobs_per_day}
          dayCounts={dayCounts}
        />
      </div>
    );
  }
}
