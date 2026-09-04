'use client';

import React, { useState } from 'react';
import { AnimeClip } from '../../types/clip';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newClip: AnimeClip) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [animeTitle, setAnimeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('#anime #fyp #edit');
  const [soundTitle, setSoundTitle] = useState('Original Anime Sound');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !videoUrl) {
      alert('Mohon isi judul dan link video URL!');
      return;
    }

    const newClip: AnimeClip = {
      id: `clip-${Date.now()}`,
      title,
      animeTitle: animeTitle || 'Anime Clip',
      description,
      tags: tags.split(' ').filter((t) => t.startsWith('#')),
      videoUrl,
      author: {
        name: 'You (Creator)',
        username: 'my_animetok',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=mycreator',
        isVerified: true,
        isFollowing: false,
      },
      music: {
        title: soundTitle,
        author: 'Original Audio',
      },
      stats: {
        likes: 1,
        comments: 0,
        saves: 0,
        shares: 0,
      },
      isLiked: true,
      isSaved: false,
    };

    onUploadSuccess(newClip);
    onClose();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div 
        className="comment-drawer" 
        style={{ 
          height: 'auto', 
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="drawer-header">
          <span className="drawer-title">Unggah Klip Video Anime</span>
          <button className="drawer-close-btn" onClick={onClose}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form 
          onSubmit={handleSubmit} 
          style={{ 
            padding: '16px 16px 40px', 
            overflowY: 'auto', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '14px',
            flex: 1 
          }}
        >
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Judul Klip *
            </label>
            <input
              type="text"
              required
              className="comment-input"
              style={{ width: '100%', borderRadius: '10px' }}
              placeholder="Contoh: Sukuna Domain Expansion 4K"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Nama Anime
            </label>
            <input
              type="text"
              className="comment-input"
              style={{ width: '100%', borderRadius: '10px' }}
              placeholder="Contoh: Jujutsu Kaisen / One Piece"
              value={animeTitle}
              onChange={(e) => setAnimeTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Direct Video MP4 URL *
            </label>
            <input
              type="url"
              required
              className="comment-input"
              style={{ width: '100%', borderRadius: '10px' }}
              placeholder="https://.../video.mp4"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Deskripsi & Caption
            </label>
            <textarea
              className="comment-input"
              style={{ width: '100%', borderRadius: '10px', minHeight: '60px', resize: 'vertical' }}
              placeholder="Tuliskan caption menarik untuk penonton kamu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Tagar (#hashtag)
            </label>
            <input
              type="text"
              className="comment-input"
              style={{ width: '100%', borderRadius: '10px' }}
              placeholder="#anime #fyp #epicmoment"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>
              Judul Musik / Audio
            </label>
            <input
              type="text"
              className="comment-input"
              style={{ width: '100%', borderRadius: '10px' }}
              placeholder="Contoh: SPECIALZ - King Gnu"
              value={soundTitle}
              onChange={(e) => setSoundTitle(e.target.value)}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg, var(--secondary-cyan) 0%, var(--primary-pink) 100%)',
              color: '#fff',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '15px',
              marginTop: '10px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(254,44,85,0.4)',
              cursor: 'pointer'
            }}
          >
            🚀 Publikasikan Klip
          </button>
        </form>
      </div>
    </>
  );
};
