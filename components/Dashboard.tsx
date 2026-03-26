
import React, { useState } from 'react';
import { SIMULATED_USERS } from '../constants';
import { UserCard } from './UserCard';
import { User, AnalysisResult, SocialPlatform, RiskLevel } from '../types';
import { AddUserModal } from './AddUserModal';
import { PlusIcon } from './icons/PlusIcon';
import { ManualAnalysisForm } from './ManualAnalysisForm';

const CUSTOM_USERS_KEY = 'sentry_custom_users';

function loadCustomUsers(): User[] {
  try {
    const saved = localStorage.getItem(CUSTOM_USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCustomUsers(users: User[]) {
  try {
    localStorage.setItem(CUSTOM_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Could not save profiles (storage quota exceeded):', e);
  }
}


interface DashboardProps {
  onHighRiskDetected: (user: User, result: AnalysisResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onHighRiskDetected }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const custom = loadCustomUsers();
    return [...custom, ...SIMULATED_USERS];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'All'>('All');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All');
  const [analysisResults, setAnalysisResults] = useState<Record<number, AnalysisResult>>({});


  const handleAddUser = (newUser: User) => {
    setUsers(prevUsers => {
      const updated = [newUser, ...prevUsers];
      // Only persist custom (non-simulated) users
      const customOnly = updated.filter(u => !SIMULATED_USERS.some(s => s.id === u.id));
      saveCustomUsers(customOnly);
      return updated;
    });
    setIsModalOpen(false);
  };
  
  const handleAnalysisUpdate = (userId: number, result: AnalysisResult) => {
    setAnalysisResults(prev => ({ ...prev, [userId]: result }));
    if (result.riskLevel === RiskLevel.High || result.riskLevel === RiskLevel.Medium) {
        const user = users.find(u => u.id === userId);
        if (user) {
            onHighRiskDetected(user, result);
        }
    }
  };

  const filteredUsers = users.filter(user => {
    const platformMatch = platformFilter === 'All' || user.platform === platformFilter;
    if (!platformMatch) return false;

    if (riskFilter === 'All') return true;

    const userResult = analysisResults[user.id];
    if (!userResult) return false;

    return userResult.riskLevel === riskFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div>
            <h2 className="text-xl font-semibold text-indigo-300">Analysis Dashboard</h2>
            <p className="text-gray-400 mt-1">
                Analyze simulated profiles or add new custom profiles for risk assessment.
            </p>
        </div>
        <div className="flex items-center space-x-2">
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-colors"
            >
                <PlusIcon />
                <span className="ml-2 hidden sm:inline">Add New Profile</span>
            </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-indigo-300 mb-4">Manual Content Analysis</h3>
        <ManualAnalysisForm onHighRiskDetected={onHighRiskDetected} />
      </div>
      
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex-1 w-full">
          <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Platform</label>
          <select 
            id="platform-filter"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as SocialPlatform | 'All')}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="All">All Platforms</option>
            {Object.values(SocialPlatform).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="flex-1 w-full">
          <label htmlFor="risk-filter" className="block text-sm font-medium text-gray-400 mb-1">Filter by Risk Level</label>
          <select 
            id="risk-filter"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'All')}
            className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="All">All Risk Levels</option>
            {Object.values(RiskLevel).filter(r => r !== RiskLevel.Unknown).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>


      <div>
        <h3 className="text-lg font-semibold text-indigo-300 mb-4">User Profiles ({filteredUsers.length})</h3>
        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onAnalysisUpdate={handleAnalysisUpdate} />
              ))}
          </div>
        ) : (
           <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-lg">
              <h3 className="mt-2 text-lg font-medium text-gray-300">No Profiles Match Filters</h3>
              <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your platform or risk level filters. Note that risk filtering only applies to analyzed profiles.
              </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <AddUserModal
            onClose={() => setIsModalOpen(false)}
            onAddUser={handleAddUser}
        />
      )}

    </div>
  );
};
