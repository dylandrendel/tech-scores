'use client';

import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import Link from 'next/link';
import { count_jobs_read_per_day, jobs_per_day, skill } from '@prisma/client';
import { LineChart, Line, XAxis, CartesianGrid, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { useSearchParams } from 'next/navigation';

export interface SkillCardProps {
  skill: skill;
  index?: number;
  jobs_per_day: jobs_per_day[];
  dayCounts: count_jobs_read_per_day[];
}

export function SkillCard(props: SkillCardProps) {
  const { skill, jobs_per_day, index, dayCounts } = props;

  const searchParams = useSearchParams();
  const color = searchParams.get('color') || '1';
  const rank = searchParams.get('rank') || '';

  // get the count of jobs in the last 5 days
  const len = Math.min(jobs_per_day.length, 30);
  const totalPercent = Number(
    (
      jobs_per_day
        // get the last 5 days from the array
        .slice(-len)
        .reduce(
          (acc, job) =>
            acc +
            (job.count /
              (dayCounts?.find(
                (dc) => dc?.date.toUTCString() === job?.date.toUTCString()
              )?.count ?? 1000)) *
              100,
          0
        ) / len
    ).toFixed(2)
  );
  const jobPercents = jobs_per_day.map((job) => ({
    date: job.date,
    percent: (
      (job.count /
        (dayCounts?.find(
          (dc) => dc?.date.toUTCString() === job?.date.toUTCString()
        )?.count ?? 1000)) *
      100
    ).toFixed(2),
  }));
  return (
    <Card className="w-full lg:max-w-lg xl:max-w-2xl">
      <Link href="#" prefetch={false}>
        <CardHeader>
          {rank && (
            <CardTitle>
              {rank}. {skill.name}
            </CardTitle>
          )}
          <CardDescription>
            Total Percent in the last 30 days: {totalPercent}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full aspect-[4/3]">
            <div className="absolute inset-0 w-full h-full">
              {' '}
              <LinechartChart jobs={jobPercents} color={color} />
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

function LinechartChart(props: {
  jobs: { date: Date; percent: string }[];
  color: string;
}) {
  const { jobs, color } = props;

  return (
    <div>
      <ChartContainer
        config={{
          count: {
            label: 'Jobs',
            color: 'hsl(var(--chart-1))',
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={jobs.sort((a, b) => a.date.getTime() - b.date.getTime())}
          margin={{
            right: 12,
            top: 40,
          }}
        >
          <CartesianGrid vertical={false} />
          <YAxis axisLine={false} tickLine={false} domain={[0, 60]} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: Date) => value.toUTCString().split(' ')[1]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Line
            dataKey="percent"
            type="natural"
            stroke={`hsl(var(--chart-${color}))`}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
