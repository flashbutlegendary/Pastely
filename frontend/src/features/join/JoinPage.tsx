import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { validateCustomCode } from '../../lib/codegen';

export const JoinPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const input = inputValue.trim();
    if (!input) {
      setError('Please enter a code or link.');
      return;
    }

    // 1. Check if user pasted a full Pastely URL
    try {
      if (input.includes('/view/')) {
        const url = new URL(input);
        const pathParts = url.pathname.split('/');
        const codeIndex = pathParts.indexOf('view') + 1;
        const code = pathParts[codeIndex];
        const hash = url.hash; // contains #k=...

        if (code) {
          navigate(`/view/${code}${hash}`);
          return;
        }
      }
    } catch (err) {
      // Not a valid URL, fallback to parsing as code
    }

    // 2. Validate custom code format
    const cleanCode = input.toUpperCase();
    const validation = validateCustomCode(cleanCode);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid code format.');
      return;
    }

    // 3. Navigate to ViewPage (if no key is provided, ViewPage will ask for it)
    navigate(`/view/${cleanCode}`);
  };

  return (
    <PageWrapper className="max-w-md" animate>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Retrieve Paste</h1>
          <p className="text-sm text-secondary mt-1">Enter the short code or paste the shared link.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5 animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="flex flex-col gap-5 p-6 md:p-8">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="join-code" className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1">
                Share Code or URL
              </label>
              <div className="relative">
                <input
                  id="join-code"
                  type="text"
                  placeholder="e.g. N7KP or full URL..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="input-base pr-11 font-semibold uppercase tracking-wide placeholder:normal-case placeholder:font-normal"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                  <KeyRound className="w-4 h-4" />
                </span>
              </div>
              <span className="text-[10px] text-muted ml-1">
                You can paste the entire link containing the decryption key to open it instantly.
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-glow"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Paste
            </Button>
          </Card>
        </form>
      </div>
    </PageWrapper>
  );
};
