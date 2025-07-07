import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { WaffleVideo } from '@/types';
import { mockFriends } from '@/data/mockData';
import { MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { Portal } from 'react-native-paper';

interface WaffleCardProps {
  video: WaffleVideo;
  onPlay: (video: WaffleVideo) => void;
}

export default function WaffleCard({ video, onPlay }: WaffleCardProps) {
  const sender = mockFriends.find(f => f.id === video.sender);
  const timeAgo = getTimeAgo(video.timestamp);

  const handlePress = () => {
    router.push({ pathname: '/video-thread', params: { videoId: video.id } });
  };

  const [showReactions, setShowReactions] = useState(false);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const emojiBtnRef = useRef<View>(null);
  const emojiList = ['😍', '👏', '🔥', '😂', '👍'];

  const handleEmojiPress = () => {
    if (emojiBtnRef.current) {
      emojiBtnRef.current.measureInWindow((x, y, width, height) => {
        setPopupPos({ x, y: y + height });
        setShowReactions((v) => !v);
      });
    } else {
      setShowReactions((v) => !v);
    }
  };

  const handleClosePopup = () => {
    setShowReactions(false);
    setPopupPos(null);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={1}>
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
        <View style={styles.actionButtonRow}>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity
              ref={emojiBtnRef}
              style={styles.actionButton}
              onPress={handleEmojiPress}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>😊</Text>
            </TouchableOpacity>
            <Portal>
              {showReactions && popupPos && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={handleClosePopup}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 998,
                  }}
                >
                  {/* Overlay to close popup when tapping outside */}
                </TouchableOpacity>
              )}
              {showReactions && popupPos && (
                <View
                  style={[
                    styles.emojiRowPopup,
                    {
                      position: 'absolute',
                      top: popupPos.y,
                      left: popupPos.x,
                      zIndex: 999,
                    },
                  ]}
                >
                  {emojiList.map((emoji, idx) => (
                    <TouchableOpacity key={emoji} style={styles.emojiButton}>
                      <Text style={styles.emoji}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.emojiButton}>
                    <Text style={styles.emoji}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Portal>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
            <MessageCircle size={20} color="#1B365D" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
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
  actionButtonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
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
  emojiRowPopup: {
    position: 'absolute',
    top: 36,
    left: 0,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    zIndex: 999,
    alignSelf: 'flex-start',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  emojiButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: '#FFF8DC',
    minWidth: 36,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: { fontSize: 18 },
});