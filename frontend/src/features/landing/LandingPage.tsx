import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, Trash2, ArrowRight, Activity, Clock, Cpu } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { containerVariants, itemVariants } from '../../components/animations/variants';
import { api } from '../../lib/api';
import { AnalyticsData } from '../../types/paste';

export const LandingPage: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api.getAnalytics().then((data) => setStats(data)).catch(() => {});
  }, []);

  return (
    <PageWrapper className="flex flex-col items-center text-center justify-start min-h-[80vh]">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-hero-gradient pointer-events-none z-0" />

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative z-10 flex flex-col items-center max-w-3xl mt-4 md:mt-12"
      >
        {/* Banner Pill */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="badge font-mono tracking-wider py-1.5 px-3.5 uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full flex items-center gap-1.5 shadow-inner-glow">
            <Activity className="w-3.5 h-3.5 animate-pulse text-brand-400" />
            Zero-Knowledge Encryption Active
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-primary text-balance leading-[1.1] mb-6"
        >
          Move text between <br />
          <span className="text-brand-gradient">devices in seconds.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-secondary text-balance max-w-2xl mb-10 font-normal leading-relaxed"
        >
          Share code, notes, links, and clipboard content instantly with a short code. 
          No accounts. No setup. No friction. Encrypted client-side.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <Link to="/create" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-glow font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Code
            </Button>
          </Link>
          <Link to="/join" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto font-semibold bg-surface-200/50 hover:bg-surface-200"
            >
              Enter Code
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Feature Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10 mb-16"
      >
        <motion.div variants={itemVariants}>
          <Card isHoverable className="h-full flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shadow-inner-glow">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-primary">⚡ Instant</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Share text, code, or links instantly. Just paste, generate a code, and open it on any other device in seconds.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card isHoverable className="h-full flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-inner-glow">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-primary">🔒 Private</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Fully encrypted in your browser using the Web Crypto API (AES-GCM-256) before leaving. The server never sees plaintext.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card isHoverable className="h-full flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-inner-glow">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-primary">🗑 Auto Delete</h3>
            <p className="text-sm text-secondary leading-relaxed">
              Notes disappear automatically based on your expiration selection or max view count. Once deleted, they are gone forever.
            </p>
          </Card>
        </motion.div>
      </motion.div>

      {/* Aggregate Stats Section */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 w-full max-w-4xl p-8 rounded-2xl border border-surface bg-surface-100/40 backdrop-blur-sm flex flex-wrap items-center justify-around gap-6"
        >
          <div className="flex flex-col items-center gap-1 min-w-[120px]">
            <span className="text-3xl font-extrabold text-brand-400 font-mono">
              {(stats.totalPastes || 0).toLocaleString()}
            </span>
            <span className="text-xs text-secondary font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-muted" /> Total Transferred
            </span>
          </div>

          <div className="h-8 border-r border-surface hidden md:block" />

          <div className="flex flex-col items-center gap-1 min-w-[120px]">
            <span className="text-3xl font-extrabold text-primary font-mono">
              {(stats.todayPastes || 0).toLocaleString()}
            </span>
            <span className="text-xs text-secondary font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-muted" /> Sent Today
            </span>
          </div>

          <div className="h-8 border-r border-surface hidden md:block" />

          <div className="flex flex-col items-center gap-1 min-w-[120px]">
            <span className="text-3xl font-extrabold text-primary font-mono">
              {((stats.deletedPastes || 0) + (stats.expiredPastes || 0)).toLocaleString()}
            </span>
            <span className="text-xs text-secondary font-medium tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted" /> Expired & Deleted
            </span>
          </div>
        </motion.div>
      )}
    </PageWrapper>
  );
};
