import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { mockPrompts } from '@/data/mockData';
import { Prompt } from '@/types';

export default function PromptsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<'happy' | 'sad' | 'reflective'>('happy');
  
  const categories = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: '#FFD700' },
    { id: 'sad', label: 'Thoughtful', emoji: '💭', color: '#4ECDC4' },
    { id: 'reflective', label: 'Reflective', emoji: '🌱', color: '#45B7D1' },
  ] as const;

  const filteredPrompts = mockPrompts.filter(p => p.category === selectedCategory);

  const handleSelectPrompt = (prompt: Prompt) => {
    router.push({
      pathname: '/recording',
      params: { 
        promptId: prompt.id,
        promptText: prompt.text,
        promptEmoji: prompt.emoji,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1B365D" />
        </TouchableOpacity>
        <Text style={styles.title}>Choose Your Prompt</Text>
      </View>

      <View style={styles.categories}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: selectedCategory === category.id ? category.color : '#FFF',
                borderColor: category.color,
              }
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === category.id ? '#FFF' : '#1B365D' }
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.promptsList} showsVerticalScrollIndicator={false}>
        {filteredPrompts.map((prompt) => (
          <TouchableOpacity
            key={prompt.id}
            style={styles.promptCard}
            onPress={() => handleSelectPrompt(prompt)}
          >
            <Text style={styles.promptEmoji}>{prompt.emoji}</Text>
            <Text style={styles.promptText}>{prompt.text}</Text>
          </TouchableOpacity>
        ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#1B365D',
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
  },
  promptsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  promptCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promptEmoji: {
    fontSize: 28,
    marginRight: 16,
  },
  promptText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#1B365D',
    lineHeight: 22,
  },
});