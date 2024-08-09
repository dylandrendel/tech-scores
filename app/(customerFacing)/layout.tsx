import ColorToggle from '@/components/ColorToggle';
import { ModeToggle } from '@/components/ModeToggle';

export const dynamic = 'force-dynamic';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/0">
      {/* <Nav></Nav> */}
      {/* <div className="flex flex-col sm:py-4 sm:pl-14"> */}
      {/* <Header></Header> */}
      <div className="pr-4 md:pr-10 pt-4 self-end w-auto inline-block flex flex-row gap-2">
        <ColorToggle />
        <ModeToggle />
      </div>
      <main className="px-4 pt-4 lg:pt-0">{children}</main>
      {/* </div> */}
    </div>
  );
}
