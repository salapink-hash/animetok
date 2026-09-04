'use client';

import React, { useState } from 'react';
import { CommentItem } from '../../types/clip';
import { INITIAL_COMMENTS } from '../../data/mockClips';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clipTitle: string;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({
  isOpen,
  onClose,
  clipTitle,
}) => {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      username: 'you_wibu_king',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
      comment: newCommentText.trim(),
      timestamp: 'Baru saja',
      likes: 0,
      isLiked: false,
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const toggleCommentLike = (id: string) => {
    setComments(
      comments.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            likes: item.isLiked ? item.likes - 1 : item.likes + 1,
            isLiked: !item.isLiked,
          };
        }
        return item;
      })
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="comment-drawer">
        {/* Header */}
        <div className="drawer-header">
          <span className="drawer-title">{comments.length} Komentar</span>
          <button className="drawer-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Comment List */}
        <div className="comments-list">
          {comments.map((item) => (
            <div key={item.id} className="comment-item">
              <img src={item.userAvatar} alt={item.username} className="comment-avatar" />
              <div className="comment-body">
                <div className="comment-user">@{item.username}</div>
                <p className="comment-text">{item.comment}</p>
                <div className="comment-meta">
                  <span>{item.timestamp}</span>
                  <button 
                    style={{ color: 'inherit', fontWeight: 600 }}
                    onClick={() => alert(`Balas ke @${item.username}`)}
                  >
                    Balas
                  </button>
                </div>
              </div>
              {/* Comment Like */}
              <button 
                onClick={() => toggleCommentLike(item.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: item.isLiked ? 'var(--primary-pink)' : 'var(--text-muted)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={item.isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span style={{ fontSize: '10px', marginTop: '2px' }}>{item.likes}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form className="comment-input-bar" onSubmit={handleAddComment}>
          <input
            type="text"
            className="comment-input"
            placeholder="Tambah komentar klip ini..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
          />
          <button type="submit" className="comment-send-btn" title="Kirim">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};
