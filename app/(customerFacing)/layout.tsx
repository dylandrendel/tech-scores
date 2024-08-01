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
      <div className="flex flex-col sm:py-4 sm:pl-14">
        <Header></Header>
        <main className="pt-4 px-4">{children}</main>
      </div>
    </div>
  );
}
