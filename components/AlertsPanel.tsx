import React from 'react';
import { HighRiskAlert } from '../types';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { AlertCard } from './AlertCard';

interface AlertsPanelProps {
  alerts: HighRiskAlert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const sortedAlerts = [...alerts].sort((a, b) => b.result.riskScore - a.result.riskScore);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-orange-500/30 rounded-lg p-4">
        <div className="mb-2">
          <h2 className="text-2xl font-semibold text-orange-400 mb-2 flex items-center">
            <AlertTriangleIcon />
            <span className="ml-3">Risk Alerts</span>
          </h2>
          <p className="text-gray-400">
            The following profiles have been flagged as Medium or High risk by the AI analysis. Review each profile for further action.
          </p>
        </div>
      </div>

      {sortedAlerts.length > 0 ? (
        <div className="space-y-4">
          {sortedAlerts.map((alert) => (
            <AlertCard key={alert.user.id} alert={alert} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-lg">
          <div className="mx-auto h-12 w-12 text-gray-500">
            <AlertTriangleIcon />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-300">No Risk Alerts</h3>
          <p className="mt-1 text-sm text-gray-500">
            No profiles have been flagged as Medium or High risk.
          </p>
        </div>
      )}
    </div>
  );
};