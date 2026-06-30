import React, { useState, useEffect } from 'react';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { LandingPage } from './features/landing/LandingPage';
import { HomePage } from './features/home/HomePage';
import { CreatePage } from './features/create/CreatePage';
import { SuccessPage } from './features/success/SuccessPage';
import { JoinPage } from './features/join/JoinPage';
import { ViewPage } from './features/view/ViewPage';
import { HistoryPage } from './features/history/HistoryPage';
import { FeaturesPage } from './features/features-page/FeaturesPage';
import { SecurityPage } from './features/security-page/SecurityPage';
import { FAQPage } from './features/faq-page/FAQPage';
import { FeedbackPage } from './features/feedback-page/FeedbackPage';
import { SupportPage } from './features/support/SupportPage';
import { NotFoundPage } from './features/error/NotFoundPage';

export const App: React.FC = () => {
  const [hash, setHash] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Parse path and query parameters
  const getRoute = () => {
    // Strip query or sub-fragments for page routing matching
    // Example: #/view/ABC123#k=xyz -> pathPart = #/view/ABC123
    const cleanHash = hash.split('#')[1] || '/';
    const path = '/' + cleanHash.split('?')[0];

    if (path === '/') return <LandingPage />;
    if (path === '/app') return <HomePage />;
    if (path === '/create') return <CreatePage />;
    if (path === '/history') return <HistoryPage />;
    if (path === '/features') return <FeaturesPage />;
    if (path === '/security') return <SecurityPage />;
    if (path === '/faq') return <FAQPage />;
    if (path === '/feedback') return <FeedbackPage />;
    if (path === '/support') return <SupportPage />;
    if (path === '/join') return <JoinPage />;

    if (path.startsWith('/created/')) {
      const code = path.split('/')[2] || '';
      return <SuccessPage code={code} />;
    }

    if (path.startsWith('/view/')) {
      const code = path.split('/')[2] || '';
      return <ViewPage code={code} />;
    }

    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex flex-col page-bg select-text">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Pages Content Container */}
      <div className="flex-1 flex flex-col justify-start">
        {getRoute()}
      </div>

      {/* Footer details */}
      <Footer />
    </div>
  );
};
export default App;
