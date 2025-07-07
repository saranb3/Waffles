import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Keyboard, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockVideos } from '@/data/mockData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Video, ResizeMode } from 'expo-av';

const mockComments = [
  { id: '1', user: 'Tun', text: 'Love this!', reactions: ['😍', '👏'] },
  { id: '2', user: 'Kris', text: 'So cool!', reactions: ['🔥'] },
  { id: '3', user: 'You', text: 'Thanks everyone!', reactions: [] },
];

export default function ReplyScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const video = mockVideos.find(v => v.id === videoId);
  const [comments, setComments] = useState(mockComments);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (input.trim()) {
      setComments(prev => [
        ...prev,
        { id: Date.now().toString(), user: 'You', text: input, reactions: [] },
      ]);
      setInput('');
      Keyboard.dismiss();
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleReact = (commentId: string, emoji: string) => {
    setComments(comments.map(c => c.id === commentId ? { ...c, reactions: [...c.reactions, emoji] } : c));
  };

  const renderItem = ({ item }: { item: typeof mockComments[0] }) => {
    const isMe = item.user === 'You';
    return (
      <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowOther]}>
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={styles.bubbleUser}>{isMe ? 'You' : item.user}</Text>
          <Text style={styles.bubbleText}>{item.text}</Text>
          <View style={styles.reactionsRow}>
            {['😍','👏','🔥','😂','👍'].map(emoji => (
              <TouchableOpacity key={emoji} onPress={() => handleReact(item.id, emoji)}>
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
            {item.reactions.length > 0 && (
              <Text style={styles.commentReactions}>{item.reactions.join(' ')}</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <View style={styles.videoContainer}>
          {video?.videoUrl ? (
            <Video
              source={{ uri: video.videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={false}
            />
          ) : (
            <Text style={styles.noVideo}>No video available</Text>
          )}
          <Text style={styles.postPrompt}>{video?.prompt}</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={comments}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8DC' },
  backButton: { padding: 16 },
  backText: { color: '#1B365D', fontSize: 16 },
  videoContainer: { backgroundColor: '#FFF', padding: 0, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  video: { width: '100%', height: 220, backgroundColor: '#000', borderRadius: 0 },
  noVideo: { textAlign: 'center', color: '#8B7355', padding: 20 },
  postPrompt: { fontSize: 16, color: '#1B365D', fontFamily: 'Quicksand-Bold', padding: 12, paddingBottom: 0 },
  chatList: { padding: 12, paddingBottom: 24 },
  bubbleRow: { flexDirection: 'row', marginBottom: 8 },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowOther: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 2 },
  bubbleMe: { backgroundColor: '#FFD700', alignSelf: 'flex-end' },
  bubbleOther: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FFD700', alignSelf: 'flex-start' },
  bubbleUser: { fontSize: 12, color: '#8B7355', marginBottom: 2 },
  bubbleText: { fontSize: 15, color: '#1B365D' },
  reactionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  emoji: { fontSize: 18, marginRight: 4 },
  commentReactions: { marginLeft: 8, color: '#FFD700' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  input: { flex: 1, borderWidth: 1, borderColor: '#FFD700', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#FFF' },
  sendButton: { backgroundColor: '#FFD700', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  sendButtonText: { color: '#1B365D', fontWeight: 'bold' },
}); 