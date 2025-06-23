import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import GroupSelector from '@/components/GroupSelector';
import WaffleCard from '@/components/WaffleCard';
import { mockGroups, mockVideos } from '@/data/mockData';
import { WaffleVideo } from '@/types';

export default function HomeScreen() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const filteredVideos = selectedGroupId 
    ? mockVideos.filter(video => video.groupId === selectedGroupId)
    : mockVideos;

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
      </View>

      <GroupSelector
        groups={mockGroups}
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
});