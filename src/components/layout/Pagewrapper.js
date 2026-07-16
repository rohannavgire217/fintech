import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageWrapper = ({ activePage, onNavigate, isSidebarOpen, onToggleSidebar, onCloseSidebar, title, subtitle, children }) => {
  return (
    <div className="app-shell">
      <button
        type="button"
        className={`sidebar-backdrop${isSidebarOpen ? ' sidebar-backdrop--open' : ''}`}
        aria-label="Close navigation"
        onClick={onCloseSidebar}
      />
      <Sidebar activePage={activePage} onNavigate={onNavigate} isOpen={isSidebarOpen} onClose={onCloseSidebar} />
      <main className="app-main">
        <Navbar title={title} subtitle={subtitle} onToggleSidebar={onToggleSidebar} isSidebarOpen={isSidebarOpen} />
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default PageWrapper;