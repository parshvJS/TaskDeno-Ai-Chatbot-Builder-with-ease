import React from 'react';

interface StatusTagProps {
    status: 'pending' | 'processing' | 'failed' | 'processed';
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-200 text-white'; // Yellow for pending
            case 'processing':
                return 'bg-blue-200 text-white'; // Blue for processing
            case 'failed':
                return 'bg-red-200 text-white'; // Red for failed
            case 'completed':
                return 'bg-green-200 text-white'; // Green for processed
            default:
                return 'bg-gray-200 text-white'; // Default color for unknown status
        }
    };

    return (
        <span className={`px-2 py-1 rounded text-black text-12 ${getStatusColor(status)}`}>
            {status.toUpperCase()}
        </span>
    );
};

export default StatusTag;
