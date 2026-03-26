
import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { AlertsPanel } from './components/AlertsPanel';
import { DocumentationView } from './components/DocumentationView';
import { HighRiskAlert, User, AnalysisResult } from './types';
import { DashboardIcon } from './components/icons/DashboardIcon';
import { BellIcon } from './components/icons/BellIcon';
import { DocumentTextIcon } from './components/icons/DocumentTextIcon';
import { LoginPage } from './components/LoginPage';
import { KeyIcon } from './components/icons/KeyIcon';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { ChangePasswordModal } from './components/ChangePasswordModal';

type View = 'dashboard' | 'alerts' | 'documentation';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [highRiskAlerts, setHighRiskAlerts] = useState<HighRiskAlert[]>([]);
  const [unseenAlertsCount, setUnseenAlertsCount] = useState<number>(0);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [appPassword, setAppPassword] = useState<string>(
    () => localStorage.getItem('sentry_password') || 'password'
  );

  const handlePasswordChange = (newPassword: string) => {
    localStorage.setItem('sentry_password', newPassword);
    setAppPassword(newPassword);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setHighRiskAlerts([]);
    setUnseenAlertsCount(0);
    setActiveView('dashboard');
  };

  const addHighRiskAlert = (user: User, result: AnalysisResult) => {
    setHighRiskAlerts((prevAlerts) => {
      const isExistingAlert = prevAlerts.some((alert) => alert.user.id === user.id);
      
      if (isExistingAlert) {
        return prevAlerts.map(alert => alert.user.id === user.id ? { user, result } : alert);
      } else {
        if (result.riskLevel === 'High' || result.riskLevel === 'Medium') {
            setUnseenAlertsCount(prevCount => prevCount + 1);
        }
        return [...prevAlerts, { user, result }];
      }
    });
  };
  
  const NavButton: React.FC<{view: View, label: string, count?: number, icon: React.ReactNode}> = ({ view, label, count, icon }) => {
    const isActive = activeView === view;
    
    const handleClick = () => {
        if (view === 'alerts') {
            setUnseenAlertsCount(0);
        }
        setActiveView(view);
    };

    return (
        <button
          onClick={handleClick}
          className={`relative w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
            isActive
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {icon}
          <span className="ml-3">{label}</span>
          {count !== undefined && count > 0 && (
            <span className="absolute top-1/2 -translate-y-1/2 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </button>
    );
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} currentPassword={appPassword} />;
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-900 text-gray-100 font-sans">
        <aside className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
          <div className="flex items-center space-x-3 mb-8">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <h1 className="text-xl font-bold text-white tracking-tight">Social Sentry AI</h1>
          </div>
          <nav className="flex flex-col space-y-2">
              <NavButton view="dashboard" label="Dashboard" icon={<DashboardIcon />} />
              <NavButton view="alerts" label="Risk Alerts" count={unseenAlertsCount} icon={<BellIcon />} />
              <NavButton view="documentation" label="Methodology" icon={<DocumentTextIcon />} />
          </nav>
          <div className="mt-auto">
            <div className="border-t border-gray-700 pt-4 space-y-2">
                <button
                    onClick={() => setIsChangePasswordModalOpen(true)}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <KeyIcon />
                    <span className="ml-3">Change Password</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    <LogoutIcon />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
             <p className="text-center p-4 text-gray-500 text-xs">
               Social Sentry AI v1.0.1
             </p>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
              {activeView === 'dashboard' && <Dashboard onHighRiskDetected={addHighRiskAlert} />}
              {activeView === 'alerts' && <AlertsPanel alerts={highRiskAlerts} />}
              {activeView === 'documentation' && <DocumentationView />}
          </main>
        </div>
      </div>
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordModalOpen(false)}
          currentPassword={appPassword}
          onPasswordChange={handlePasswordChange}
        />
      )}
    </>
  );
}

export default App;
