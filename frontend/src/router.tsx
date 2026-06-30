import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Feature Page Imports
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <LandingPage />,
      },
      {
        path: 'app',
        element: <HomePage />,
      },
      {
        path: 'create',
        element: <CreatePage />,
      },
      {
        path: 'created/:code',
        element: <SuccessPage />,
      },
      {
        path: 'join',
        element: <JoinPage />,
      },
      {
        path: 'view/:code',
        element: <ViewPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'features',
        element: <FeaturesPage />,
      },
      {
        path: 'security',
        element: <SecurityPage />,
      },
      {
        path: 'faq',
        element: <FAQPage />,
      },
      {
        path: 'feedback',
        element: <FeedbackPage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
