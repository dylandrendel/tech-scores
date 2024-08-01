import { PrismaClient } from '@prisma/client';

console.log("date input: >>", process.argv[2]);
const inputDate = process.argv[2];

const prisma = new PrismaClient();

async function clearData(dateString: string) {
  const date = new Date(dateString);
  console.log(`Clearing data for date: ${date}`);
  try {
    // Delete jobs_per_day records for the given date
    await prisma.jobs_per_day.deleteMany({
      where: {
        date,
      },
    });

    // Delete count_reads for the given date
    await prisma.count_jobs_read_per_day.deleteMany({
      where: {
        date,
      },
    });

    console.log(`Data cleared for date: ${date}`);
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearData(inputDate);