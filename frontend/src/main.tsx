import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './hooks/useTheme';
import { App } from './App';

// Stylesheet
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
