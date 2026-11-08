import React from 'react';
import { PlayCircle, Sliders, CalendarCheck, BookOpen } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isPlaying?: boolean;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  isPlaying,
}) => {
  const tabs = [
    {
      id: 'session' as ActiveTab,
      label: 'Session',
      icon: PlayCircle,
    },
    {
      id: 'customize' as ActiveTab,
      label: 'Sounds & Pace',
      icon: Sliders,
    },
    {
      id: 'challenge' as ActiveTab,
      label: '5 Nights',
      icon: CalendarCheck,
    },
    {
      id: 'science' as ActiveTab,
      label: 'The Science',
      icon: BookOpen,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#070a12]/95 backdrop-blur-md border-t border-slate-800/80 max-w-lg mx-auto"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-4 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors select-none ${
                isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {tab.id === 'session' && isPlaying && (
                  <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 ${
                  isActive ? 'text-indigo-300 font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
