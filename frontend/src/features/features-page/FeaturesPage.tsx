import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Key, Clock, Keyboard, MonitorSmartphone, FolderPlus, Compass } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { containerVariants, itemVariants } from '../../components/animations/variants';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-brand-400" />,
      title: 'Instant Sharing',
      desc: 'Move clipboard contents between devices in under three seconds. No login, no setup, no emails, no waiting.',
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-400" />,
      title: 'Zero-Knowledge Privacy',
      desc: 'Your data is encrypted in the browser. We do not store IP addresses, track cookies, or run analytics scripts.',
    },
    {
      icon: <Key className="w-5 h-5 text-purple-400" />,
      title: 'End-to-End Encryption',
      desc: 'We encrypt your notes using standard AES-GCM 256-bit keys. The decryption key remains in the URL fragment (#k=) and is never sent to the server.',
    },
    {
      icon: <Clock className="w-5 h-5 text-red-400" />,
      title: 'Automatic Expiration',
      desc: 'Set pastes to self-destruct after 10 minutes, 1 hour, 24 hours, 7 days, or never. Or restrict access to a specific number of views.',
    },
    {
      icon: <Keyboard className="w-5 h-5 text-amber-400" />,
      title: 'Custom Codes',
      desc: 'Specify your own custom alphanumeric code (e.g. N7KP) for quick typing. Easy to read and type on small screens.',
    },
    {
      icon: <MonitorSmartphone className="w-5 h-5 text-blue-400" />,
      title: 'Cross Device Access',
      desc: 'Fully optimized for desktop, tablet, and mobile. Use the QR code to scan and open links instantly with your mobile camera.',
    },
    {
      icon: <FolderPlus className="w-5 h-5 text-pink-400" />,
      title: 'Future File Sharing',
      desc: 'Our architecture is future-proofed to support images, videos, and PDFs using similar secure client-side encryption flows. Coming soon!',
    },
  ];

  return (
    <PageWrapper className="max-w-5xl" animate>
      <div className="flex flex-col gap-12 items-center text-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Features</h1>
          <p className="text-sm text-secondary mt-1 max-w-xl mx-auto">
            Pastely is optimized to be the fastest, simplest, and most secure transfer utility on the web.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full text-left"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card isHoverable className="h-full flex flex-col gap-4 p-6 border border-surface-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-200 border border-surface-300 shadow-inner-glow">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{feature.title}</h3>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">{feature.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageWrapper>
  );
};
