import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageWrapper } from '../../components/layout/PageWrapper';

interface FaqItem {
  question: string;
  answer: string;
}

export const FAQPage: React.FC = () => {
  const faqs: FaqItem[] = [
    {
      question: 'Is Pastely free?',
      answer: 'Yes. Pastely is 100% free to use. There are no paid tiers, no advertisements, and no restrictions on features. If you find the utility helpful, you can optionally support the creator via our Ko-fi page to help pay for hosting and domain costs.',
    },
    {
      question: 'Do I need an account?',
      answer: 'No. Pastely has no accounts, no logins, and no signup forms. You open the site, paste your text, get a code, and retrieve it immediately on another device.',
    },
    {
      question: 'How long are notes stored?',
      answer: 'Notes are stored for a duration chosen by you during creation: 10 minutes, 1 hour, 24 hours, or 7 days. You can also choose "Never" to keep it until manually deleted (or viewed, if view limits are set). Furthermore, if you specify view limits (e.g. 1 view), the paste is instantly and permanently deleted from our database as soon as it reaches that view count.',
    },
    {
      question: 'Can I share code?',
      answer: 'Absolutely. Pastely is heavily optimized for code snippets, markdown, URLs, plain notes, and clipboards. It maintains exact code spacing and line breaks.',
    },
    {
      question: 'Can I use it on mobile?',
      answer: 'Yes. Pastely is designed mobile-first. You can type short codes easily, copy values with one click, or scan the generated QR code with your mobile camera to retrieve pastes in a second without typing.',
    },
    {
      question: 'Can I share passwords?',
      answer: 'Technically, yes, because Pastely encrypts everything in the browser using AES-GCM-256 before uploading to the database. However, for extreme secrets, we recommend enabling "1 View (Burn after read)" so the secret vanishes immediately after opening.',
    },
    {
      question: 'Can anyone guess my code?',
      answer: 'By default, we generate 6-character random codes (e.g. TX8D8K) which provide over a billion permutations. While someone could try to guess active codes, we enforce strict rate limits on wrong code attempts per IP block. Additionally, even if someone guesses your code, they cannot read your paste without the 256-bit encryption key which never leaves your browser/link.',
    },
  ];

  return (
    <PageWrapper className="max-w-3xl" animate>
      <div className="flex flex-col gap-10 text-left">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Frequently Asked Questions</h1>
          <p className="text-sm text-secondary mt-1">Everything you need to know about Pastely.</p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <FaqAccordion key={idx} faq={faq} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
};

const FaqAccordion: React.FC<{ faq: FaqItem }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      className="p-5 cursor-pointer border border-surface-300 hover:border-surface-400 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
          <h3 className="text-sm font-bold text-primary">{faq.question}</h3>
        </div>
        <div className="text-secondary flex-shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-xs text-secondary leading-relaxed pl-8 border-l border-surface-300">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
