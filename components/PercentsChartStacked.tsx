'use client';

import {
  count_jobs_read_per_day,
  jobs_per_day,
  skill,
  skill_type,
} from '@prisma/client';
import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SearchIcon } from 'lucide-react';
import { intersection } from 'lodash';

// extend the Skill type to include jobs_per_day
interface SkillWithJobsPerDay extends skill {
  jobs_per_day: jobs_per_day[];
  skill_types: skill_type[];
}

export function PercentsChartStacked(props: {
  skills: SkillWithJobsPerDay[];
  dayCounts: count_jobs_read_per_day[];
  skillTypes: { name: string }[];
}) {
  const { skills, dayCounts, skillTypes } = props;

  const [days, setDays] = useState('5');

  const [cutoff, setCutoff] = useState('5');

  const [search, setSearch] = useState('');

  const [selectedType, setSelectedType] = useState('All');

  const typeOptions = ['All', ...skillTypes.map((type) => type.name)];

  const dayOptions = ['1', '3', '5', '10', '15', '20', '25', '30'];

  const cutoffOptions = ['0', '1', '5', '10', '15', '20', '25'];

  const getFormattedDayString = (days: string) =>
    days === '1' ? 'Yesterday' : `${days} Days`;    
    
  const mapSkillsToPercents = useMemo(
    () =>
      skills
        .map((skill) => {
          const len = Math.min(dayCounts.length, Number(days));
          const totalPercent = Number(
            (
              skill.jobs_per_day
                // get the last len days from the array
                .slice(-len)
                .reduce(
                  (acc, job) =>
                    acc +
                    (job.count /
                      (dayCounts?.find(
                        (dc) =>
                          dc?.date.toUTCString() === job?.date.toUTCString()
                      )?.count ?? 1000)) *
                      100,
                  0
                ) / len
            ).toFixed(2)
          );
          return {
            skill: skill.name,
            types: skill.skill_types,
            percent: totalPercent,
          };
        })
        .sort((a, b) => b.percent - a.percent),
    [skills, dayCounts, days]
  );

  const searchFilteredSkills = useMemo(
    () =>
      mapSkillsToPercents.filter((skill) =>
        skill.skill.toLowerCase().includes(search.toLowerCase())
      ),
    [mapSkillsToPercents, search]
  );

  const skillsWithSelectedType = useMemo(
    () =>
      selectedType !== 'All'
        ? mapSkillsToPercents.filter((skill) =>
            skill.types.some((t) => t.name === selectedType)
          )
        : mapSkillsToPercents,
    [mapSkillsToPercents, selectedType]
  );

  const skillsAbovePercent = useMemo(
    () => mapSkillsToPercents.filter((skill) => skill.percent > Number(cutoff)),
    [mapSkillsToPercents, cutoff]
  );

  const displaySkills =
    search || selectedType !== 'All'
      ? intersection(
          searchFilteredSkills,
          skillsAbovePercent,
          skillsWithSelectedType
        )
      : skillsAbovePercent;

  return (
    <>
      <div className="px-20">
        <h1 className="text-2xl font-bold">
          Top Skills Mentioned in Job Postings
        </h1>
        <h3 className="text-sm text-gray-500 w-full">
          Sample size is ~1000 jobs per day from various sources
        </h3>
        <div className="flex flex-row flex-wrap">
          <div className="p-4">
            <Label htmlFor="days">Sample Size</Label>
            <Select onValueChange={(d) => setDays(d)} value={days}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {getFormattedDayString(opt)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4">
            <Label htmlFor="days">Show Results Above</Label>
            <Select onValueChange={(d) => setCutoff(d)} value={cutoff}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cutoffOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt + '%'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4">
            <Label htmlFor="type">Skill Type</Label>
            <Select
              onValueChange={(d) => setSelectedType(d)}
              value={selectedType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="p-4">
            <Label className="opacity-0 hidden md:inline" htmlFor="search">
              Search
            </Label>
            <Input
              className="w-[280px]"
              type="text"
              placeholder="Search for a skill"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={SearchIcon}
            />
          </div>
        </div>

        {/* <div>
          <label htmlFor="search">Search </label>
          <input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
          <div>{normalizedData.length}</div>
        </div> */}
      </div>
      {displaySkills.length > 0 ? (
        <ResponsiveContainer
          width="100%"
          height={displaySkills.length * 50 + 50}
        >
          <BarChart
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            data={displaySkills}
          >
            <XAxis type="number" hide={true} domain={[0, 55]} />
            <YAxis
              dataKey="skill"
              type="category"
              tickMargin={30}
              tickSize={0}
              axisLine={false}
            />
            <Tooltip />
            <Bar
              barSize={35}
              dataKey="percent"
              fill="#82ca9d"
              radius={4}
              strokeWidth={4}
              stroke="black"
              strokeOpacity={0.2}
            >
              <LabelList
                textDecoration={'bold'}
                position="right"
                formatter={(val: string) => val + '%'}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="px-36 py-10">No results found</div>
      )}
    </>
  );
}
