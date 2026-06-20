import { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RatingStars } from '@/components/RatingStars';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { useDebounce } from '@/hooks/useDebounce';
import api, { getErrorMessage } from '@/lib/api';

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [pendingRatings, setPendingRatings] = useState({});
  const [error, setError] = useState('');

  const debouncedName = useDebounce(searchName);
  const debouncedAddress = useDebounce(searchAddress);

  const fetchStores = useCallback(() => {
    setLoading(true);
    api.get('/stores', {
      params: { name: debouncedName, address: debouncedAddress, limit: 50 },
    })
      .then((res) => {
        setStores(res.data.data.stores);
        const initial = {};
        res.data.data.stores.forEach((s) => {
          initial[s.id] = s.userRating || 0;
        });
        setPendingRatings(initial);
      })
      .finally(() => setLoading(false));
  }, [debouncedName, debouncedAddress]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const submitRating = async (store, optimisticValue) => {
    const previousStores = [...stores];
    const previousPending = { ...pendingRatings };

    setStores((prev) =>
      prev.map((s) =>
        s.id === store.id ? { ...s, userRating: optimisticValue } : s
      )
    );

    try {
      if (store.userRating) {
        await api.patch(`/ratings/${store.id}`, { rating: optimisticValue });
      } else {
        await api.post('/ratings', { storeId: store.id, rating: optimisticValue });
      }
      fetchStores();
    } catch (err) {
      setStores(previousStores);
      setPendingRatings(previousPending);
      setError(getErrorMessage(err));
    }
  };

  return (
    <AppLayout title="Browse Stores" description="Search stores and submit your ratings">
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <Input
          placeholder="Search by address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {loading ? (
        <LoadingAnimation className="mx-auto h-24 w-24" />
      ) : stores.length === 0 ? (
        <p className="text-center text-muted-foreground">No stores found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stores.map((store) => (
            <Card key={store.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{store.address}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overall rating</span>
                  <div className="flex items-center gap-2">
                    <RatingStars value={Math.round(store.overallRating)} readonly size="sm" />
                    <span className="text-sm font-medium">{store.overallRating.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Your rating {store.userRating ? '(click to modify)' : ''}
                  </p>
                  <RatingStars
                    value={pendingRatings[store.id] || 0}
                    onChange={(val) => {
                      setPendingRatings((p) => ({ ...p, [store.id]: val }));
                      submitRating(store, val);
                    }}
                  />
                </div>

                {store.userRating && (
                  <p className="text-xs text-muted-foreground">
                    Current rating: {store.userRating} stars
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
