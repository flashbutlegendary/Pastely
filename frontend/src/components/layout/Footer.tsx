import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-surface border-opacity-40 bg-surface/50 transition-colors duration-200 mt-auto py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500 text-white shadow-glow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-3.5 h-3.5 fill-current">
                  <rect x="9" y="7" width="14" height="2.5" rx="1.25" opacity="0.9"/>
                  <rect x="9" y="12" width="10" height="2.5" rx="1.25" opacity="0.7"/>
                  <rect x="9" y="17" width="12" height="2.5" rx="1.25" opacity="0.8"/>
                  <rect x="9" y="22" width="8" height="2.5" rx="1.25" opacity="0.5"/>
                </svg>
              </div>
              <span className="text-sm font-bold text-primary">Pastely</span>
            </div>
            <p className="text-xs text-muted mt-1">Paste once. Open anywhere.</p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-secondary">
            <Link to="/features" className="hover:text-primary transition-colors">Features</Link>
            <Link to="/security" className="hover:text-primary transition-colors">Security</Link>
            <Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link>
            <Link to="/feedback" className="hover:text-primary transition-colors">Feedback</Link>
            <Link to="/support" className="hover:text-primary transition-colors flex items-center gap-1 text-amber-500">
              <Heart className="w-3 h-3 fill-current" /> Support
            </Link>
          </div>

          {/* Copy info */}
          <div className="text-[11px] text-muted text-center md:text-right">
            <p>&copy; {currentYear} Pastely. All rights reserved.</p>
            <p className="mt-0.5">Privacy-first clipboard sharing.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
