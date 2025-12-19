import React from 'react';
import { Layout, Music, Swords, BarChart2 } from 'lucide-react';

interface MobileNavProps {
    activeTab: 'studio' | 'library' | 'battle' | 'analytics';
    onTabChange: (tab: 'studio' | 'library' | 'battle' | 'analytics') => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 pb-safe z-50">
            <div className="flex justify-around items-center h-16" role="tablist">
                <button
                    onClick={() => onTabChange('library')}
                    aria-label="Library Tab"
                    aria-selected={activeTab === 'library'}
                    role="tab"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none focus:bg-gray-800 ${activeTab === 'library' ? 'text-purple-500' : 'text-gray-400'}`}
                >
                    <Music size={20} />
                    <span className="text-[10px] font-medium">Library</span>
                </button>

                <button
                    onClick={() => onTabChange('studio')}
                    aria-label="Studio Tab"
                    aria-selected={activeTab === 'studio'}
                    role="tab"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none focus:bg-gray-800 ${activeTab === 'studio' ? 'text-purple-500' : 'text-gray-400'}`}
                >
                    <Layout size={20} />
                    <span className="text-[10px] font-medium">Studio</span>
                </button>

                <button
                    onClick={() => onTabChange('battle')}
                    aria-label="Battle Tab"
                    aria-selected={activeTab === 'battle'}
                    role="tab"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none focus:bg-gray-800 ${activeTab === 'battle' ? 'text-red-500' : 'text-gray-400'}`}
                >
                    <Swords size={20} />
                    <span className="text-[10px] font-medium">Battle</span>
                </button>

                <button
                    onClick={() => onTabChange('analytics')}
                    aria-label="Analytics Tab"
                    aria-selected={activeTab === 'analytics'}
                    role="tab"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 focus:outline-none focus:bg-gray-800 ${activeTab === 'analytics' ? 'text-purple-500' : 'text-gray-400'}`}
                >
                    <BarChart2 size={20} />
                    <span className="text-[10px] font-medium">AI Feed</span>
                </button>
            </div>
        </div>
    );
};

export default MobileNav;
