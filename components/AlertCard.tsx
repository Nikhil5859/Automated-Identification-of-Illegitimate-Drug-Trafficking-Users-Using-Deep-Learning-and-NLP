
import React, { useState } from 'react';
import { HighRiskAlert, RiskLevel } from '../types';
import { TelegramIcon, WhatsAppIcon, InstagramIcon } from './icons/PlatformIcons';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { QuoteIcon } from './icons/QuoteIcon';
import { ImageIcon } from './icons/ImageIcon';
import { TextIcon } from './icons/TextIcon';

const platformIcons: Record<string, React.ReactNode> = {
  Telegram: <TelegramIcon />,
  WhatsApp: <WhatsAppIcon />,
  Instagram: <InstagramIcon />,
};

const riskLevelClasses: Record<RiskLevel, { container: string; text: string; border: string }> = {
    [RiskLevel.High]: { container: 'bg-red-900/20 hover:bg-red-900/30', text: 'text-red-400', border: 'border-red-500/50' },
    [RiskLevel.Medium]: { container: 'bg-orange-900/20 hover:bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-500/50' },
    [RiskLevel.Low]: { container: 'bg-green-900/20 hover:bg-green-900/30', text: 'text-green-400', border: 'border-green-500/50' },
    [RiskLevel.Unknown]: { container: 'bg-gray-700/20 hover:bg-gray-700/30', text: 'text-gray-400', border: 'border-gray-500/50' },
};

export const AlertCard: React.FC<{ alert: HighRiskAlert }> = ({ alert }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { user, result } = alert;
    const riskClasses = riskLevelClasses[result.riskLevel];

    return (
        <div className={`rounded-lg border transition-all duration-300 ${riskClasses.border} ${riskClasses.container}`}>
            <div className="p-4 cursor-pointer flex items-center justify-between" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center space-x-4 flex-1">
                    <img src={user.profilePicUrl} alt={user.name} className="w-12 h-12 rounded-full border-2 border-red-400/50"/>
                    <div className="flex-1">
                        <p className="font-bold text-white text-lg">{user.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <span>{user.username}</span>
                            <span className="text-gray-600">&bull;</span>
                            <div className="flex items-center space-x-1">
                                {platformIcons[user.platform]}
                                <span>{user.platform}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-sm font-bold rounded-full border ${riskClasses.border} ${riskClasses.text} bg-gray-900/50`}>
                        {result.riskScore} / 100
                    </span>
                    <ChevronDownIcon isExpanded={isExpanded} />
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 pt-4 border-t border-red-500/20 space-y-4 animate-fade-in-down">
                    
                    {/* User Content Preview */}
                    <div className="bg-black/20 rounded-lg p-3 border border-red-500/10">
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Flagged Activity</h4>
                        <div className="space-y-4">
                            {user.posts.map(post => (
                                <div key={post.id} className="space-y-2">
                                    <p className="text-xs text-gray-300 italic">"{post.text}"</p>
                                    {post.imageUrl && (
                                        <img src={post.imageUrl} className="w-full h-40 object-cover rounded border border-gray-800" alt="Flagged media" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center">
                            <QuoteIcon /> <span className="ml-1">Classifier Rationale</span>
                        </h4>
                        <p className="text-gray-300 text-sm italic leading-relaxed">"{result.summary}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-900/50 rounded-lg border border-purple-500/10">
                            <h4 className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"><ImageIcon /><span className="ml-2">Visual Assessment (CNN)</span></h4>
                             <p className="text-sm text-gray-300"><span className="font-semibold text-purple-300">{result.visualAnalysis.classification}</span> ({result.visualAnalysis.score}/100)</p>
                             {result.visualAnalysis.detectedItems.length > 0 && (
                                 <p className="text-xs text-gray-500 mt-1 italic">Detected: {result.visualAnalysis.detectedItems.join(', ')}</p>
                             )}
                        </div>
                        <div className="p-3 bg-gray-900/50 rounded-lg border border-cyan-500/10">
                            <h4 className="flex items-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"><TextIcon /><span className="ml-2">Contextual Analysis (NLP)</span></h4>
                             <p className="text-sm text-gray-300"><span className="font-semibold text-cyan-300">{result.textAnalysis.intent} Intent</span> ({result.textAnalysis.score}/100)</p>
                              {result.textAnalysis.flaggedKeywords.length > 0 && (
                                 <p className="text-xs text-gray-500 mt-1 italic">Keywords: {result.textAnalysis.flaggedKeywords.join(', ')}</p>
                             )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fade-in-down {
                    0% {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};
