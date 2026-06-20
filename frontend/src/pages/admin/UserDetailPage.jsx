import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { RatingStars } from '@/components/RatingStars';
import api from '@/lib/api';

export default function UserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data.data.user))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AppLayout><LoadingAnimation className="mx-auto h-24 w-24" /></AppLayout>;
  if (!user) return <AppLayout><p>User not found</p></AppLayout>;

  return (
    <AppLayout title="User Details" description="View user information">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p>{user.address}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <Badge>{user.role}</Badge>
          </div>
          {user.role === 'store_owner' && user.rating !== null && (
            <div>
              <p className="text-sm text-muted-foreground">Store Rating</p>
              <div className="flex items-center gap-2">
                <RatingStars value={Math.round(parseFloat(user.rating) || 0)} readonly />
                <span>{(parseFloat(user.rating) || 0).toFixed(1)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
