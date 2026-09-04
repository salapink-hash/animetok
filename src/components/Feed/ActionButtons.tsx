'use client';

import React from 'react';
import { AnimeClip } from '../../types/clip';

interface ActionButtonsProps {
  clip: AnimeClip;
  isPlaying: boolean;
  onLikeToggle: () => void;
  onSaveToggle: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  onFollowToggle: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  clip,
  isPlaying,
  onLikeToggle,
  onSaveToggle,
  onOpenComments,
  onOpenShare,
  onFollowToggle,
}) => {
  // Format numbers to K / M format
  const formatCount = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <aside className="action-bar">
      {/* Author Avatar with Follow Badge */}
      <div className="author-avatar-btn">
        <img
          src={clip.author.avatar}
          alt={clip.author.name}
          className="author-avatar-img"
        />
        {!clip.author.isFollowing && (
          <button 
            className="avatar-plus-badge" 
            onClick={(e) => {
              e.stopPropagation();
              onFollowToggle();
            }}
            title="Follow Creator"
          >
            +
          </button>
        )}
      </div>

      {/* Like Button */}
      <button 
        className="action-btn-item" 
        onClick={(e) => {
          e.stopPropagation();
          onLikeToggle();
        }}
      >
        <div className={`action-icon-circle ${clip.isLiked ? 'liked-heart' : ''}`}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill={clip.isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <span className="action-count">{formatCount(clip.stats.likes)}</span>
      </button>

      {/* Comment Button */}
      <button 
        className="action-btn-item" 
        onClick={(e) => {
          e.stopPropagation();
          onOpenComments();
        }}
      >
        <div className="action-icon-circle">
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </div>
        <span className="action-count">{formatCount(clip.stats.comments)}</span>
      </button>

      {/* Bookmark / Save Button */}
      <button 
        className="action-btn-item" 
        onClick={(e) => {
          e.stopPropagation();
          onSaveToggle();
        }}
      >
        <div className={`action-icon-circle ${clip.isSaved ? 'saved-star' : ''}`}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill={clip.isSaved ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </div>
        <span className="action-count">{formatCount(clip.stats.saves)}</span>
      </button>

      {/* Share Button */}
      <button 
        className="action-btn-item" 
        onClick={(e) => {
          e.stopPropagation();
          onOpenShare();
        }}
      >
        <div className="action-icon-circle">
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </div>
        <span className="action-count">{formatCount(clip.stats.shares)}</span>
      </button>

      {/* Vinyl Disc Animation */}
      <div 
        className={`vinyl-disc ${!isPlaying ? 'paused' : ''}`}
        title={`Audio: ${clip.music.title}`}
      >
        <img
          src={clip.music.coverUrl || clip.author.avatar}
          alt="Sound track"
          className="vinyl-center"
        />
      </div>
    </aside>
  );
};
