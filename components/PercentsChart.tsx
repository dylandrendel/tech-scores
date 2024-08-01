'use client';

import { jobs_per_day, skill } from '@prisma/client';
import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type SkillWithJobsPerDay = {
  name: string | null;
  jobs_per_day: jobs_per_day[];
};

export function PercentsChart(props: { skills: SkillWithJobsPerDay[] }) {
  const { skills } = props;

  // we want to create a data structure like this for each date in the last 5 days
  // by matching on the date value in the jobs_per_day array
  // [{ skill: 'React', date: '2022-01-01', percent: 100 }, { skill: 'React', date: '2022-01-02', percent: 70 }]
  // this will allow us to create a bar chart with the skill on the x-axis and the percent on the y-axis for each date
  // we can then compare the skills on the same date
  // we can also compare the same skill on different dates
  const normalizedData = skills.flatMap((skill) => {
    return skill.jobs_per_day.map((job) => ({
      skill: skill.name,
      date: job.date,
      percent: ((job.count / 500) * 100).toFixed(2),
    }));
  });
  // now get the unique dates
  // we can use this to create the x-axis
  const uniqueDates = Array.from(
    new Set(
      normalizedData.map((item) =>
        item.date?.toLocaleString('en-US', { month: 'short', day: 'numeric' })
      )
    )
  );

  const [selectedDate, setSelectedDate] = useState(uniqueDates[4]);

  // now for each unique date, we want to get the skills and their percents into a single array
  // so we can create a bar chart with the skills on the x-axis and the percents on the y-axis
  const normalizedDataByDate = uniqueDates.map((date) => {
    const data = normalizedData.filter(
      (item) =>
        item.date?.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        }) === date
    ); // also sort the data by percent
    data.sort((a: any, b: any) => b.percent - a.percent);
    return data;
  });

  // Filter data for the selected date
  const dataForSelectedDate =
    normalizedDataByDate.find(
      (data) =>
        data[0]?.date?.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        }) === selectedDate
    ) || [];

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label htmlFor="dateSelect">Select Date: </label>
        <select
          id="dateSelect"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          {uniqueDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>
      </div>
      {dataForSelectedDate.length > 0 ? (
        <BarChart
          layout="vertical"
          width={1200}
          height={2000}
          margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          data={dataForSelectedDate}
          key={dataForSelectedDate[0].date?.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="skill" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="percent" fill="#82ca9d" />
        </BarChart>
      ) : (
        <p>No data available for the selected date.</p>
      )}
    </div>
  );
}
