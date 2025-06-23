import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { mockVideos } from '@/data/mockData';
import { KeyboardControllerView } from 'react-native-keyboard-controller';

const INPUT_HEIGHT = 64;

const mockComments = [
  { id: '1', user: 'Tun', text: 'Love this!', reactions: ['😍', '👏'] },
  { id: '2', user: 'Kris', text: 'So cool!', reactions: ['🔥'] },
];

export default function ReplyScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const video = mockVideos.find(v => v.id === videoId);
  const [comments, setComments] = useState(mockComments);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setComments([...comments, { id: Date.now().toString(), user: 'You', text: input, reactions: [] }]);
      setInput('');
      Keyboard.dismiss();
    }
  };

  const handleReact = (commentId: string, emoji: string) => {
    setComments(comments.map(c => c.id === commentId ? { ...c, reactions: [...c.reactions, emoji] } : c));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <View style={styles.postContainer}>
          <Text style={styles.postPrompt}>{video?.prompt}</Text>
          <Text style={styles.postMeta}>By {video?.sender}</Text>
        </View>
        <View style={{ flex: 1 }}>
          {comments.map(item => (
            <View style={styles.comment} key={item.id}>
              <Text style={styles.commentUser}>{item.user}:</Text>
              <Text style={styles.commentText}>{item.text}</Text>
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
          ))}
        </View>
      </View>
      <KeyboardControllerView style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add a comment..."
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardControllerView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8DC' },
  backButton: { padding: 16 },
  backText: { color: '#1B365D', fontSize: 16 },
  postContainer: { padding: 16, backgroundColor: '#FFF', borderRadius: 12, margin: 16, marginBottom: 0 },
  postPrompt: { fontSize: 16, color: '#1B365D', fontFamily: 'Quicksand-Bold' },
  postMeta: { fontSize: 12, color: '#8B7355', marginTop: 4 },
  comment: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, marginBottom: 10, elevation: 1, marginHorizontal: 16 },
  commentUser: { fontWeight: 'bold', color: '#1B365D' },
  commentText: { marginTop: 2, color: '#8B7355' },
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