'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimeClip } from '../../types/clip';
import { ActionButtons } from './ActionButtons';

interface VideoCardProps {
  clip: AnimeClip;
  isActive: boolean;
  isNearActive: boolean;
  onLikeToggle: (id: string) => void;
  onSaveToggle: (id: string) => void;
  onFollowToggle: (id: string) => void;
  onOpenComments: (clip: AnimeClip) => void;
  onOpenShare: (clip: AnimeClip) => void;
  onVideoEnded?: () => void;
  isLocalMode?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  clip,
  isActive,
  isNearActive,
  onLikeToggle,
  onSaveToggle,
  onFollowToggle,
  onOpenComments,
  onOpenShare,
  onVideoEnded,
  isLocalMode = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [heartAnimPosition, setHeartAnimPosition] = useState<{ x: number; y: number } | null>(null);

  // Play video with safe error handling
  const safePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsBuffering(false);
        });
    }
  }, []);

  const safePause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  }, []);

  // Handle active status changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      if (video.readyState >= 2) {
        safePlay();
      } else {
        video.load();
        safePlay();
      }
    } else {
      safePause();
    }
  }, [isActive, safePlay, safePause]);

  // When video data is ready to play
  const handleCanPlay = () => {
    setIsBuffering(false);
    if (isActive) {
      safePlay();
    }
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      safePause();
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 800);
    } else {
      safePlay();
      setShowPlayIcon(true);
      setTimeout(() => setShowPlayIcon(false), 800);
    }
  };

  // Double Click / Tap to Like
  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setHeartAnimPosition({ x, y });
    setTimeout(() => setHeartAnimPosition(null), 700);

    if (!clip.isLiked) {
      onLikeToggle(clip.id);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const shouldRenderVideoTag = isLocalMode || isNearActive;

  return (
    <div 
      className="video-slide" 
      data-clip-id={clip.id}
      onClick={togglePlayPause}
      onDoubleClick={handleDoubleClick}
    >
      {/* Video Element (Kept mounted to prevent blank screen on scroll) */}
      {shouldRenderVideoTag ? (
        <video
          ref={videoRef}
          key={clip.id}
          src={clip.videoUrl}
          poster={clip.posterUrl}
          className="video-element"
          loop={!onVideoEnded}
          onEnded={onVideoEnded}
          playsInline
          preload={isActive ? 'auto' : 'metadata'}
          onCanPlay={handleCanPlay}
          onLoadedData={handleCanPlay}
          onWaiting={() => {
            if (isActive) {
              setIsBuffering(true);
              // Fallback to clear buffering state if stuck
              setTimeout(() => {
                setIsBuffering(false);
              }, 2500);
            }
          }}
          onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      ) : (
        <div 
          className="video-element"
          style={{ 
            backgroundImage: clip.posterUrl ? `url(${clip.posterUrl})` : 'linear-gradient(135deg, #12131e 0%, #000 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'black'
          }} 
        />
      )}

      {/* Overlays */}
      <div className="video-gradient-top" />
      <div className="video-gradient-bottom" />

      {/* Play Overlay Button if video is paused while active */}
      {!isPlaying && isActive && !isBuffering && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 14,
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(37, 244, 238, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
          onClick={togglePlayPause}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      )}

      {/* Buffering Spinner */}
      {isBuffering && isActive && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            pointerEvents: 'none',
          }}
        >
          <div 
            style={{
              width: '44px',
              height: '44px',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: 'var(--secondary-cyan)',
              borderRadius: '50%',
              animation: 'spinVinyl 0.8s linear infinite',
            }} 
          />
          <span
            style={{
              fontSize: '11px',
              color: '#fff',
              background: 'rgba(0,0,0,0.6)',
              padding: '4px 10px',
              borderRadius: '12px',
              backdropFilter: 'blur(4px)',
            }}
          >
            Memuat Video...
          </span>
        </div>
      )}

      {/* Local Offline Badge */}
      {isLocalMode && (
        <div
          style={{
            position: 'absolute',
            top: '64px',
            left: '16px',
            background: 'rgba(37, 244, 238, 0.25)',
            border: '1px solid var(--secondary-cyan)',
            backdropFilter: 'blur(8px)',
            color: 'var(--secondary-cyan)',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>📴 100% Offline (Hemat Kuota)</span>
        </div>
      )}

      {/* Play/Pause Icon Animation */}
      {showPlayIcon && (
        <div className="play-pause-overlay">
          {isPlaying ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </div>
      )}

      {/* Double Tap Heart Burst */}
      {heartAnimPosition && (
        <div
          className="double-tap-heart"
          style={{ left: heartAnimPosition.x, top: heartAnimPosition.y }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
      )}

      {/* Bottom Info Overlay */}
      <div className="video-info-overlay" onClick={(e) => e.stopPropagation()}>
        {/* Author Row */}
        <div className="author-row">
          <span className="author-name">@{clip.author.username}</span>
          {clip.author.isVerified && (
            <span className="verified-badge" title="Verified">✓</span>
          )}
          {!isLocalMode && (
            <button
              className={`follow-tag-btn ${clip.author.isFollowing ? 'following' : ''}`}
              onClick={() => onFollowToggle(clip.id)}
            >
              {clip.author.isFollowing ? 'Mengikuti' : 'Ikuti'}
            </button>
          )}
        </div>

        {/* Caption */}
        <p 
          className={`video-caption ${isCaptionExpanded ? 'expanded' : ''}`}
          onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
        >
          <strong>{clip.title}</strong> {clip.description ? `— ${clip.description}` : ''}
        </p>

        {/* Tags */}
        <div className="tags-row">
          {clip.tags.map((tag) => (
            <span key={tag} className="tag-item">{tag}</span>
          ))}
        </div>

        {/* Music Sound Ticker */}
        <div className="sound-marquee">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <div className="marquee-text-wrapper">
            <span className="marquee-text">🎵 {clip.music.title} — {clip.music.author}</span>
          </div>
        </div>
      </div>

      {/* Right Action Bar */}
      <ActionButtons
        clip={clip}
        isPlaying={isPlaying}
        onLikeToggle={() => onLikeToggle(clip.id)}
        onSaveToggle={() => onSaveToggle(clip.id)}
        onOpenComments={() => onOpenComments(clip)}
        onOpenShare={() => onOpenShare(clip)}
        onFollowToggle={() => onFollowToggle(clip.id)}
      />

      {/* Progress Bar */}
      <div className="video-progress-bar">
        <div className="video-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
