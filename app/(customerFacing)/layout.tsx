import { Nav } from '@/components/Nav';
import { Header } from '@/components/Header';

export const dynamic = 'force-dynamic';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Nav></Nav>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header></Header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
