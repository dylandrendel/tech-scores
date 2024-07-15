import Link from 'next/link';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface NavLinkProps {
  link: string;
  name: string;
  children: React.ReactNode;
}

export function NavLink(props: NavLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild variant="ghost" size="icon">
          <Link
            href={props.link}
            prefetch={false}
            className="flex flex-row justify-center items-center space-x-4"
          >
            <div>{props.children}</div>
            <div className="sm:hidden">{props.name}</div>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="hidden sm:block" side="right">
        {props.name}
      </TooltipContent>
    </Tooltip>
  );
}
