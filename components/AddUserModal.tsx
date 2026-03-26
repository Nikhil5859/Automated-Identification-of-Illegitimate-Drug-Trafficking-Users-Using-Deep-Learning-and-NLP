import React, { useState, useCallback } from 'react';
import { SocialPlatform, User } from '../types';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface AddUserModalProps {
    onClose: () => void;
    onAddUser: (user: User) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddUser }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [platform, setPlatform] = useState<SocialPlatform>(SocialPlatform.Instagram);
    const [postText, setPostText] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleMediaChange = (file: File | null) => {
        if (mediaPreview) {
            URL.revokeObjectURL(mediaPreview);
        }

        if (file) {
            setMediaFile(file);
            const url = URL.createObjectURL(file);
            setMediaPreview(url);
            setMediaType(file.type.startsWith('video') ? 'video' : 'image');
        } else {
            setMediaFile(null);
            setMediaPreview(null);
            setMediaType(null);
        }
    };
    
    const onDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files && files[0]) {
            handleMediaChange(files[0]);
        }
    }, []);

    const onDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleSubmit = async () => {
        if (!name.trim() || !username.trim() || !postText.trim()) {
            setError('Please fill out Name, Username, and Post Text fields.');
            return;
        }
        setError(null);

        let persistedImageUrl: string | undefined = undefined;
        let persistedVideoUrl: string | undefined = undefined;

        if (mediaFile) {
            try {
                const base64 = await fileToBase64(mediaFile);
                if (mediaType === 'image') persistedImageUrl = base64;
                else if (mediaType === 'video') persistedVideoUrl = base64;
            } catch {
                setError('Failed to process media file.');
                return;
            }
        }

        const newUser: User = {
            id: Date.now(),
            name,
            username,
            platform,
            profilePicUrl: `https://picsum.photos/seed/${Date.now()}/100/100`,
            posts: [{
                id: Date.now() + 1,
                text: postText,
                imageUrl: persistedImageUrl,
                videoUrl: persistedVideoUrl,
                videoMimeType: mediaType === 'video' ? mediaFile?.type : undefined,
                timestamp: 'Just now',
            }]
        };

        onAddUser(newUser);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Add New Profile for Analysis</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                     {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input id="name" type="text" placeholder="e.g., Alex 'Nitro' Vance" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input id="username" type="text" placeholder="e.g., @nitro_drops" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    
                    <div>
                        <label htmlFor="platform" className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                        <select id="platform" value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform)} className="w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition">
                            {Object.values(SocialPlatform).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="postText" className="block text-sm font-medium text-gray-300 mb-1">Post Text</label>
                        <textarea
                            id="postText"
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="e.g., Weekend forecast: cloudy with a chance of pure snow..."
                            className="w-full h-24 p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Post Media (Optional)</label>
                        {mediaPreview ? (
                             <div className="relative group">
                                {mediaType === 'image' ? (
                                    <img src={mediaPreview} alt="Preview" className="rounded-md w-full max-h-60 object-contain border border-gray-600" />
                                ) : (
                                    <video src={mediaPreview} muted controls className="rounded-md w-full max-h-60 border border-gray-600" />
                                )}
                                <div className="absolute top-2 right-2 flex items-center space-x-2">
                                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">{mediaFile?.name}</span>
                                    <button
                                        onClick={() => handleMediaChange(null)}
                                        className="p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500 transition-colors opacity-50 group-hover:opacity-100"
                                        aria-label="Remove media"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                             </div>
                        ) : (
                            <label onDrop={onDrop} onDragOver={onDragOver} className="w-full flex flex-col items-center justify-center p-6 bg-gray-900 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-indigo-500 hover:bg-gray-800/50 transition">
                                <UploadIcon />
                                <p className="mt-2 text-sm text-gray-400">
                                    <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">Image or Video (e.g., MP4, JPG, PNG)</p>
                                <input type="file" accept="image/*,video/*" onChange={(e) => handleMediaChange(e.target.files?.[0] ?? null)} className="hidden" />
                            </label>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
                        Add Profile
                    </button>
                </div>
            </div>
        </div>
    );
};
