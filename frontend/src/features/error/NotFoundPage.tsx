import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PageWrapper } from '../../components/layout/PageWrapper';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper className="max-w-md text-center" animate>
      <Card className="flex flex-col items-center gap-6 p-8 border border-surface-300">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-200 text-muted">
          <HelpCircle className="w-7 h-7" />
        </div>
        
        <div>
          <h1 className="text-xl font-bold text-primary">Page Not Found</h1>
          <p className="text-sm text-secondary leading-relaxed mt-2">
            The page you are looking for does not exist, has been moved, or contains a typo.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button variant="primary" className="w-full" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </Card>
    </PageWrapper>
  );
};
