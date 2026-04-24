import { Link } from 'react-router-dom';
import { Navigation, Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import PartnerModal from '@/components/PartnerModal';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showPartner, setShowPartner] = useState(false);
  const [dark, setDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <>
      <nav className="h-16 border-b border-border/60 glass-surface sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tighter text-foreground">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Navigation size={16} fill="currentColor" />
          </div>
          Velocity
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/find" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Find Help
          </Link>
          <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Admin
          </Link>
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setShowPartner(true)}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff' }}
          >
            Partner Login
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="absolute top-16 left-0 right-0 glass-surface border-b border-border p-4 flex flex-col gap-3 md:hidden z-40">
            <Link to="/find" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
              Find Help
            </Link>
            <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-primary py-2">
              Admin
            </Link>
            <button
              onClick={() => { setOpen(false); setShowPartner(true); }}
              className="w-full py-2.5 text-sm font-semibold rounded-lg text-white"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
            >
              Partner Login
            </button>
          </div>
        )}
      </nav>

      {/* Portal-based modal — renders outside nav stacking context */}
      {showPartner && <PartnerModal onClose={() => setShowPartner(false)} />}
    </>
  );
}
