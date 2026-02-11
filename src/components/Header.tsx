import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Patients', path: '/patients' },
    { label: 'Doctor Portal', path: '/doctor-portal' },
    { label: 'Pharmacy Portal', path: '/pharmacy-portal' },
    { label: 'Lab Portal', path: '/lab-portal' },
  ];

  return (
    <header className="w-full bg-background border-b border-medium-grey">
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
        </div>
      </div>
    </header>
  );
}
