'use client';

import React, { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  clipTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  clipTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    { name: 'WhatsApp', color: '#25D366', icon: '💬' },
    { name: 'X / Twitter', color: '#1DA1F2', icon: '🐦' },
    { name: 'Telegram', color: '#0088cc', icon: '✈️' },
    { name: 'Facebook', color: '#1877F2', icon: '📘' },
  ];

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="comment-drawer" style={{ height: 'auto', maxHeight: '50%' }}>
        <div className="drawer-header">
          <span className="drawer-title">Bagikan Klip</span>
          <button className="drawer-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Social Share */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {shareOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={() => alert(`Membuka sharing ke ${opt.name}...`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: opt.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  {opt.icon}
                </div>
                <span>{opt.name}</span>
              </button>
            ))}
          </div>

          {/* Copy Link Field */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.08)',
              padding: '8px 12px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : 'https://animetok.app'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '12px',
                flex: 1,
                outline: 'none',
              }}
            />
            <button
              onClick={handleCopyLink}
              style={{
                background: copied ? '#10B981' : 'var(--primary-pink)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.2s',
              }}
            >
              {copied ? 'Tersalin! ✓' : 'Salin Tautan'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
