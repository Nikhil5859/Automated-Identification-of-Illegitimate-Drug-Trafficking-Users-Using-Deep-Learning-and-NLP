
import React, { useState } from 'react';
import { User, AnalysisResult, RiskLevel } from '../types';
import { analyzeUserProfile } from '../services/localAnalysisService';
import { generatePdfReport } from '../utils/pdfGenerator';
import {
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
} from './icons/PlatformIcons';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PdfIcon } from './icons/PdfIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { ImageIcon } from './icons/ImageIcon';
import { TextIcon } from './icons/TextIcon';
import { BrainIcon } from './icons/BrainIcon';

interface UserCardProps {
  user: User;
  onAnalysisUpdate: (userId: number, result: AnalysisResult) => void;
}

const platformIcons: Record<string, React.ReactNode> = {
  Telegram: <TelegramIcon />,
  WhatsApp: <WhatsAppIcon />,
  Instagram: <InstagramIcon />,
};

const riskLevelClasses: Record<RiskLevel, { container: string; text: string; icon: string; border: string }> = {
    [RiskLevel.High]: { container: 'border-red-500/50 bg-red-500/10', text: 'text-red-400', icon: 'text-red-400', border: 'border-red-500/50' },
    [RiskLevel.Medium]: { container: 'border-orange-500/50 bg-orange-500/10', text: 'text-orange-400', icon: 'text-orange-400', border: 'border-orange-500/50' },
    [RiskLevel.Low]: { container: 'border-green-500/50 bg-green-500/10', text: 'text-green-400', icon: 'text-green-400', border: 'border-green-500/50' },
    [RiskLevel.Unknown]: { container: 'border-gray-500/50 bg-gray-500/10', text: 'text-gray-400', icon: 'text-gray-400', border: 'border-gray-500/50' },
};

export const UserCard: React.FC<UserCardProps> = ({ user, onAnalysisUpdate }) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeUserProfile(user);
      setAnalysisResult(result);
      onAnalysisUpdate(user.id, result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (analysisResult) {
      generatePdfReport(user, analysisResult);
    }
  };

  const riskClasses = analysisResult ? riskLevelClasses[analysisResult.riskLevel] : riskLevelClasses[RiskLevel.Unknown];

  return (
    <div className={`rounded-xl border transition-all duration-300 flex flex-col h-full ${analysisResult ? riskClasses.container : 'bg-gray-800 border-gray-700 hover:border-indigo-500/50 shadow-lg overflow-hidden'}`}>
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={user.profilePicUrl} alt={user.name} className="w-14 h-14 rounded-full border-2 border-gray-700 object-cover" />
              <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700">
                {platformIcons[user.platform]}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">{user.name}</h4>
              <p className="text-sm text-gray-400">{user.username}</p>
            </div>
          </div>
          {analysisResult && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${riskClasses.border} ${riskClasses.text} bg-gray-900/50`}>
              {analysisResult.riskLevel} Risk
            </div>
          )}
        </div>

        {/* Post Content Preview Section */}
        <div className="bg-gray-900/40 rounded-lg p-3 border border-gray-700/50 mb-4">
          <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Subject Activity</h5>
          <div className="space-y-3">
            {user.posts.map((post) => (
              <div key={post.id} className="space-y-2">
                <p className="text-xs text-gray-300 line-clamp-2 italic">"{post.text}"</p>
                {post.imageUrl && (
                  <div className="relative group">
                    <img 
                      src={post.imageUrl} 
                      alt="Post" 
                      className="w-full h-24 object-cover rounded border border-gray-700 group-hover:border-indigo-500/50 transition-colors" 
                    />
                    <div className="absolute top-1 right-1 bg-black/60 rounded px-1.5 py-0.5 text-[8px] text-gray-300">
                      IMG DATA
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          {!analysisResult && !isLoading && !error && (
            <button onClick={handleAnalyze} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center">
              <BrainIcon /> <span className="ml-2">Analyze (Local Ensemble)</span>
            </button>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-4 text-indigo-400">
              <SpinnerIcon />
              <p className="mt-2 text-sm font-medium animate-pulse">Running Random Forest Classifier...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-center text-red-400 text-sm">
              <AlertTriangleIcon /> <span className="ml-2">{error}</span>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 animate-fade-in">
              <div className="border-t border-gray-700/50 pt-3">
                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Ensemble Summary</h5>
                <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-indigo-500/30 pl-3">
                    "{analysisResult.summary}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    <ImageIcon /> <span className="ml-1">Visual Score</span>
                  </div>
                  <div className="text-lg font-mono text-white">{analysisResult.visualAnalysis.score}</div>
                </div>
                <div className="p-2 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    <TextIcon /> <span className="ml-1">TF-IDF Score</span>
                  </div>
                  <div className="text-lg font-mono text-white">{analysisResult.textAnalysis.score}</div>
                </div>
              </div>

              <button onClick={handleDownloadReport} className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center">
                <PdfIcon /> <span className="ml-2">Download Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
