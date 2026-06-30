import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Clock, Eye, Copy, Download, CornerDownRight, AlertCircle, Lock, ShieldAlert, FileText, Check } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { api } from '../../lib/api';
import { decryptContent, extractKeyFromFragment } from '../../lib/crypto';
import { useClipboard } from '../../hooks/useClipboard';
import { ViewPasteResponse, ApiError } from '../../types/paste';

export const ViewPage: React.FC = () => {
  const { code = '' } = useParams<{ code: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Data fetching states
  const [paste, setPaste] = useState<ViewPasteResponse | null>(null);
  const [decryptedText, setDecryptedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<'NOT_FOUND' | 'EXPIRED' | 'BURNED' | 'DECRYPT_FAIL' | 'NETWORK' | null>(null);

  // Key prompting states
  const [keyInput, setKeyInput] = useState('');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [keyNeeded, setKeyNeeded] = useState(false);

  const { copied, copy } = useClipboard();

  // Load paste record
  useEffect(() => {
    let active = true;

    async function loadPaste() {
      setIsLoading(true);
      setErrorState(null);
      setKeyNeeded(false);

      try {
        const record = await api.getPaste(code);
        if (!active) return;
        setPaste(record);

        // Check if encryption key is in URL fragment
        const urlKey = extractKeyFromFragment(location.hash);
        if (urlKey) {
          try {
            const decrypted = await decryptContent(record.encryptedPayload, record.iv, urlKey);
            setDecryptedText(decrypted);
          } catch (decErr) {
            setErrorState('DECRYPT_FAIL');
          }
        } else {
          // No key in URL fragment, must prompt user
          setKeyNeeded(true);
        }
      } catch (err: any) {
        if (!active) return;
        console.error('Failed to retrieve paste:', err);
        const codeErr = (err as ApiError).code;
        if (codeErr === 'NOT_FOUND') {
          setErrorState('NOT_FOUND');
        } else if (codeErr === 'EXPIRED') {
          setErrorState('EXPIRED');
        } else if (codeErr === 'MAX_VIEWS_REACHED') {
          setErrorState('BURNED');
        } else {
          setErrorState('NETWORK');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadPaste();

    return () => {
      active = false;
    };
  }, [code, location.hash]);

  // Handle manual decryption key submission
  const handleDecryptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setKeyError(null);

    if (!keyInput.trim() || !paste) {
      setKeyError('Please enter a decryption key.');
      return;
    }

    try {
      // Key can be full URL containing the fragment, or just the raw base64 key
      let keyToUse = keyInput.trim();
      if (keyToUse.includes('#k=')) {
        const urlPart = new URL(keyToUse);
        const parsedKey = extractKeyFromFragment(urlPart.hash);
        if (parsedKey) keyToUse = parsedKey;
      }

      const decrypted = await decryptContent(paste.encryptedPayload, paste.iv, keyToUse);
      setDecryptedText(decrypted);
      setKeyNeeded(false);
    } catch (err) {
      setKeyError('Invalid decryption key. Ensure you copied the full key or link.');
    }
  };

  // Download paste content as TXT
  const handleDownload = () => {
    if (!decryptedText) return;
    const blob = new Blob([decryptedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pastely_${code || 'paste'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Formatting dates
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <PageWrapper className="max-w-md items-center text-center justify-center min-h-[50vh]">
        <Spinner className="w-10 h-10 text-brand-500 mb-4" />
        <h3 className="text-sm font-semibold text-secondary">Retrieving paste data...</h3>
        <p className="text-xs text-muted mt-1">Decrypting locally inside browser</p>
      </PageWrapper>
    );
  }

  // 2. ERROR STATES
  if (errorState) {
    const errorConfigs = {
      NOT_FOUND: {
        title: 'Wrong Code / Not Found',
        desc: 'The code you entered does not exist or may have been deleted by the creator.',
        badge: 'Not Found',
      },
      EXPIRED: {
        title: 'Expired Code',
        desc: 'This paste has expired and is no longer available. All data was deleted.',
        badge: 'Expired',
      },
      BURNED: {
        title: 'Content Destroyed',
        desc: 'This was a burn-after-read secret and has reached its maximum view limit.',
        badge: 'Burned',
      },
      DECRYPT_FAIL: {
        title: 'Decryption Error',
        desc: 'Failed to decrypt content. The key in your link might be corrupted or incorrect.',
        badge: 'Decryption Failed',
      },
      NETWORK: {
        title: 'Connection Issue',
        desc: 'Could not connect to Pastely servers. Please check your network connection.',
        badge: 'Network Error',
      },
    };

    const config = errorConfigs[errorState];

    return (
      <PageWrapper className="max-w-md text-center" animate>
        <Card className="flex flex-col items-center gap-6 p-8 border-red-500/10 bg-red-500/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          
          <div>
            <Badge variant="error" className="mb-2">{config.badge}</Badge>
            <h1 className="text-xl font-bold text-primary">{config.title}</h1>
            <p className="text-sm text-secondary leading-relaxed mt-2">{config.desc}</p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button variant="primary" className="w-full" onClick={() => navigate('/join')}>
              Try Another Code
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </Card>
      </PageWrapper>
    );
  }

  // 3. KEY INPUT NEEDED STATE
  if (keyNeeded) {
    return (
      <PageWrapper className="max-w-md" animate>
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">Decryption Key Required</h1>
            <p className="text-sm text-secondary mt-1">This paste was encrypted locally. Paste the key to decrypt.</p>
          </div>

          {keyError && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>{keyError}</div>
            </div>
          )}

          <form onSubmit={handleDecryptSubmit}>
            <Card className="flex flex-col gap-5 p-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1">
                  Decryption Key or Share Link
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter #k= key value..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="input-base pr-10 font-mono"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                    <Lock className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <Button type="submit" variant="primary" className="w-full font-bold shadow-glow">
                Decrypt Content
              </Button>
            </Card>
          </form>
        </div>
      </PageWrapper>
    );
  }

  // 4. DISPLAY DECRYPTED PASTE
  return (
    <PageWrapper className="max-w-4xl" animate>
      <div className="flex flex-col gap-6">
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="brand">Active</Badge>
              {paste?.contentType !== 'text/plain' && (
                <Badge variant="neutral">{paste?.contentType}</Badge>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-primary tracking-tight mt-2 flex items-center gap-2">
              <FileText className="w-5.5 h-5.5 text-brand-400" />
              {paste?.title || 'Untitled Paste'}
            </h1>
          </div>

          {/* Quick Info Grid */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-secondary font-medium">
            <span className="bg-surface-200 border border-surface px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted" /> Created: {paste && formatTime(paste.createdAt)}
            </span>

            {paste?.expiresAt && (
              <span className="bg-surface-200 border border-surface px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted" /> Expires: {formatTime(paste.expiresAt)}
              </span>
            )}

            {paste?.maxViews && (
              <span className="bg-surface-200 border border-surface px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-muted" /> Views: {paste.views} / {paste.maxViews}
              </span>
            )}
          </div>
        </div>

        {/* Content Box */}
        <Card className="p-0 border overflow-hidden flex flex-col min-h-[300px]">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface bg-surface-100/50">
            <div className="text-xs text-secondary font-semibold font-mono">
              code: <span className="text-brand-400 uppercase">{code}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="text-xs bg-surface-200 border-surface-300 font-semibold"
                onClick={() => copy(decryptedText)}
                leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied' : 'Copy All'}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="text-xs bg-surface-200 border-surface-300 font-semibold"
                onClick={handleDownload}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download
              </Button>
            </div>
          </div>

          {/* Text Content */}
          <textarea
            readOnly
            className="w-full flex-1 p-6 md:p-8 font-mono text-sm leading-relaxed text-[#c8d3f5] bg-black/10 focus:outline-none resize-none no-scrollbar min-h-[250px]"
            value={decryptedText}
          />
        </Card>
      </div>
    </PageWrapper>
  );
};
