export interface CommentItem {
  id: string;
  username: string;
  userAvatar: string;
  comment: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface AnimeClip {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  posterUrl?: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isVerified?: boolean;
    isFollowing?: boolean;
  };
  music: {
    title: string;
    author: string;
    coverUrl?: string;
  };
  stats: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
  isLiked?: boolean;
  isSaved?: boolean;
  animeTitle?: string;
}
