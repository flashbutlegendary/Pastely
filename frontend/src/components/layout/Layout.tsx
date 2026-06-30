import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col page-bg select-text">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Pages Content Container */}
      <div className="flex-1 flex flex-col justify-start">
        <Outlet />
      </div>

      {/* Footer details */}
      <Footer />
    </div>
  );
};
