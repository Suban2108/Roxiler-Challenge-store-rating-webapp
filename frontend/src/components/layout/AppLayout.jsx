import { Navbar } from '@/components/layout/Navbar';

export function AppLayout({ children, title, description }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {(title || description) && (
          <div className="mb-8">
            {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
