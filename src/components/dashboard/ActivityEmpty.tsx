import { Activity } from 'lucide-react';

export function ActivityEmpty() {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-white rounded-lg border">
            <Activity className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-sm text-gray-500 max-w-sm">
                When workflows run, their activity will appear here.
            </p>
        </div>
    );
} 