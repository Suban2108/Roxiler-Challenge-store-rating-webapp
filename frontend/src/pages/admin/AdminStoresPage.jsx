import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SortableTable } from '@/components/SortableTable';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { RatingStars } from '@/components/RatingStars';
import api from '@/lib/api';

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const fetchStores = useCallback(() => {
    setLoading(true);
    api.get('/admin/stores', {
      params: { ...filters, sort: sortField, dir: sortDir, page, limit: 10 },
    })
      .then((res) => {
        setStores(res.data.data.stores);
        setTotal(res.data.data.total);
      })
      .finally(() => setLoading(false));
  }, [filters, sortField, sortDir, page]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <RatingStars value={Math.round(parseFloat(row.rating) || 0)} readonly size="sm" />
          <span className="text-sm text-muted-foreground">
            {(parseFloat(row.rating) || 0).toFixed(1)}
          </span>
        </div>
      ),
    },
    { key: 'owner_name', label: 'Owner' },
  ];

  return (
    <AppLayout title="Stores" description="Manage registered stores">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="grid flex-1 gap-3 sm:grid-cols-3">
          <Input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))} />
          <Input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))} />
        </div>
        <Button asChild>
          <Link to="/admin/stores/new"><Plus className="h-4 w-4" /> Add Store</Link>
        </Button>
      </div>

      {loading ? (
        <LoadingAnimation className="mx-auto h-24 w-24" />
      ) : (
        <>
          <div className="rounded-xl border">
            <SortableTable
              columns={columns}
              data={stores}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} stores total</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page * 10 >= total} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
