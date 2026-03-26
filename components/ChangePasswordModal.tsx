import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface ChangePasswordModalProps {
    onClose: () => void;
    currentPassword: string;
    onPasswordChange: (newPassword: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, currentPassword, onPasswordChange }) => {
    const [currentPasswordInput, setCurrentPasswordInput] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = () => {
        setError(null);
        setSuccess(null);

        if (currentPasswordInput !== currentPassword) {
            setError('Current password is incorrect.');
            return;
        }

        if (!newPassword || newPassword.length < 6) {
            setError('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        onPasswordChange(newPassword);
        setSuccess('Password changed successfully! You can now log in with your new password.');
        setCurrentPasswordInput('');
        setNewPassword('');
        setConfirmPassword('');

        // Optional: close modal after a delay
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4 transition-opacity"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Change Password</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XIcon />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-md">{error}</p>}
                    {success && <p className="text-green-400 text-sm text-center bg-green-500/10 p-2 rounded-md">{success}</p>}
                    
                    <div>
                        <label htmlFor="current-password"  className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                        <input id="current-password" type="password" value={currentPasswordInput} onChange={(e) => setCurrentPasswordInput(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="new-password"  className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                        <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                        <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                    </div>
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-700 flex justify-end items-center space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};
