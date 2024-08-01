import { PrismaClient } from '@prisma/client';
import { skills, skillTypeNames } from '../data/skills';

const prisma = new PrismaClient();

async function main() {
  for (const skillTypeName of skillTypeNames) {
    console.log('creating skill type', skillTypeName);
    await prisma.skill_type.create({
      data: {
        name: skillTypeName,
      },
    });
  }
  for (const skill of skills) {
    console.log('creating skill', skill.name);
    await prisma.skill.create({
      data: {
        name: skill.name,
        skill_type_name: skill.skill_type_name,
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
