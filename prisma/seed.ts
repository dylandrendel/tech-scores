import { PrismaClient } from '@prisma/client';
import { skillTypeMap } from '../data/skills';

const prisma = new PrismaClient();

async function updateSkillsTypes(skillsArray: string[], skillTypeName: string) {
  return await prisma.$transaction([
    ...skillsArray.map((name) => {
      console.log('creating skill', name);
      return prisma.skill.upsert({
        where: {
          name,
        },
        update: {
          skill_types: {
            connectOrCreate: {
              where: {
                name: skillTypeName,
              },
              create: {
                name: skillTypeName,
              },
            },
          },
        },
        create: {
          name,
          skill_types: {
            connectOrCreate: {
              where: {
                name: skillTypeName,
              },
              create: {
                name: skillTypeName,
              },
            },
          },
        },
      });
    }),
  ]);
}

export async function reTryCatch(callback: any, times = 10) {
  try {
    return await callback();
  } catch (error: any) {
    if (times > 0) {
      console.error('Error:', error.code);
      console.log(`Retrying ${times} more times...`);
      return await reTryCatch(callback, times - 1);
    } else {
      throw error;
    }
  }
}

async function main() {
  skillTypeMap.forEach(async (skillsArray, skillTypeName) => {
    const skills = await reTryCatch(async () =>
      updateSkillsTypes(skillsArray, skillTypeName)
    );
    console.log('skills created successfully', skillTypeName, skills);
  });
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
