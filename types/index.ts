export interface WaffleGroup {
  id: string;
  name: string;
  letter: string;
  color: string;
  members: string[];
  hasNewContent: boolean;
  isUnlocked: boolean;
}

export interface WaffleVideo {
  id: string;
  sender: string;
  groupId: string;
  prompt: string;
  videoUrl: string;
  timestamp: number;
  duration: number;
  reactions: Reaction[];
}

export interface Reaction {
  userId: string;
  type: 'heart' | 'laugh' | 'surprise' | 'sad';
  timestamp: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Prompt {
  id: string;
  category: 'happy' | 'sad' | 'reflective';
  text: string;
  emoji: string;
}