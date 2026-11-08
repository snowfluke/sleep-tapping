import React from 'react';
import { PlayCircle, Sliders, CalendarCheck, BookOpen, LucideIcon } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomTabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isPlaying: boolean;
}

const TABS: { id: ActiveTab; label: string; icon: LucideIcon }[] = [
  { id: 'session', label: 'Session', icon: PlayCircle },
  { id: 'customize', label: 'Settings', icon: Sliders },
  { id: 'challenge', label: '5 nights', icon: CalendarCheck },
  { id: 'science', label: 'Science', icon: BookOpen },
];

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange, isPlaying }) => {
  return (
    <nav
      className="z-40 w-full border-t border-line bg-night-0 tall:fixed tall:inset-x-0 tall:bottom-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-4 items-center px-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                isActive ? 'text-ink-1' : 'text-ink-3 hover:text-ink-2'
              }`}
            >
              <span className="relative">
                <Icon className={`size-5 ${isActive ? 'text-ember' : ''}`} strokeWidth={1.5} />
                {id === 'session' && isPlaying && (
                  <span className="absolute -right-1 -top-0.5 size-1.5 rounded-full bg-ember" aria-hidden="true" />
                )}
              </span>
              <span className="max-w-full truncate text-xs">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
