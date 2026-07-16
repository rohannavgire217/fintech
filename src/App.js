import { useState } from 'react';
import './App.css';
import PageWrapper from './components/layout/Pagewrapper';
import Dashboard from './pages/Dashboard';
import Investments from './pages/investment';
import Planning from './pages/planning';
import Settings from './pages/setting';
import LoginPage from './pages/login';
import { useAuth } from './hooks/UseAuth';
import { setFinanceState } from './store/useFinanceStore';

const pageConfig = {
  dashboard: {
    title: 'Good afternoon, your capital is working.',
    subtitle: 'Net worth, cash flow, and portfolio movement in one control room.',
    component: Dashboard,
  },
  investments: {
    title: 'Investment command center',
    subtitle: 'Track allocation, performance, and conviction across every sleeve.',
    component: Investments,
  },
  planning: {
    title: 'Planning and goals',
    subtitle: 'Budget, runway, taxes, and milestone planning in one place.',
    component: Planning,
  },
  settings: {
    title: 'Settings and profile',
    subtitle: 'Account security, preferences, and workspace controls.',
    component: Settings,
  },
};

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const ActivePage = pageConfig[activePage].component;

  const handleNavigate = (pageKey) => {
    setActivePage(pageKey);
    setIsSidebarOpen(false);
  };

  const handleLogin = (credentials = {}) => {
    setFinanceState((currentState) => ({
      ...currentState,
      isAuthenticated: true,
      profile: {
        ...currentState.profile,
        name: credentials.name || currentState.profile?.name,
        email: credentials.email || currentState.profile?.email,
        team: credentials.team || currentState.profile?.team,
        initials: credentials.initials || currentState.profile?.initials,
      },
    }));
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <PageWrapper
      activePage={activePage}
      onNavigate={handleNavigate}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={() => setIsSidebarOpen((currentValue) => !currentValue)}
      onCloseSidebar={() => setIsSidebarOpen(false)}
      title={pageConfig[activePage].title}
      subtitle={pageConfig[activePage].subtitle}
    >
      <div key={activePage} className="page-transition">
        <ActivePage onNavigate={handleNavigate} />
      </div>
    </PageWrapper>
  );
}

export default App;
