import { Home, MenuIcon, TrendingUp } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import Link from 'next/link';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { NavLink } from './NavLink';

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="px-4 grid gap-6 text-lg font-medium">
          <TooltipProvider>
            <NavLink link="/" name="Home">
              <Home></Home>
            </NavLink>
            <NavLink link="/trends" name="Trends">
              <TrendingUp></TrendingUp>
            </NavLink>
          </TooltipProvider>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
