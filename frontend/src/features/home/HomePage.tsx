import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, KeyRound, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { containerVariants, itemVariants } from '../../components/animations/variants';

export const HomePage: React.FC = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-3xl flex flex-col items-center gap-8"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Pastely Dashboard</h1>
          <p className="text-sm text-secondary mt-1">What would you like to do today?</p>
        </motion.div>

        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          {/* Create Code Card */}
          <Card
            isHoverable
            onClick={() => { window.location.hash = '#/create'; }}
            className="flex flex-col justify-between items-start min-h-[220px] group cursor-pointer border border-surface-300 hover:border-brand-500/30 transition-all p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-6 group-hover:scale-105 transition-transform duration-200 shadow-inner-glow">
              <PlusCircle className="w-6 h-6" />
            </div>
            
            <div className="w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Create Code</h3>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                Paste your text, code, or links, set expiration rules, and encrypt it before sharing.
              </p>
            </div>
          </Card>

          {/* Enter Code Card */}
          <Card
            isHoverable
            onClick={() => { window.location.hash = '#/join'; }}
            className="flex flex-col justify-between items-start min-h-[220px] group cursor-pointer border border-surface-300 hover:border-brand-500/30 transition-all p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-6 group-hover:scale-105 transition-transform duration-200 shadow-inner-glow">
              <KeyRound className="w-6 h-6" />
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Enter Code</h3>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-brand-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                Retrieve content shared from another device by entering a simple 4 to 8 digit code.
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
};
export default HomePage;
