import { Link, useLocation } from 'react-router-dom';
import { Activity, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useEffect } from 'react';

export default function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Patients', path: '/patients' },
    { label: 'Doctor Portal', path: '/doctor-portal' },
    { label: 'Pharmacy Portal', path: '/pharmacy-portal' },
    { label: 'Lab Portal', path: '/lab-portal' },
  ];

  return (
    <header className="w-full bg-background border-b border-medium-grey transition-colors duration-300">
      <div className="max-w-[100rem] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-foreground" />
            <span className="font-heading text-xl font-bold text-foreground">
              MedFlow
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-base transition-colors ${
                  location.pathname === link.path
                    ? 'text-foreground font-medium'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-light-grey hover:bg-medium-grey transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-foreground" />
            ) : (
              <Sun className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
