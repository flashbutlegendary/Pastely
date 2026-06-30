import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Github, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'Security', path: '/security' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Feedback', path: '/feedback' },
    { name: 'History', path: '/history' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-surface border-opacity-40 bg-surface/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-glow-sm transition-transform duration-200 group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                  <rect x="9" y="7" width="14" height="2.5" rx="1.25" opacity="0.9"/>
                  <rect x="9" y="12" width="10" height="2.5" rx="1.25" opacity="0.7"/>
                  <rect x="9" y="17" width="12" height="2.5" rx="1.25" opacity="0.8"/>
                  <rect x="9" y="22" width="8" height="2.5" rx="1.25" opacity="0.5"/>
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">
                Pastely
              </span>
            </Link>
          </div>

          {/* Center: Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-surface-200/50 border border-surface border-opacity-60 rounded-full px-1 py-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-surface-elevated text-primary shadow-inner-glow'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface-200 transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface-200 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link to="/support">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20 hover:border-amber-500/30 font-semibold"
                leftIcon={<Heart className="w-3.5 h-3.5 fill-current" />}
              >
                Support
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-secondary hover:text-primary focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-secondary hover:text-primary focus:outline-none"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-t border-surface bg-surface"
          >
            <div className="space-y-1.5 px-4 pb-6 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-surface-200 text-primary'
                      : 'text-secondary hover:bg-surface-200 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="divider my-4" />

              <div className="flex items-center justify-between gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary px-4 py-2"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>

                <Link
                  to="/support"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="secondary"
                    className="w-full text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border-amber-500/20 hover:border-amber-500/30"
                    leftIcon={<Heart className="w-3.5 h-3.5 fill-current" />}
                  >
                    Support Creator
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
