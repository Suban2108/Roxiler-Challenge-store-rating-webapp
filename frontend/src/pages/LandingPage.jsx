import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Store, MapPin, Star } from 'lucide-react';

function Footer() {
  return (
    <footer className="mt-12 border-t pt-6 text-center text-sm text-slate-500">
      <div className="max-w-4xl mx-auto">© {new Date().getFullYear()} StoreRate — Simple store ratings</div>
    </footer>
  );
}

export default function LandingPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get('/stores')
      .then((res) => {
        if (!mounted) return;
        setStores(res.data.data || res.data || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-6">
      <header className="max-w-4xl mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg animate-bounce">
            <Store size={20} />
          </div>
          <h1 className="text-2xl font-semibold">StoreRate</h1>
        </div>
        <nav className="space-x-4 text-sm text-slate-600">
          <a href="/login" className="hover:underline">Login</a>
          <a href="/register" className="hover:underline">Register</a>
          <a href="/landing" className="hover:underline">Landing</a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Find and rate local stores</h2>
              <p className="mt-2 text-slate-600">Browse stores and leave honest ratings — quick and simple.</p>
            </div>
            <div className="text-indigo-600 text-4xl animate-pulse">★</div>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Stores near you</h3>
            <div className="text-sm text-slate-500 flex items-center gap-2">
              <MapPin size={14} /> Live list
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading && (
              <div className="col-span-full flex items-center justify-center p-10">
                <LoadingAnimation className="h-24 w-24" />
              </div>
            )}

            {!loading && error && (
              <div className="col-span-full p-6 text-red-600">Failed to load stores.</div>
            )}

            {!loading && stores.length === 0 && !error && (
              <div className="col-span-full p-6 text-slate-500">No stores available yet.</div>
            )}

            {stores.map((s) => (
              <article key={s.id} className="flex items-start gap-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                <div className="bg-indigo-50 p-3 rounded-md">
                  <Store size={28} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{s.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-yellow-500">
                      <Star size={14} /> <span>{s.avg_rating ?? '—'}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{s.address}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
