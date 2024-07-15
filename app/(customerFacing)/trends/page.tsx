import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { MyAccount } from '@/components/MyAccount';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Dashboard() {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Latest Trends</CardTitle>
        <CardDescription>The latest trends in tech skills</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
