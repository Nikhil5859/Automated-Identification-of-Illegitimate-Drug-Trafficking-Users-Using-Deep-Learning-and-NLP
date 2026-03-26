
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel, SocialPlatform, User } from '../types';
import { analyzeCustomContent } from '../services/localAnalysisService';
import { generatePdfReport } from '../utils/pdfGenerator';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { PdfIcon } from './icons/PdfIcon';
import { UploadIcon } from './icons/UploadIcon';
import { ImageIcon } from './icons/ImageIcon';
import { TextIcon } from './icons/TextIcon';
import { FusionIcon } from './icons/FusionIcon';

const riskLevelClasses: Record<RiskLevel, string> = {
  [RiskLevel.High]: 'bg-red-500/20 text-red-400 border-red-500/50',
  [RiskLevel.Medium]: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
  [RiskLevel.Low]: 'bg-green-500/20 text-green-400 border-green-500/50',
  [RiskLevel.Unknown]: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
};

interface ManualAnalysisFormProps {
    onHighRiskDetected: (user: User, result: AnalysisResult) => void;
}

export const ManualAnalysisForm: React.FC<ManualAnalysisFormProps> = ({ onHighRiskDetected }) => {
    const [inputText, setInputText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.Instagram);
    
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!inputText.trim() && !imageFile) {
            setError('Please provide text or an image to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const result = await analyzeCustomContent(inputText, platform, imageFile ?? undefined);
            setAnalysisResult(result);

            if (result.riskLevel === RiskLevel.High || result.riskLevel === RiskLevel.Medium) {
                const tempUser: User = {
                    id: Date.now(),
                    name: 'Manual Scan',
                    username: `@${platform.toLowerCase()}_user`,
                    platform: platform,
                    profilePicUrl: 'https://i.pravatar.cc/100?u=manual',
                    posts: [{
                        id: 1,
                        text: inputText,
                        imageUrl: imagePreview || undefined,
                        timestamp: new Date().toLocaleTimeString(),
                    }]
                };
                onHighRiskDetected(tempUser, result);
            }
        } catch (err: any) {
            setError(err.message || 'Analysis failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadReport = () => {
        if (analysisResult) {
            const tempUser: User = {
                id: Date.now(),
                name: 'Manual Scan',
                username: `@${platform.toLowerCase()}_user`,
                platform: platform,
                profilePicUrl: 'https://i.pravatar.cc/100?u=manual',
                posts: [{
                    id: 1,
                    text: inputText,
                    imageUrl: imagePreview || undefined,
                    timestamp: new Date().toLocaleTimeString(),
                }]
            };
            generatePdfReport(tempUser, analysisResult);
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste suspected social media text here..."
                        className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <div className="flex items-center space-x-4">
                        <label className="flex-1">
                            <span className="text-xs text-gray-500 uppercase font-bold">Platform Context</span>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
                                className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-sm focus:ring-indigo-500"
                            >
                                {Object.values(SocialPlatform).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </label>
                        <label className="flex-1 mt-5">
                            <span className="px-4 py-2 border border-gray-600 rounded-md cursor-pointer hover:bg-gray-700 transition flex items-center justify-center text-sm">
                                <UploadIcon /> <span className="ml-2">Add Image</span>
                            </span>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                    </div>
                    {imagePreview && (
                        <div className="mt-2 relative">
                           <img src={imagePreview} alt="Preview" className="rounded-md max-h-40 border border-gray-600" />
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-900/50 rounded-lg flex flex-col justify-center border border-gray-700/50 min-h-[200px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center text-indigo-400">
                            <SpinnerIcon />
                            <p className="mt-2 text-xs font-bold animate-pulse">Running TF-IDF & CNN...</p>
                        </div>
                    ) : analysisResult ? (
                       <div className="space-y-3 animate-fade-in">
                           <div className={`p-3 rounded-lg border flex items-center justify-between ${riskLevelClasses[analysisResult.riskLevel]}`}>
                                <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest">Final Risk Assessment</h5>
                                    <p className="text-xl font-bold">{analysisResult.riskLevel} ({analysisResult.riskScore}/100)</p>
                                </div>
                                <FusionIcon />
                           </div>
                           <p className="text-xs text-gray-400 italic">"{analysisResult.summary}"</p>
                           <div className="grid grid-cols-2 gap-2">
                               <div className="p-3 bg-gray-900 border border-purple-500/20 rounded">
                                   <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Visual Score</span>
                                   <p className="font-mono text-2xl font-bold text-purple-400">{analysisResult.visualAnalysis.score}<span className="text-sm text-gray-600 ml-1">/100</span></p>
                               </div>
                               <div className="p-3 bg-gray-900 border border-cyan-500/20 rounded">
                                   <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">TF-IDF Score</span>
                                   <p className="font-mono text-2xl font-bold text-cyan-400">{analysisResult.textAnalysis.score}<span className="text-sm text-gray-600 ml-1">/100</span></p>
                               </div>
                           </div>
                        </div>
                    ) : error ? (
                        <p className="text-red-400 text-center text-sm">{error}</p>
                    ) : (
                        <p className="text-center text-gray-600 text-sm">Ready for custom analysis</p>
                    )}
                </div>
            </div>

            <div className="px-4 py-3 bg-gray-800/80 border-t border-gray-700 flex items-center space-x-3">
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-md disabled:bg-gray-600 transition-colors"
                    >
                    {isLoading ? 'Processing...' : 'Start Manual Scan'}
                </button>
                <button
                    onClick={handleDownloadReport}
                    disabled={!analysisResult || isLoading}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md disabled:opacity-30"
                    >
                    <PdfIcon />
                </button>
            </div>
        </div>
    );
};
