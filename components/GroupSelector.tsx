import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { WaffleGroup } from '@/types';
import LockIcon from './LockIcon';

interface GroupSelectorProps {
  groups: WaffleGroup[];
  selectedGroupId: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

export default function GroupSelector({ groups, selectedGroupId, onSelectGroup }: GroupSelectorProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={[
            styles.groupButton,
            { backgroundColor: selectedGroupId === null ? '#FFD700' : '#FFF' }
          ]}
          onPress={() => onSelectGroup(null)}
        >
          <Text style={[
            styles.groupLetter,
            { color: selectedGroupId === null ? '#1B365D' : '#8B7355' }
          ]}>
            All
          </Text>
        </TouchableOpacity>

        {groups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={[
              styles.groupButton,
              { 
                backgroundColor: !group.isUnlocked ? '#E0E0E0' : (selectedGroupId === group.id ? '#FFD700' : group.color),
              }
            ]}
            onPress={() => group.isUnlocked && onSelectGroup(group.id)}
          >
            <Text style={[
              styles.groupLetter,
              { color: !group.isUnlocked ? '#9E9E9E' : (selectedGroupId === group.id ? '#1B365D' : '#FFF') }
            ]}>
              {group.letter}
            </Text>
            {group.hasNewContent && group.isUnlocked && (
              <View style={styles.newContentIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    backgroundColor: '#FFF8DC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  groupButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  groupLetter: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
  },
  newContentIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
  },
});