import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, QrCode, ExternalLink, RefreshCw, X, Heart, Share2, Link } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useClipboard } from '../../hooks/useClipboard';
import { generateQrCode } from '../../lib/qr';
import { containerVariants, itemVariants } from '../../components/animations/variants';

// 50 different funny/friendly dismiss button texts
const DISMISS_BUTTON_TEXTS = [
  'Maybe later', 'Got it, thanks', 'No thanks', 'Close', 'Not today',
  'I am good', 'Will do next time', 'Skip', 'Remind me later', 'I will pass',
  'Sounds good, but no', 'Awesome, thanks', 'Understood', 'Okay', 'Dismiss',
  'Hide this', 'Got it', 'Right on', 'Farewell', 'Cool story, bro',
  'No cash today', 'My pockets are empty', 'Next time, promise', 'Already supported!', 'I am broke',
  'Click to close', 'Perhaps tomorrow', 'Shhh, hiding this', 'Done', 'Roger that',
  'Acknowledged', 'Hide popup', 'Keep it free', 'Maybe another day', 'Alrighty',
  'Let me be', 'Not now', 'Later, alligator', 'No thanks, pastely', 'Quietly dismiss',
  'Peace out', 'Exit', 'Close this card', 'Read & skip', 'Indeed',
  'Sure, but no', 'Gotcha', 'Thanks anyway', 'Bye bye', 'Understood, close'
];

interface SuccessPageProps {
  code: string;
}

export const SuccessPage: React.FC<SuccessPageProps> = ({ code }) => {
  const [key, setKey] = useState<string>('');
  
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showSupportPopup, setShowSupportPopup] = useState(true);
  const [dismissText, setDismissText] = useState('Maybe later');

  const { copied: codeCopied, copy: copyCode } = useClipboard();
  const { copied: linkCopied, copy: copyLink } = useClipboard();

  // Extract key fragment (#k=...) natively from window location
  useEffect(() => {
    const hash = window.location.hash;
    const kIndex = hash.indexOf('k=');
    if (kIndex !== -1) {
      // Key is everything after 'k='
      const keyVal = hash.substring(kIndex + 2);
      setKey(keyVal);
    }
  }, [window.location.hash]);

  const shareUrl = `${window.location.origin}/#/view/${code}#k=${key}`;

  // Generate QR code url
  const handleGenerateQr = async () => {
    try {
      const url = await generateQrCode(shareUrl, true);
      setQrCodeUrl(url);
      setShowQrModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Web Share API
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pastely Encrypted Paste',
          text: 'Open this encrypted clipboard snippet on Pastely.',
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyLink(shareUrl);
    }
  };

  // Select a random dismiss button text on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DISMISS_BUTTON_TEXTS.length);
    setDismissText(DISMISS_BUTTON_TEXTS[randomIndex]);
  }, []);

  return (
    <PageWrapper className="max-w-2xl" animate>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-8 items-center text-center w-full"
      >
        {/* Animated Checkmark */}
        <motion.div variants={itemVariants} className="flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400">
            <svg
              className="w-10 h-10 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline
                points="20 6 9 17 4 12"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  animation: 'draw-check 0.6s ease-out forwards',
                }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Paste Created!</h1>
          <p className="text-sm text-secondary mt-1 max-w-md">
            Retrieve it from any device using the code below, or share the direct link.
          </p>
        </motion.div>

        {/* Large Code Display Card */}
        <motion.div variants={itemVariants} className="w-full">
          <Card className="flex flex-col items-center p-8 gap-6 border-brand-500/10 bg-brand-500/5 select-all">
            <span className="code-chip font-bold font-mono tracking-widest leading-none">
              {code}
            </span>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <Button
                variant="secondary"
                size="sm"
                className="font-semibold bg-surface-300 border-surface-400"
                onClick={() => copyCode(code)}
                leftIcon={codeCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              >
                {codeCopied ? 'Copied Code' : 'Copy Code'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="font-semibold bg-surface-300 border-surface-400"
                onClick={() => copyLink(shareUrl)}
                leftIcon={linkCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link className="w-4 h-4" />}
              >
                {linkCopied ? 'Copied Link' : 'Copy Share Link'}
              </Button>

              {navigator.share && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="font-semibold bg-surface-300 border-surface-400"
                  onClick={handleShare}
                  leftIcon={<Share2 className="w-4 h-4" />}
                >
                  Share
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions Footer */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <Button
            variant="secondary"
            className="w-full bg-surface-200"
            onClick={handleGenerateQr}
            leftIcon={<QrCode className="w-4 h-4" />}
          >
            Show QR Code
          </Button>

          <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button
              variant="secondary"
              className="w-full bg-surface-200"
              leftIcon={<ExternalLink className="w-4 h-4" />}
            >
              Open Link
            </Button>
          </a>

          <a href="#/create" className="w-full">
            <Button
              variant="primary"
              className="w-full shadow-glow-sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Create Another
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Support Pop-up (Non-blocking bottom right or central footer) */}
      <AnimatePresence>
        {showSupportPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-30 max-w-sm w-full p-5 rounded-2xl border border-surface bg-surface-50 shadow-card-hover backdrop-blur-md flex flex-col gap-4 animate-slide-up"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner-glow flex-shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xs font-semibold text-primary">Support Pastely</h4>
                <p className="text-[11px] text-secondary leading-relaxed mt-1">
                  Pastely is completely free, secure, and private. Help keep the hosting, servers, and domain paid for!
                </p>
              </div>
              <button
                onClick={() => setShowSupportPopup(false)}
                className="p-1 rounded-lg hover:bg-surface-200 text-muted hover:text-primary transition-colors focus:outline-none flex-shrink-0"
                aria-label="Close popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 w-full">
              <a
                href="https://ko-fi.com/flashbutlegendary"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-none text-xs"
                >
                  Support Pastely
                </Button>
              </a>

              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-xs border border-surface-300 hover:border-surface-400 hover:bg-surface-200 font-semibold"
                onClick={() => setShowSupportPopup(false)}
              >
                {dismissText}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowQrModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-surface-50 border border-surface rounded-2xl shadow-card-hover z-10 overflow-hidden p-6 relative flex flex-col items-center text-center gap-6"
            >
              <div className="flex justify-between items-center w-full">
                <h3 className="text-sm font-bold text-primary">Scan QR Code</h3>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-200 text-secondary hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Image Box */}
              <div className="qr-container bg-white p-3 rounded-2xl border border-surface-200">
                <img src={qrCodeUrl} alt="Pastely Share QR Code" className="w-48 h-48" />
              </div>

              <div className="text-xs text-secondary leading-relaxed">
                Scan this QR code with your mobile camera to retrieve the encrypted paste immediately.
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="w-full bg-surface-200"
                onClick={() => setShowQrModal(false)}
              >
                Close QR Code
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};
export default SuccessPage;
