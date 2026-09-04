'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimeClip } from '../types/clip';
import { INITIAL_CLIPS } from '../data/mockClips';
import { VideoCard } from '../components/Feed/VideoCard';
import { TopHeader } from '../components/Navigation/TopHeader';
import { BottomNav } from '../components/Navigation/BottomNav';
import { CommentDrawer } from '../components/Feed/CommentDrawer';
import { ShareModal } from '../components/Modals/ShareModal';
import { UploadModal } from '../components/Modals/UploadModal';
import { LocalVideoPicker } from '../components/Modals/LocalVideoPicker';

export default function HomePage() {
  const [onlineClips, setOnlineClips] = useState<AnimeClip[]>(INITIAL_CLIPS);
  const [localClips, setLocalClips] = useState<AnimeClip[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'local' | 'foryou' | 'following'>('local');
  const [bottomNavTab, setBottomNavTab] = useState<'home' | 'explore' | 'inbox' | 'profile'>('home');
  const [isAutoNext, setIsAutoNext] = useState(true); // Auto-next toggle

  // Modals state
  const [selectedClipForComments, setSelectedClipForComments] = useState<AnimeClip | null>(null);
  const [selectedClipForShare, setSelectedClipForShare] = useState<AnimeClip | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLocalPickerOpen, setIsLocalPickerOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);

  // Filter clips based on active tab
  let displayedClips: AnimeClip[] = [];
  if (activeTab === 'local') {
    displayedClips = localClips.filter((c) => 
      c.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(localSearchQuery.toLowerCase()))
    );
  } else if (activeTab === 'following') {
    displayedClips = onlineClips.filter((c) => c.author.isFollowing);
  } else {
    displayedClips = onlineClips;
  }

  // Use IntersectionObserver for 100% stable, jitter-free video switching
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slides = container.querySelectorAll('.video-slide');
    if (slides.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Array.from(slides).indexOf(entry.target);
            if (index !== -1) {
              setActiveIndex(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    slides.forEach((slide) => observer.observe(slide));

    return () => {
      observer.disconnect();
    };
  }, [displayedClips, activeTab]);

  // Auto-next when video finishes
  const handleVideoEnded = () => {
    if (!isAutoNext || !containerRef.current || displayedClips.length <= 1) return;
    const clientHeight = containerRef.current.clientHeight;
    const nextIndex = (activeIndex + 1) % displayedClips.length;
    containerRef.current.scrollTo({ top: nextIndex * clientHeight, behavior: 'smooth' });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const clientHeight = containerRef.current.clientHeight;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, displayedClips.length - 1);
        containerRef.current.scrollTo({ top: nextIndex * clientHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        containerRef.current.scrollTo({ top: prevIndex * clientHeight, behavior: 'smooth' });
      } else if (e.key.toLowerCase() === 'l') {
        const currentClip = displayedClips[activeIndex];
        if (currentClip) handleLikeToggle(currentClip.id);
      } else if (e.key.toLowerCase() === 'c') {
        const currentClip = displayedClips[activeIndex];
        if (currentClip) setSelectedClipForComments(currentClip);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, displayedClips]);

  // Like & Save Toggles
  const handleLikeToggle = (id: string) => {
    const updater = (prev: AnimeClip[]) =>
      prev.map((clip) => {
        if (clip.id === id) {
          const isLiked = !clip.isLiked;
          return {
            ...clip,
            isLiked,
            stats: {
              ...clip.stats,
              likes: isLiked ? clip.stats.likes + 1 : Math.max(0, clip.stats.likes - 1),
            },
          };
        }
        return clip;
      });

    if (activeTab === 'local') setLocalClips(updater);
    else setOnlineClips(updater);
  };

  const handleSaveToggle = (id: string) => {
    const updater = (prev: AnimeClip[]) =>
      prev.map((clip) => {
        if (clip.id === id) {
          const isSaved = !clip.isSaved;
          return {
            ...clip,
            isSaved,
            stats: {
              ...clip.stats,
              saves: isSaved ? clip.stats.saves + 1 : Math.max(0, clip.stats.saves - 1),
            },
          };
        }
        return clip;
      });

    if (activeTab === 'local') setLocalClips(updater);
    else setOnlineClips(updater);
  };

  const handleFollowToggle = (id: string) => {
    setOnlineClips((prev) =>
      prev.map((clip) => {
        if (clip.id === id) {
          return {
            ...clip,
            author: { ...clip.author, isFollowing: !clip.author.isFollowing },
          };
        }
        return clip;
      })
    );
  };

  const handleUploadNewClip = (newClip: AnimeClip) => {
    setOnlineClips([newClip, ...onlineClips]);
    setActiveTab('foryou');
    setActiveIndex(0);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLocalVideosAdded = (newLocalClips: AnimeClip[]) => {
    setLocalClips((prev) => [...newLocalClips, ...prev]);
    setActiveTab('local');
    setActiveIndex(0);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectNativeFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newClips: AnimeClip[] = Array.from(files).map((file, idx) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const blobUrl = URL.createObjectURL(file);

      return {
        id: `local-${Date.now()}-${idx}`,
        title: cleanName,
        description: `Video lokal (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
        tags: ['#videolokal', '#offline', '#hematkuota'],
        videoUrl: blobUrl,
        author: {
          name: 'Galeri HP',
          username: 'offline_device',
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

    handleLocalVideosAdded(newClips);
  };

  return (
    <main className="app-container">
      {/* Hidden Native File Input */}
      <input
        ref={directFileInputRef}
        type="file"
        multiple
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleDirectNativeFilePick}
      />

      {/* Desktop Left Sidebar Helper */}
      <div className="desktop-helper-sidebar">
        <div className="brand-badge">
          <span className="brand-pink">Anime</span>
          <span className="brand-cyan">Tok</span>
          <span style={{ fontSize: '18px' }}>⚡</span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Platform klip video TikTok-style dengan <strong>Mode Offline Bebas Kuota</strong> untuk video hasil download kamu.
        </p>

        {/* Mode Offline Quick Button */}
        <button
          onClick={() => setIsLocalPickerOpen(true)}
          style={{
            background: 'rgba(37, 244, 238, 0.15)',
            border: '1px solid var(--secondary-cyan)',
            color: 'var(--secondary-cyan)',
            padding: '14px 18px',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
          }}
        >
          <span>📂 IMPOR FOLDER ANIMELIST / VIDEO</span>
        </button>

        <div className="shortcut-card">
          <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '13px', color: '#fff' }}>
            ⌨️ Pintasan Keyboard:
          </div>
          <div className="shortcut-row">
            <span>Video Berikutnya</span>
            <span className="kbd-badge">↓ Bawah</span>
          </div>
          <div className="shortcut-row">
            <span>Video Sebelumnya</span>
            <span className="kbd-badge">↑ Atas</span>
          </div>
          <div className="shortcut-row">
            <span>Sukai (Like) Klip</span>
            <span className="kbd-badge">L</span>
          </div>
          <div className="shortcut-row">
            <span>Buka Komentar</span>
            <span className="kbd-badge">C</span>
          </div>
        </div>
      </div>

      {/* Main Mobile/Feed Container */}
      <div className="feed-wrapper">
        {/* Top Header */}
        <TopHeader
          activeTab={activeTab}
          localVideoCount={localClips.length}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setActiveIndex(0);
            if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSearchClick={() => {
            const keyword = prompt('Ketik judul video atau tagar yang ingin dicari:');
            if (keyword !== null) {
              if (activeTab === 'local') {
                setLocalSearchQuery(keyword);
              } else {
                alert(`Mencari "${keyword}" di FYP Online...`);
              }
            }
          }}
        />

        {/* Snap Feed Container */}
        <div 
          className="snap-feed-container" 
          ref={containerRef}
        >
          {displayedClips.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '24px 20px', textAlign: 'center' }}>
              {activeTab === 'local' ? (
                <>
                  <div style={{ fontSize: '52px', marginBottom: '14px' }}>📴👶</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Mode Offline (Hemat Kuota)</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5', maxWidth: '320px' }}>
                    Putar video kartun/anime yang sudah kamu download di HP. <strong>100% bebas kuota</strong> dan otomatis lancar!
                  </p>
                  
                  {/* Big Touch-Friendly Button for Mobile */}
                  <button
                    style={{
                      marginTop: '24px',
                      background: 'linear-gradient(90deg, #25f4ee 0%, #fe2c55 100%)',
                      color: '#000',
                      padding: '16px 28px',
                      borderRadius: '30px',
                      fontWeight: 800,
                      fontSize: '15px',
                      boxShadow: '0 8px 30px rgba(254,44,85,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsLocalPickerOpen(true)}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>IMPOR FOLDER / VIDEO HP SEKARANG</span>
                  </button>
                  
                  <button
                    style={{ marginTop: '16px', background: 'transparent', color: 'var(--secondary-cyan)', fontSize: '13px', fontWeight: 600 }}
                    onClick={() => setActiveTab('foryou')}
                  >
                    Atau tonton FYP Online →
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>📺</div>
                  <h3>Belum ada kreator yang diikuti</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Pindah ke tab <strong>FYP Online</strong> dan ikuti kreator anime favoritmu!
                  </p>
                  <button
                    style={{ marginTop: '16px', background: 'var(--primary-pink)', color: '#fff', padding: '10px 20px', borderRadius: '20px', fontWeight: 700 }}
                    onClick={() => setActiveTab('foryou')}
                  >
                    Lihat FYP
                  </button>
                </>
              )}
            </div>
          ) : (
            displayedClips.map((clip, idx) => (
              <VideoCard
                key={clip.id}
                clip={clip}
                isActive={idx === activeIndex}
                isNearActive={activeTab === 'local' ? true : Math.abs(idx - activeIndex) <= 2}
                isLocalMode={activeTab === 'local'}
                onLikeToggle={handleLikeToggle}
                onSaveToggle={handleSaveToggle}
                onFollowToggle={handleFollowToggle}
                onOpenComments={(c) => setSelectedClipForComments(c)}
                onOpenShare={(c) => setSelectedClipForShare(c)}
                onVideoEnded={isAutoNext ? handleVideoEnded : undefined}
              />
            ))
          )}
        </div>

        {/* Bottom App Navigation */}
        <BottomNav
          currentTab={bottomNavTab}
          onTabChange={(tab) => {
            setBottomNavTab(tab);
            if (tab === 'inbox') alert('Tidak ada notifikasi baru saat ini 🔔');
            if (tab === 'explore') alert('Jelajahi kategori anime & video lokal!');
            if (tab === 'profile') alert(`Mode Pengguna: Aktif (${localClips.length} video offline)`);
          }}
          onOpenUpload={() => {
            if (activeTab === 'local') {
              setIsLocalPickerOpen(true);
            } else {
              setIsUploadOpen(true);
            }
          }}
        />
      </div>

      {/* Desktop Right Sidebar Helper */}
      <div className="desktop-helper-right">
        <div className="shortcut-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📴👶</div>
          <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff', marginBottom: '6px' }}>
            Mode Bebas Kuota
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
            Pilih video kartun/anime di folder download HP. Langsung bisa di-scroll sepuasnya!
          </p>
          <button
            onClick={() => setIsLocalPickerOpen(true)}
            style={{
              background: 'linear-gradient(90deg, #25f4ee 0%, #fe2c55 100%)',
              color: '#000',
              padding: '12px 18px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 800,
              width: '100%',
              boxShadow: '0 4px 15px rgba(37, 244, 238, 0.3)',
              cursor: 'pointer'
            }}
          >
            + Impor Folder / Video
          </button>
        </div>
      </div>

      {/* Local Video Picker Modal */}
      <LocalVideoPicker
        isOpen={isLocalPickerOpen}
        onClose={() => setIsLocalPickerOpen(false)}
        onVideosSelected={handleLocalVideosAdded}
        currentCount={localClips.length}
      />

      {/* Comments Drawer */}
      <CommentDrawer
        isOpen={!!selectedClipForComments}
        onClose={() => setSelectedClipForComments(null)}
        clipTitle={selectedClipForComments?.title || ''}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={!!selectedClipForShare}
        onClose={() => setSelectedClipForShare(null)}
        clipTitle={selectedClipForShare?.title || ''}
      />

      {/* Upload Modal (Online) */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadNewClip}
      />
    </main>
  );
}
