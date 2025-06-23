import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Video from 'expo-video';

export default function RecordScreen() {
  const handleStartRecording = () => {
    router.push('/prompts');
  };

  const [showReplay, setShowReplay] = React.useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = React.useState(null);
  const [retakeCount, setRetakeCount] = React.useState(0);

  const handleRetake = () => {
    // Implement retake logic
  };

  const handleSend = () => {
    // Implement send logic
  };

  if (showReplay && recordedVideoUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.replayContainer}>
          <Text style={styles.retakeCounter}>Takes left: {2 - retakeCount}</Text>
          <Video
            source={{ uri: recordedVideoUri }}
            style={styles.replayVideo}
            useNativeControls
            resizeMode="contain"
            isLooping
            shouldPlay
          />
          <View style={styles.replayButtons}>
            {retakeCount < 1 && (
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <Text style={styles.retakeButtonText}>Retake</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.tip}>• Only two takes!</Text>
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
  replayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replayVideo: {
    width: '100%',
    height: '50%',
  },
  replayButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  retakeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  retakeButtonText: {
    fontSize: 18,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
  },
  sendButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
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
  retakeCounter: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
    marginBottom: 20,
  },
});