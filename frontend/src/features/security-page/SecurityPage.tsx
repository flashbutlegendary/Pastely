import React from 'react';
import { Shield, EyeOff, KeyRound, Lock, Trash } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const SecurityPage: React.FC = () => {
  return (
    <PageWrapper className="max-w-4xl" animate>
      <div className="flex flex-col gap-10 text-left">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Security & Privacy</h1>
          <p className="text-sm text-secondary mt-1">
            How Pastely protects your data through client-side cryptographic encryption.
          </p>
        </div>

        {/* Intro Highlight Box */}
        <Card className="border-brand-500/10 bg-brand-500/5 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex-shrink-0 shadow-inner-glow">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Zero-Knowledge Architecture</h3>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              Zero-knowledge means we design Pastely so that it is mathematically impossible for us (the hosting provider, database administrator, or server developers) to read your clipboard content. Your browser encrypts the content before uploading, and only recipients with the key can decrypt it.
            </p>
          </div>
        </Card>

        {/* Technical Explanations */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-200 border border-surface-300 text-brand-400 flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Browser-Side Encryption (AES-GCM 256)</h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                When you click "Create Code", your browser utilizes the native Web Crypto API to generate a cryptographically secure 256-bit AES symmetric key. The content is encrypted inside your browser. The server only receives the encrypted payload (ciphertext) and the random Initialization Vector (IV).
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-200 border border-surface-300 text-emerald-400 flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Key Stored in URL Fragment (#k=...)</h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                The encryption key is appended to the URL fragment identifier (following the `#` symbol). Under RFC standards, URL fragments are processed purely locally by the browser and are **never transmitted to the server** in HTTP requests. If you share just the short code, the recipient will be prompted to supply this key manually.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-200 border border-surface-300 text-red-400 flex-shrink-0">
              <Trash className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">Automatic, Permanent Deletion</h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                When a paste reaches its expiration window (e.g. 10 minutes) or its maximum view count (e.g. 1 view), the database record is completely purged from Cloudflare D1. Furthermore, we run hourly cleanup cron routines to wipe expired records, ensuring deleted data is unrecoverable.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-200 border border-surface-300 text-purple-400 flex-shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-primary">No Logs, No IP Storing, No Tracking</h3>
              <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                We believe privacy is a fundamental human right. Pastely does not write user IP addresses to database records, does not use tracking cookies (we only store theme settings locally), and contains no analytics scripts or third-party advertising tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Warning / Caveats (Clear language, not misleading) */}
        <Card className="border-surface-300 bg-surface-150 p-6 flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-secondary tracking-wider uppercase">Important Security Notes</h4>
          <ul className="list-disc list-inside text-xs text-secondary leading-relaxed flex flex-col gap-2">
            <li>
              <strong>Short Code Brute Force Protection:</strong> Custom short codes (4-8 characters) have lower entropy than the encryption key itself. To prevent bots from enumerating and finding active codes, we enforce strict rate limits on wrong code attempts per IP.
            </li>
            <li>
              <strong>Physical Screen Privacy:</strong> Since the decryption key is inside the URL fragment, anyone with access to your browser history or screen could potentially open the link. Clear your browser history if using public computers.
            </li>
            <li>
              <strong>Browser Extensions:</strong> Some malicious browser extensions have the capability to read clipboard content or inspect web page states. Ensure you trust your installed browser extensions.
            </li>
          </ul>
        </Card>
      </div>
    </PageWrapper>
  );
};
