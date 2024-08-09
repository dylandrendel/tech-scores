'use client';

import { useCallback } from 'react';
import { Button } from './ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Paintbrush } from 'lucide-react';

export default function ColorToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const color = searchParams.get('color') || '1';

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(name, value) : params.delete(name);

    return params.toString();
  };

  const setSearchParam = (val: string, key: string) =>
    router.push(pathname + '?' + createQueryString(key, val));

  return (
    <Button
      variant={'outline'}
      size="icon"
      onClick={() =>
        setSearchParam(
          Number(color) === 5 ? '1' : String(Number(color) + 1),
          'color'
        )
      }
    >
      <Paintbrush fill={`hsl(var(--chart-${color}))`} />
    </Button>
  );
}
