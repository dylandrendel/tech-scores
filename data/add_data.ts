import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import {
  getCsvFilePath,
  getLocalDate,
  getDateString,
  handleResult,
} from './add_data_util';

console.log('date input: >>', process.argv[2]);
const inputDate = process.argv[2] ?? null;

const prisma = new PrismaClient();

async function addData(dateString?: string) {
  let date = getLocalDate(new Date());
  const todayString = getDateString(date);
  if (!dateString) {
    console.log('No date provided. Using today:', todayString);
  } else {
    date = new Date(dateString);
    console.log('Date provided. Using date:', date);
  }
  const csvFilePath = getCsvFilePath(dateString ?? todayString);
  console.log('Reading file', csvFilePath);

  const headers = ['title', 'description'];

  // const headers = [
  //   'id',
  //   'site',
  //   'job_url',
  //   'job_url_direct',
  //   'title',
  //   'company',
  //   'location',
  //   'job_type',
  //   'date_posted',
  //   'salary_source',
  //   'interval',
  //   'min_amount',
  //   'max_amount',
  //   'currency',
  //   'is_remote',
  //   'job_level',
  //   'job_function',
  //   'company_industry',
  //   'listing_type',
  //   'emails',
  //   'description',
  //   'company_url',
  //   'company_url_direct',
  //   'company_addresses',
  //   'company_num_employees',
  //   'company_revenue',
  //   'company_description',
  //   'logo_photo_url',
  //   'banner_photo_url',
  //   'ceo_name',
  //   'ceo_photo_url',
  // ];
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  } catch (error) {
    console.error('No file content');
    process.exit(1);
  }
  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    (error, result: any[]) => {
      if (error) {
        console.error(error);
      }
      handleResult(prisma, result, date)
        .then(async () => {
          await prisma.$disconnect();
        })
        .catch(async (e) => {
          console.error(e);
          await prisma.$disconnect();
          process.exit(1);
        });
    }
  );
}

inputDate ? addData(inputDate) : addData();
