'use client';

import {
  count_jobs_read_per_day,
  jobs_per_day,
  skill,
  skill_type,
} from '@prisma/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Brush,
  Paintbrush,
  PaintBucket,
  PaintBucketIcon,
  Palette,
  SearchIcon,
  SwatchBook,
} from 'lucide-react';
import { intersection } from 'lodash';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Breakpoint } from '@/tailwind.breakpoints';
import { Button } from './ui/button';

// extend the Skill type to include jobs_per_day
interface SkillWithJobsPerDay extends skill {
  jobs_per_day: jobs_per_day[];
  skill_types: skill_type[];
}

type searchParam = 'days' | 'search' | 'type' | 'color';

export function PercentsChartStacked(props: {
  skills: SkillWithJobsPerDay[];
  dayCounts: count_jobs_read_per_day[];
  skillTypes: { name: string }[];
}) {
  const { skills, dayCounts, skillTypes } = props;

  // const [cutoff, setCutoff] = useState('0');
  const [gtSm, setGtSm] = useState(true);
  const [gtXl, setGtXl] = useState(true);
  const [search, setSearch] = useState('');

  const searchParams = useSearchParams();

  const color = searchParams.has('color') ? searchParams.get('color') : '1';
  const daysParam = searchParams.has('days') ? searchParams.get('days') : '30';
  // const cutoffParam = searchParams.get('cutoff');
  const searchParam = searchParams.has('search')
    ? searchParams.get('search')
    : '';
  const selectedTypeParam = searchParams.has('type')
    ? searchParams.get('type')
    : 'All';

  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: searchParam, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      value ? params.set(name, value) : params.delete(name);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (searchParams.has('search')) {
      setSearch(searchParams.get('search') ?? '');
    }
  }, [searchParams]);

  useEffect(() => {
    new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        setGtSm(Breakpoint.gt('sm', cr.width));
        setGtXl(Breakpoint.gt('xl', cr.width));
      }
    }).observe(document.body);
  }, []);

  router.prefetch(pathname);

  const typeOptions = ['All', ...skillTypes.map((type) => type.name)];

  const dayOptions = ['1', '3', '5', '7', '14', '30'];

  // const cutoffOptions = ['0', '1', '5', '10', '15', '20', '25'];

  const getFormattedDayString = (days: string) =>
    days === '1' ? 'Yesterday' : `${days} Days`;

  const mapSkillsToPercents = useMemo(
    () =>
      skills
        .map((skill) => {
          const len = Math.min(dayCounts.length, Number(daysParam));
          const totalPercent = Number(
            skill.jobs_per_day
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
          );
          return {
            skill: skill.name,
            types: skill.skill_types,
            percent: totalPercent,
          };
        })
        .sort((a, b) => b.percent - a.percent)
        .map((skill, index) => ({
          ...skill,
          percent: skill.percent.toFixed(1),
          rank: index + 1,
        })),
    [skills, dayCounts, daysParam]
  );

  const searchFilteredSkills = useMemo(
    () =>
      mapSkillsToPercents.filter((skill) =>
        skill.skill.toLowerCase().includes(searchParam ?? ''.toLowerCase())
      ),
    [mapSkillsToPercents, searchParam]
  );

  const skillsWithSelectedType = useMemo(
    () =>
      selectedTypeParam !== 'All'
        ? mapSkillsToPercents.filter((skill) =>
            skill.types.some((t) => t.name === selectedTypeParam)
          )
        : mapSkillsToPercents,
    [mapSkillsToPercents, selectedTypeParam]
  );

  const maxPercent = useMemo(
    () =>
      Math.max(...mapSkillsToPercents.map((skill) => Number(skill.percent))),
    [mapSkillsToPercents]
  );

  // const skillsAbovePercent = useMemo(
  //   () =>
  //     mapSkillsToPercents.filter(
  //       (skill) => Number(skill.percent) > Number(cutoff)
  //     ),
  //   [mapSkillsToPercents, cutoff]
  // );

  const setSearchParam = useCallback(
    (val: string, key: searchParam) =>
      router.push(pathname + '?' + createQueryString(key, val)),
    [pathname, createQueryString]
  );

  const displaySkills = useMemo(
    () =>
      searchParam || selectedTypeParam !== 'All'
        ? intersection(
            searchFilteredSkills,
            // skillsAbovePercent,
            skillsWithSelectedType
          )
        : mapSkillsToPercents,
    [
      searchFilteredSkills,
      skillsWithSelectedType,
      mapSkillsToPercents,
      searchParam,
      selectedTypeParam,
    ]
  );

  // debounce the search input
  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchParam(search, 'search');
    }, 200);

    return () => clearTimeout(debounce);
  }, [search]);

  function handleClick(data: any, index: number) {
    const skill = encodeURIComponent(data.skill);
    router.push(`/skills/${skill}?rank=${data.rank}&color=${color}`);
  }

  return (
    <>
      <div className="pl-4 xl:px-40 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Most Desired Software Developer Skills
          </h1>
          <h3 className="text-sm text-gray-500 w-full">
            Sample size is ~1000 jobs per day from various sources
          </h3>
        </div>
        <div className="flex flex-grow"></div>
        <div className="flex flex-col sm:flex-row">
          <div className="p-4">
            <Label htmlFor="days">Sample Size</Label>
            <Select
              onValueChange={(d) => setSearchParam(d, 'days')}
              value={daysParam ?? '30'}
            >
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
          {/* <div className="p-4">
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
            </div> */}
          {/* <div className="p-4">
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
            </div> */}
          <div className="p-4">
            <Label className="opacity-0 hidden sm:inline" htmlFor="search">
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
      </div>
      <div className="p-4 flex flex-col items-center">
        <ToggleGroup
          className="flex flex-row flex-wrap gap-2  border rounded-md w-auto inline-block"
          type="single"
          aria-label="Skill Type"
          value={selectedTypeParam ?? 'All'}
          onValueChange={(t) => (t ? setSearchParam(t, 'type') : null)}
        >
          {typeOptions.map((opt) => (
            <ToggleGroupItem key={opt} value={opt} className="m-1">
              {opt}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {displaySkills.length > 0 ? (
          <ResponsiveContainer
            className="md:px-20 xl:px-40"
            width="100%"
            height={displaySkills.length * 30 + 50}
          >
            <BarChart
              layout="vertical"
              margin={{
                top: 20,
                right: gtSm ? 20 : 50,
                left: gtSm ? 20 : 80,
                bottom: 5,
              }}
              data={displaySkills}
            >
              <XAxis type="number" hide={true} domain={[0, maxPercent + 10]} />
              <YAxis
                dataKey="skill"
                type="category"
                fontSize={14}
                tickMargin={20}
                tickSize={0}
                tick={{ fill: 'hsl(var(--foreground))' }}
                axisLine={false}
                width={gtXl ? 200 : gtSm ? 120 : 60}
              />
              <Tooltip
                cursor={{
                  fill: 'hsl(var(--muted))',
                }}
                contentStyle={{
                  background: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                  padding: '4px 10px',
                  color: 'hsl(var(--foreground))',
                  opacity: 0.95,
                }}
                labelStyle={{
                  fontSize: '14px',
                }}
                formatter={(value, name, entry) => {
                  const rank = entry?.payload?.rank;
                  return [`${rank} out of ${skills.length}`, 'Rank'];
                }}
              />
              <Bar
                fill="hsl(var(--foreground))"
                dataKey="percent"
                radius={4}
                onClick={handleClick}
              >
                {displaySkills.map((entry) => (
                  <Cell
                    cursor="pointer"
                    key={`cell-${entry.rank}`}
                    opacity={
                      Math.abs(entry.rank - skills.length) / skills.length
                    }
                    fill={`hsl(var(--chart-${color}))`}
                  />
                ))}
                <LabelList
                  offset={10}
                  position="right"
                  formatter={(val: string) => val + '%'}
                  fill="hsl(var(--foreground))"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="px-36 py-10">No results found</div>
        )}
      </div>
    </>
  );
}
