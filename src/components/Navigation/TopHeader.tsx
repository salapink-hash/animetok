'use client';

import React from 'react';

interface TopHeaderProps {
  activeTab: 'local' | 'foryou' | 'following';
  onTabChange: (tab: 'local' | 'foryou' | 'following') => void;
  onSearchClick: () => void;
  localVideoCount: number;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  onTabChange,
  onSearchClick,
  localVideoCount,
}) => {
  return (
    <header className="top-nav">
      {/* Offline Mode Indicator / Tag */}
      <button 
        className="top-icon-btn" 
        title="Mode Video Lokal (Hemat Kuota)"
        onClick={() => onTabChange('local')}
        style={{
          background: activeTab === 'local' ? 'rgba(37, 244, 238, 0.25)' : 'rgba(0, 0, 0, 0.35)',
          borderColor: activeTab === 'local' ? 'var(--secondary-cyan)' : 'rgba(255, 255, 255, 0.15)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'local' ? 'var(--secondary-cyan)' : '#fff'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Tabs */}
      <div className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'local' ? 'active' : ''}`}
          onClick={() => onTabChange('local')}
          style={{ color: activeTab === 'local' ? 'var(--secondary-cyan)' : undefined }}
        >
          Lokal HP {localVideoCount > 0 && `(${localVideoCount})`}
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'foryou' ? 'active' : ''}`}
          onClick={() => onTabChange('foryou')}
        >
          FYP Online
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => onTabChange('following')}
        >
          Mengikuti
        </button>
      </div>

      {/* Search Icon */}
      <button 
        className="top-icon-btn" 
        title="Cari Klip Anime & Sound"
        onClick={onSearchClick}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </header>
  );
};
