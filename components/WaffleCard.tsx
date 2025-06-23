import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { WaffleVideo } from '@/types';
import { mockFriends } from '@/data/mockData';
import { MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';

interface WaffleCardProps {
  video: WaffleVideo;
  onPlay: (video: WaffleVideo) => void;
}

export default function WaffleCard({ video, onPlay }: WaffleCardProps) {
  const sender = mockFriends.find(f => f.id === video.sender);
  const timeAgo = getTimeAgo(video.timestamp);

  const handlePress = () => {
    router.push({ pathname: '/reply', params: { videoId: video.id } });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Image source={{ uri: sender?.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{sender?.name}</Text>
          <Text style={styles.timeAgo}>{timeAgo}</Text>
        </View>
        <Text style={styles.duration}>{video.duration}s</Text>
      </View>
      
      <View style={styles.videoPreview}>
        <View style={styles.playButton}>
          <Text style={styles.playIcon}>▶️</Text>
        </View>
        <Text style={styles.waffleEmoji}>🧇</Text>
      </View>
      
      <Text style={styles.prompt}>{video.prompt}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color="#1B365D" />
          <Text style={styles.actionText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else {
    return `${hours}h ago`;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: '#FFD700',
    backgroundColor: '#1B365D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoPreview: {
    height: 120,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  playButton: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
  },
  waffleEmoji: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 24,
  },
  prompt: {
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
    color: '#1B365D',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
    color: '#8B7355',
  },
});