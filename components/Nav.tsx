import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart, Home, Percent, Settings, TrendingUp } from 'lucide-react';
import { NavLink } from './NavLink';

export function Nav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider delayDuration={100}>
          <NavLink link="/" name="Home">
            <Home></Home>
          </NavLink>
          <NavLink link="/trends" name="Trends">
            <TrendingUp></TrendingUp>
          </NavLink>
          <NavLink link="/top-charts" name="Top Charts">
            <BarChart></BarChart>
          </NavLink>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider delayDuration={100}>
          <NavLink link="/settings" name="Settings">
            <Settings></Settings>
          </NavLink>
        </TooltipProvider>
      </nav>
    </aside>
  );
}
