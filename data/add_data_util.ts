import * as path from 'path';

import { PrismaClient } from '@prisma/client';
import { skillNames } from './skills';

type Job = {
  title: string;
  description: string;
};

async function checkAndAddJobsReadCount(
  prisma: PrismaClient,
  date: Date,
  result: Job[]
) {
  const count = await prisma.count_jobs_read_per_day.findFirst({
    where: {
      date,
    },
  });
  if (!count) {
    await prisma.count_jobs_read_per_day.create({
      data: {
        date,
        count: result.length - 1, // account for the header
      },
    });
  } else {
    throw Error(
      `Count already exists for ${count.date.toUTCString()}. Clear the data if desired by running 'tsx clear_data.ts ${count.date.toISOString().split('T')[0]}'`
    );
  }
}

export function checkSkillCases(name: string): RegExp {
  let pattern = new RegExp('\\b' + name + '\\b', 'i');
  if (name === 'C#') {
    pattern = new RegExp('\\bC#', 'i');
  }
  if (name === 'HTML') {
    pattern = new RegExp('\\bHTML(?:5)?\\b', 'i');
  }
  if (name === 'CSS') {
    pattern = new RegExp('\\bCSS(?:3)?\\b', 'i');
  }
  if (name === 'Git') {
    pattern = new RegExp('\\bGit', 'i');
  }
  if (name === 'React') {
    pattern = new RegExp('\\bReact(?:\\.)?(?:js)?\\b', 'i');
  }
  if (name === 'Vue') {
    pattern = new RegExp('\\Vue(?:\\.)?(?:js)?', 'i');
  }
  if (name === 'Angular') {
    pattern = new RegExp('\\bAngular(?:\\.)?(?:js)?', 'i');
  }
  if (name === 'Postgres') {
    pattern = new RegExp('\\bPostgres(?:ql)?', 'i');
  }
  if (name === 'Next') {
    pattern = new RegExp('\\bNext(?:\\.?js)\\b', 'i');
  }
  if (name === 'Node') {
    pattern = new RegExp('\\bNode(?:\\.)?(?:js)?\\b', 'i');
  }
  if (name === '.NET') {
    pattern = new RegExp('\\.NET', 'i');
  }
  if (name === 'D3') {
    pattern = new RegExp('\\bD3(?:\\.js)?', 'i');
  }
  if (name === 'Nest') {
    pattern = new RegExp('\\bNest(?:\\.?js)\\b', 'i');
  }
  if (name === 'Go') {
    pattern = new RegExp('\\bGo(?:lang)?\\b');
  }
  if (name === 'DevOps') {
    pattern = new RegExp('\\bDev(?: )?Ops\\b', 'i');
  }
  if (name === 'Frontend') {
    pattern = new RegExp('\\bFront(?: )?End\\b', 'i');
  }
  if (name === 'Backend') {
    pattern = new RegExp('\\bBack(?: )?End\\b', 'i');
  }
  if (name === 'Fullstack') {
    pattern = new RegExp('\\bFull(?: )?Stack\\b', 'i');
  }
  if (name === 'Machine Learning') {
    pattern = new RegExp('\\bM(?:achine )?L(?:earning)?\\b', 'i');
  }
  if (name === 'Artificial Intelligence') {
    pattern = new RegExp('\\bA(?:rtificial )?I(?:ntelligence)?\\b', 'i');
  }
  if (name === 'User Experience') {
    pattern = new RegExp('\\bU(?:ser )?(?:E)?x(?:perience)?\\b', 'i');
  }
  if (name === 'User Interface') {
    pattern = new RegExp('\\bU(?:ser )?I(?:nterface)?\\b', 'i');
  }
  if (name === 'Machine Learning') {
    pattern = new RegExp('\\bM(?:achine )?L(?:earning)?\\b', 'i');
  }
  if (name === 'REST') {
    pattern = new RegExp('\\bREST');
  }
  if (name === 'Algorithms') {
    pattern = new RegExp('\\bAlgorithm(?:s)?\\b', 'i');
  }
  if (name === 'Efficiency') {
    pattern = new RegExp('\\bEfficien', 'i');
  }
  if (name === 'Problem Solver') {
    pattern = new RegExp('\\bProblem(?: )?(?:-)?Solv', 'i');
  }
  if (name === 'Onsite') {
    pattern = new RegExp('\\bOn(?:-)?site', 'i');
  }
  return pattern;
}

export async function handleResult(
  prisma: PrismaClient,
  result: Job[],
  date: Date
) {
  await checkAndAddJobsReadCount(prisma, date, result);
  for (const name of skillNames) {
    const pattern = checkSkillCases(name);

    const count = result.filter(
      (job) => pattern.test(job.description) || pattern.test(job.title)
    ).length;

    console.log(name, count);

    await prisma.jobs_per_day.create({
      data: {
        date,
        skill: {
          connectOrCreate: {
            where: {
              name,
            },
            create: {
              name,
            },
          },
        },
        count,
      },
    });
  }
}

export function getDateString(todayDate: Date): string {
  return todayDate.toISOString().split('T')[0];
}

export function getLocalDate(date: Date): Date {
  date.setHours(date.getHours() - date.getTimezoneOffset() / 60);
  return date;
}

export function getCsvFilePath(dateString: string): string {
  return path.resolve(__dirname, `jobs_${dateString}.csv`);
}
