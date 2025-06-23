import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { mockFriends, mockGroups } from '@/data/mockData';

export default function SendToScreen() {
  const { promptText, duration } = useLocalSearchParams<{
    promptText: string;
    duration: string;
  }>();
  
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const toggleFriend = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const toggleGroup = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSend = () => {
    if (selectedFriends.length === 0 && selectedGroups.length === 0) {
      return;
    }
    
    // TODO: Send the waffle to selected friends/groups
    console.log('Sending to friends:', selectedFriends);
    console.log('Sending to groups:', selectedGroups);
    
    // Navigate back to home
    router.push('/(tabs)');
  };

  const totalSelected = selectedFriends.length + selectedGroups.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.title}>Send Your Waffle</Text>
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>🧇 Your {duration}s waffle is ready!</Text>
        <Text style={styles.previewPrompt}>{promptText}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Groups</Text>
          {mockGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.recipientItem,
                { backgroundColor: selectedGroups.includes(group.id) ? '#FFD700' : '#FFF' }
              ]}
              onPress={() => toggleGroup(group.id)}
            >
              <View style={[styles.groupIcon, { backgroundColor: group.color }]}>
                <Text style={styles.groupLetter}>{group.letter}</Text>
              </View>
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{group.name}</Text>
                <Text style={styles.recipientSubtext}>
                  {group.members.length} members
                </Text>
              </View>
              {selectedGroups.includes(group.id) && (
                <Check size={24} color="#1B365D" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends</Text>
          {mockFriends.map((friend) => (
            <TouchableOpacity
              key={friend.id}
              style={[
                styles.recipientItem,
                { backgroundColor: selectedFriends.includes(friend.id) ? '#FFD700' : '#FFF' }
              ]}
              onPress={() => toggleFriend(friend.id)}
            >
              <Image source={{ uri: friend.avatar }} style={styles.avatar} />
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{friend.name}</Text>
                <Text style={styles.recipientSubtext}>
                  {friend.isOnline ? '🟢 Online' : '⚪ Offline'}
                </Text>
              </View>
              {selectedFriends.includes(friend.id) && (
                <Check size={24} color="#1B365D" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: totalSelected > 0 ? '#FFD700' : '#CCC',
              opacity: totalSelected > 0 ? 1 : 0.5,
            }
          ]}
          onPress={handleSend}
          disabled={totalSelected === 0}
        >
          <Text style={styles.sendButtonText}>
            Send to {totalSelected} {totalSelected === 1 ? 'recipient' : 'recipients'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#1B365D',
  },
  preview: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
    marginBottom: 8,
  },
  previewPrompt: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
    marginBottom: 12,
  },
  recipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupLetter: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#FFF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
    marginBottom: 2,
  },
  recipientSubtext: {
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
  },
  sendButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sendButtonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
  },
});