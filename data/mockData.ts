import { WaffleGroup, Friend, Prompt, WaffleVideo } from '@/types';

export const mockGroups: WaffleGroup[] = [
  {
    id: '1',
    name: 'Best Friends',
    letter: 'B',
    color: '#FF6B6B',
    members: ['user1', 'user2', 'user3'],
    hasNewContent: true,
    isUnlocked: true,
  },
  {
    id: '2',
    name: 'Daily Check-ins',
    letter: 'D',
    color: '#4ECDC4',
    members: ['user4', 'user5'],
    hasNewContent: false,
    isUnlocked: false,
  },
  {
    id: '3',
    name: 'Study Group',
    letter: 'S',
    color: '#45B7D1',
    members: ['user6', 'user7', 'user8'],
    hasNewContent: true,
    isUnlocked: true,
  },
  {
    id: '4',
    name: 'Music Lovers',
    letter: 'M',
    color: '#F7DC6F',
    members: ['user9', 'user10'],
    hasNewContent: false,
    isUnlocked: false,
  },
];

export const mockFriends: Friend[] = [
  {
    id: 'user1',
    name: 'Team',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isOnline: true,
  },
  {
    id: 'user2',
    name: 'Tun',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isOnline: false,
  },
  {
    id: 'user3',
    name: 'Kris',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isOnline: true,
  },
  {
    id: 'user4',
    name: 'Sarah',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isOnline: true,
  },
  {
    id: 'user5',
    name: 'Mike',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    isOnline: false,
  },
];

export const mockPrompts: Prompt[] = [
  // Happy prompts
  {
    id: '1',
    category: 'happy',
    text: "What made you smile today?",
    emoji: '😊',
  },
  {
    id: '2',
    category: 'happy',
    text: "Share something you're grateful for right now",
    emoji: '🙏',
  },
  {
    id: '3',
    category: 'happy',
    text: "What's the best part of your day so far?",
    emoji: '✨',
  },
  // Sad prompts
  {
    id: '4',
    category: 'sad',
    text: "What's been on your mind lately?",
    emoji: '💭',
  },
  {
    id: '5',
    category: 'sad',
    text: "Is there something you need support with?",
    emoji: '🤗',
  },
  {
    id: '6',
    category: 'sad',
    text: "How are you really feeling today?",
    emoji: '💙',
  },
  // Reflective prompts
  {
    id: '7',
    category: 'reflective',
    text: "What lesson did you learn this week?",
    emoji: '🌱',
  },
  {
    id: '8',
    category: 'reflective',
    text: "If you could tell your past self one thing, what would it be?",
    emoji: '⏰',
  },
  {
    id: '9',
    category: 'reflective',
    text: "What are you working towards right now?",
    emoji: '🎯',
  },
];

export const mockVideos: WaffleVideo[] = [
  {
    id: '1',
    sender: 'user1',
    groupId: '1',
    prompt: "What made you smile today?",
    videoUrl: 'mock-video-1',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    duration: 28,
    reactions: [
      { userId: 'user2', type: 'heart', timestamp: Date.now() - 1000 * 60 * 15 }
    ],
  },
  {
    id: '2',
    sender: 'user3',
    groupId: '3',
    prompt: "What's the best part of your day so far?",
    videoUrl: 'mock-video-2',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    duration: 30,
    reactions: [],
  },
];