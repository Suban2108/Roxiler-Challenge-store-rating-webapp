import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, Star, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import api from '@/lib/api';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data.data.stats))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AppLayout><LoadingAnimation className="mx-auto h-24 w-24" /></AppLayout>;

  return (
    <AppLayout title="Admin Dashboard" description="Platform overview and quick actions">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Total Users" value={stats?.total_users || 0} color="bg-blue-500/10 text-blue-600" />
        <StatCard icon={Store} label="Total Stores" value={stats?.total_stores || 0} color="bg-violet-500/10 text-violet-600" />
        <StatCard icon={Star} label="Total Ratings" value={stats?.total_ratings || 0} color="bg-amber-500/10 text-amber-600" />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/admin/users/new"><Plus className="h-4 w-4" /> Add User</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/admin/stores/new"><Plus className="h-4 w-4" /> Add Store</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/users">View Users</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/stores">View Stores</Link>
        </Button>
      </div>
    </AppLayout>
  );
}
