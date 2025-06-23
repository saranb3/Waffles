import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

export default function RecordScreen() {
  const handleStartRecording = () => {
    router.push('/prompts');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🧇</Text>
        <Text style={styles.title}>Ready to Share?</Text>
        <Text style={styles.description}>
          Choose a prompt and record a 30-second waffle to share with your friends
        </Text>
        
        <TouchableOpacity style={styles.recordButton} onPress={handleStartRecording}>
          <Text style={styles.recordButtonText}>Order a Waffle</Text>
        </TouchableOpacity>
        
        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>💡 Tips for great waffles:</Text>
          <Text style={styles.tip}>• Find good lighting</Text>
          <Text style={styles.tip}>• Speak clearly</Text>
          <Text style={styles.tip}>• Be yourself and have fun!</Text>
          <Text style={styles.tip}>• Remember: 30 seconds max</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    color: '#1B365D',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  recordButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 40,
  },
  recordButtonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
  },
  tips: {
    alignItems: 'flex-start',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
    marginBottom: 12,
  },
  tip: {
    fontSize: 14,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
    marginBottom: 6,
  },
});