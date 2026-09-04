'use client';

import React, { useRef } from 'react';
import { AnimeClip } from '../../types/clip';

interface LocalVideoPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onVideosSelected: (newClips: AnimeClip[]) => void;
  currentCount: number;
}

export const LocalVideoPicker: React.FC<LocalVideoPickerProps> = ({
  isOpen,
  onClose,
  onVideosSelected,
  currentCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFiles = (filesList: FileList | File[]) => {
    const filesArray = Array.from(filesList).filter((file) => 
      file.type.startsWith('video/') || 
      /\.(mp4|webm|mkv|mov|avi|flv|m4v)$/i.test(file.name)
    );

    if (filesArray.length === 0) {
      alert('Tidak ada file video yang ditemukan!');
      return;
    }

    // Sort files alphabetically so episode 1, 2, 3... are in order
    filesArray.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    const newClips: AnimeClip[] = filesArray.map((file, idx) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const blobUrl = URL.createObjectURL(file);

      // Extract folder name if available (e.g. from webkitRelativePath)
      const folderPath = (file as any).webkitRelativePath;
      const folderName = folderPath ? folderPath.split('/')[0] : 'Folder AnimeList';

      return {
        id: `local-${Date.now()}-${idx}`,
        title: cleanName,
        description: `Folder: ${folderName} • (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
        tags: ['#videolokal', '#animelist', '#offline', '#hematkuota'],
        videoUrl: blobUrl,
        author: {
          name: folderName,
          username: 'offline_animelist',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=offline_robot',
          isVerified: true,
          isFollowing: true,
        },
        music: {
          title: cleanName,
          author: 'Audio Bawaan Video',
        },
        stats: {
          likes: 0,
          comments: 0,
          saves: 0,
          shares: 0,
        },
        isLiked: false,
        isSaved: false,
      };
    });

    onVideosSelected(newClips);
    onClose();
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div 
        className="comment-drawer" 
        style={{ 
          height: 'auto', 
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        <div className="drawer-header">
          <span className="drawer-title">📂 Impor Video & Folder AnimeList (Offline)</span>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Tutup">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '20px 16px 28px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '46px', lineHeight: 1 }}>📁🎬</div>
          
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              Impor Banyak Video dari Folder HP
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Pilih folder khusus (misal: <strong>/AnimeList</strong> atau <strong>/Download</strong>). Semua video di dalamnya akan langsung dimuat secara otomatis!
            </p>
          </div>

          {/* Hidden File Input for Multiple Files */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />

          {/* Hidden File Input for Folder Selection */}
          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: '', directory: '' } as any)}
            multiple
            accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />

          {/* Button 1: Impor Entire Folder */}
          <button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            style={{
              background: 'linear-gradient(90deg, #25f4ee 0%, #00d2ff 100%)',
              color: '#000',
              padding: '16px 20px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '14.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(37, 244, 238, 0.3)',
              cursor: 'pointer',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>📂 PILIH SELURUH FOLDER (ANIMELIST)</span>
          </button>

          {/* Button 2: Select Files */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '14px 20px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
            <span>🎬 PILIH FILE VIDEO TERTENTU</span>
          </button>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '12px',
              fontSize: '12px',
              color: 'var(--secondary-cyan)',
              lineHeight: '1.4',
            }}
          >
            ✓ Video otomatis diurutkan sesuai urutan episode<br />
            ✓ 100% Bebas Kuota (0 KB Internet) & Bebas Delay
          </div>

          {currentCount > 0 && (
            <p style={{ fontSize: '12px', color: '#fff', opacity: 0.8 }}>
              Saat ini ada <strong>{currentCount} video</strong> terpasang di daftar putar.
            </p>
          )}
        </div>
      </div>
    </>
  );
};
