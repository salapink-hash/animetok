'use client';

import React from 'react';
import Link from 'next/link';

interface BottomNavProps {
  currentTab: 'home' | 'explore' | 'inbox' | 'profile';
  onTabChange: (tab: 'home' | 'explore' | 'inbox' | 'profile') => void;
  onOpenUpload: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenUpload,
}) => {
  return (
    <nav className="bottom-nav">
      {/* Home (Feed) */}
      <button
        className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={currentTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Beranda</span>
      </button>

      {/* Explore */}
      <button
        className={`bottom-nav-item ${currentTab === 'explore' ? 'active' : ''}`}
        onClick={() => onTabChange('explore')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <span>Temukan</span>
      </button>

      {/* Upload Special Button */}
      <button 
        className="upload-btn-special" 
        onClick={onOpenUpload}
        title="Upload Klip Baru"
      >
        <div className="upload-btn-inner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </button>

      {/* Inbox / Activity */}
      <button
        className={`bottom-nav-item ${currentTab === 'inbox' ? 'active' : ''}`}
        onClick={() => onTabChange('inbox')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={currentTab === 'inbox' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Kotak Masuk</span>
      </button>

      {/* Profile */}
      <button
        className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={currentTab === 'profile' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profil</span>
      </button>
    </nav>
  );
};
