import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SortableTable } from '@/components/SortableTable';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import api, { getErrorMessage } from '@/lib/api';

const roleBadge = (role) => {
  const variants = {
    admin: 'default',
    user: 'secondary',
    store_owner: 'warning',
  };
  return <Badge variant={variants[role] || 'outline'}>{role}</Badge>;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { sort: sortField, dir: sortDir, page, limit: 10 };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    api
      .get('/admin/users', { params })
      .then((res) => {
        const { users: userList, total: userTotal } = res.data.data;
        console.log('[AdminUsersPage] /admin/users response:', res.data);
        if (!Array.isArray(userList)) {
          console.error('[AdminUsersPage] Expected res.data.data.users to be an array, got:', userList);
          setUsers([]);
          setTotal(0);
          return;
        }
        setUsers(userList);
        setTotal(userTotal ?? 0);
      })
      .catch((err) => {
        console.error('[AdminUsersPage] /admin/users failed:', getErrorMessage(err), err.response?.data);
        setUsers([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [filters, sortField, sortDir, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => roleBadge(row.role),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Link to={`/admin/users/${row.id}`} className="text-sm text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <AppLayout title="Users" description="Manage platform users">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Filter by name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Filter by email" value={filters.email} onChange={(e) => setFilters((f) => ({ ...f, email: e.target.value }))} />
          <Input placeholder="Filter by address" value={filters.address} onChange={(e) => setFilters((f) => ({ ...f, address: e.target.value }))} />
          <select
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        <Button asChild>
          <Link to="/admin/users/new"><Plus className="h-4 w-4" /> Add User</Link>
        </Button>
      </div>

      {loading ? (
        <LoadingAnimation className="mx-auto h-24 w-24" />
      ) : (
        <>
          <div className="rounded-xl border">
            <SortableTable
              columns={columns}
              data={users}
              sortField={sortField}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} users total</span>
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
