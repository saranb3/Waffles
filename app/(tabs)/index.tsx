import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import GroupSelector from '@/components/GroupSelector';
import WaffleCard from '@/components/WaffleCard';
import { mockGroups, mockVideos } from '@/data/mockData';
import { WaffleVideo } from '@/types';

export default function HomeScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [feedType, setFeedType] = useState<'group' | '1on1'>('group');

  // Filter groups by feedType
  const filteredGroups = mockGroups.filter(group => group.type === feedType);

  // Filter videos by selected group and feedType
  const filteredVideos = selectedGroupId
    ? mockVideos.filter(video => video.groupId === selectedGroupId)
    : mockVideos.filter(video => {
        const group = mockGroups.find(g => g.id === video.groupId);
        return group && group.type === feedType;
      });

  const handlePlayVideo = (video: WaffleVideo) => {
    // TODO: Implement video player
    console.log('Playing video:', video.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧇</Text>
        <Text style={styles.subtitle}>Your Waffle Friends</Text>
        <Text style={styles.description}>Send a waffle to brighten someone's day</Text>
        {/* Toggle for feed type */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, feedType === 'group' && styles.toggleButtonActive]}
            onPress={() => {
              setFeedType('group');
              setSelectedGroupId(null);
            }}
          >
            <Text style={[styles.toggleText, feedType === 'group' && styles.toggleTextActive]}>Group Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, feedType === '1on1' && styles.toggleButtonActive]}
            onPress={() => {
              setFeedType('1on1');
              setSelectedGroupId(null);
            }}
          >
            <Text style={[styles.toggleText, feedType === '1on1' && styles.toggleTextActive]}>1-on-1</Text>
          </TouchableOpacity>
        </View>
      </View>

      <GroupSelector
        groups={filteredGroups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
      />

      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <WaffleCard
              key={video.id}
              video={video}
              onPlay={handlePlayVideo}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No waffles yet! 🧇</Text>
            <Text style={styles.emptyDescription}>
              {selectedGroupId 
                ? "Send a waffle to this group to unlock their content"
                : "Start by recording your first waffle"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 48,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#1B365D',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
    textAlign: 'center',
  },
  feed: {
    flex: 1,
    paddingTop: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
    gap: 8,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: '#F3E5AB',
  },
  toggleButtonActive: {
    backgroundColor: '#FFD700',
  },
  toggleText: {
    fontSize: 15,
    color: '#8B7355',
    fontFamily: 'Quicksand-SemiBold',
  },
  toggleTextActive: {
    color: '#1B365D',
  },
});