import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Copy, Trash2, ShieldAlert, KeyRound, ExternalLink, Calendar, Check } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { getLocalHistory, removeHistoryEntry, clearHistory } from '../../lib/history';
import { useClipboard } from '../../hooks/useClipboard';
import { api } from '../../lib/api';
import { HistoryEntry } from '../../types/paste';

export const HistoryPage: React.FC = () => {
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const { copied, copy } = useClipboard();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);

  useEffect(() => {
    setHistoryList(getLocalHistory());
  }, []);

  // Format dates helper
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if item has expired
  const isExpired = (expiresAt: number | null) => {
    if (expiresAt === null) return false;
    return expiresAt < Date.now();
  };

  // Delete paste from Cloud (server) + local storage history
  const handleDeleteCloud = async (code: string, deleteToken: string) => {
    if (window.confirm('Are you sure you want to delete this paste from the cloud? This action is permanent.')) {
      setDeletingCode(code);
      try {
        await api.deletePaste(code, deleteToken);
      } catch (err) {
        console.error('Failed to delete paste from server (it might be already expired/deleted):', err);
      } finally {
        removeHistoryEntry(code);
        setHistoryList(getLocalHistory());
        setDeletingCode(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all local history? This will not delete the pastes on the cloud.')) {
      clearHistory();
      setHistoryList([]);
    }
  };

  return (
    <PageWrapper className="max-w-4xl" animate>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Paste History</h1>
            <p className="text-sm text-secondary mt-1">
              Your last {historyList.length} created pastes. Stored only in this browser.
            </p>
          </div>
          {historyList.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 font-semibold"
              onClick={handleClearAll}
            >
              Clear Local History
            </Button>
          )}
        </div>

        {/* Empty state */}
        {historyList.length === 0 ? (
          <Card className="flex flex-col items-center justify-center text-center p-12 gap-5 border border-surface-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-200 text-muted">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">No past pastes found</h3>
              <p className="text-sm text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                Pastes you create on this browser will be listed here, complete with keys and deletion controls.
              </p>
            </div>
            <Link to="/create">
              <Button variant="primary" className="font-semibold shadow-glow-sm">
                Create First Paste
              </Button>
            </Link>
          </Card>
        ) : (
          /* History table/list */
          <div className="flex flex-col gap-4">
            {historyList.map((item) => {
              const expired = isExpired(item.expiresAt);
              return (
                <Card
                  key={item.code}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 hover:border-brand-500/20 transition-all ${
                    expired ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-wide text-brand-400 uppercase font-mono bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10">
                        {item.code}
                      </span>
                      <h3 className="font-bold text-primary text-base">
                        {item.title || 'Untitled Paste'}
                      </h3>
                      {expired && <Badge variant="neutral">Expired</Badge>}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary mt-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted" /> Created: {formatDate(item.createdAt)}
                      </span>
                      {item.expiresAt && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted" /> Expires: {formatDate(item.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:self-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-surface-200 border-surface-300 font-semibold"
                      onClick={() => copy(item.shareUrl)}
                      leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    >
                      {copied ? 'Copied' : 'Copy Link'}
                    </Button>

                    <a href={item.shareUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-surface-200 border-surface-300"
                        leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        Open
                      </Button>
                    </a>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                      isLoading={deletingCode === item.code}
                      onClick={() => handleDeleteCloud(item.code, item.deleteToken)}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete Paste
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
