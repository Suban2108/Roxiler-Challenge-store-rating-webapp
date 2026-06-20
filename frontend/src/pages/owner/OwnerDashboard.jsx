import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingStars } from '@/components/RatingStars';
import { SortableTable } from '@/components/SortableTable';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import api from '@/lib/api';

export default function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    api.get('/owner/dashboard')
      .then((res) => setDashboard(res.data.data.dashboard))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedRaters = [...(dashboard?.raters || [])].sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) => <RatingStars value={row.rating} readonly size="sm" />,
    },
  ];

  if (loading) return <AppLayout><LoadingAnimation className="mx-auto h-24 w-24" /></AppLayout>;

  return (
    <AppLayout title="Store Owner Dashboard" description="View ratings for your store">
      {!dashboard?.store ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No store assigned to your account yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Your Store</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{dashboard.store.name}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <RatingStars value={Math.round(dashboard.averageRating)} readonly />
                  <span className="text-2xl font-bold">{dashboard.averageRating.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users who rated your store</CardTitle>
            </CardHeader>
            <CardContent>
              <SortableTable
                columns={columns}
                data={sortedRaters}
                sortField={sortField}
                sortDir={sortDir}
                onSort={handleSort}
                emptyMessage="No ratings yet"
              />
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
