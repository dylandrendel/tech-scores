import config from './tailwind.config';

export const breakPoints = new Map(
  Object.entries(config.theme.screens).map(([key, value]) => [
    key as keyof typeof config.theme.screens,
    Number(value.slice(0, -2)),
  ])
);

export class Breakpoint {
  static gt(bp: keyof typeof config.theme.screens, activeWidth: number) {
    return activeWidth > Number(config.theme.screens[bp].slice(0, -2)); // remove 'px'
  }
  static lt(bp: keyof typeof config.theme.screens, activeWidth: number) {
    return activeWidth < Number(config.theme.screens[bp].slice(0, -2));
  }
}
