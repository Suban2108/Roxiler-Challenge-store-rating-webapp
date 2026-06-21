import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Store,
  Users,
  LayoutDashboard,
  KeyRound,
  Home,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import Logo from '../../../public/logo.jpeg';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Common links for everyone
  const commonLinks = [
    { to: '/landing', label: 'Home', icon: Home },
    { to: '/change-password', label: 'Password', icon: KeyRound },
  ];

  // Admin links
  const adminLinks = [
    ...commonLinks,
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/stores', label: 'Stores', icon: Store },
  ];

  // Store owner links
  const ownerLinks = [
    ...commonLinks,
    { to: '/owner', label: 'Dashboard', icon: LayoutDashboard },
  ];

  // Normal user links
  const userLinks = [
    ...commonLinks,
    { to: '/dashboard', label: 'Stores', icon: Store },
  ];

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'store_owner'
      ? ownerLinks
      : userLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link to="/landing">
            <img
              src={Logo}
              alt="logo"
              className="w-[50px] rounded-full"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden text-sm text-muted-foreground sm:block">
              {user.name}
            </div>
          )}

          <ThemeToggle />

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}