import React from 'react';
import { Heart, Coffee, Server, Globe, ShieldCheck } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const SupportPage: React.FC = () => {
  return (
    <PageWrapper className="max-w-3xl" animate>
      <div className="flex flex-col gap-10 items-center text-center">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Support the Creator</h1>
          <p className="text-sm text-secondary mt-1">Keep clipboard sharing free, private, and fast.</p>
        </div>

        {/* Support Card */}
        <Card className="border border-amber-500/15 bg-amber-500/5 p-8 md:p-12 flex flex-col items-center gap-8 w-full max-w-2xl relative overflow-hidden">
          {/* Top Heart Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-glow-sm">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          {/* Explanation */}
          <div className="max-w-md">
            <h3 className="text-xl font-bold text-primary">Made with Love, Built for Speed</h3>
            <p className="text-sm text-secondary leading-relaxed mt-3">
              Pastely was created to solve a simple problem: moving text between devices instantly and privately. 
              There are no accounts, no advertisements, and no tracking scripts.
            </p>
            <p className="text-sm text-secondary leading-relaxed mt-4">
              Running a privacy-first web application requires reliable resources. 
              Your donations directly cover our operating expenses, including server hosting, edge database bandwidth, domains, SSL certificates, and future feature developments.
            </p>
          </div>

          {/* Expense points list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left mt-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-200 border border-surface-300">
              <Server className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-secondary">Edge Servers & DB</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-200 border border-surface-300">
              <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-secondary">Bandwidth & Domains</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-200 border border-surface-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span className="text-[11px] font-semibold text-secondary">Maintenance & Dev</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://ko-fi.com/flashbutlegendary"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="primary"
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-glow-sm text-base px-8 py-4 flex items-center gap-2"
              leftIcon={<Coffee className="w-5 h-5 fill-current" />}
            >
              Support Pastely
            </Button>
          </a>
        </Card>
      </div>
    </PageWrapper>
  );
};
