import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Modal, TouchableOpacity, TextInput, Keyboard, FlatList, Animated, Easing, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

// Define mockComments at the top
const mockComments = [
  { id: '1', user: 'Tun', text: 'Love this!', reactions: ['😍', '👏'] },
  { id: '2', user: 'Kris', text: 'So cool!', reactions: ['🔥'] },
  { id: '3', user: 'You', text: 'Thanks everyone!', reactions: [] },
];

export default function VideoThreadScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = Platform.OS === 'ios' ? ['10%', '60%', '95%'] : ['12%', '65%', '98%'];
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState(mockComments);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Animation for modal slide up
  const slideAnim = useRef(new Animated.Value(0)).current;

  // PanResponder for swipe up on video area
  const videoPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dy < -20; // Only respond to upward swipes
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -40) {
          openModal();
        }
      },
    })
  ).current;

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleSend = () => {
    if (input.trim()) {
      setComments((prev: any) => [
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
    setComments((comments: any) => comments.map((c: any) => c.id === commentId ? { ...c, reactions: [...c.reactions, emoji] } : c));
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

  // Slide up animation for modal
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Platform.OS === 'ios' ? 600 : 700, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fullScreen} {...videoPanResponder.panHandlers}>
        <Text style={styles.title}>Full Screen Video Placeholder</Text>
        <TouchableOpacity style={styles.openChatButton} onPress={openModal}>
          <Text style={styles.openChatText}>Open Chat</Text>
        </TouchableOpacity>
        <Text style={styles.swipeHint}>Swipe up to open chat</Text>
      </View>
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.modalSheet, { transform: [{ translateY }] }]}> 
          <TouchableOpacity style={styles.absoluteSwipeZoneDebug} activeOpacity={0.2} onPress={closeModal} />
          <View style={styles.swipeZone}>
            <View style={styles.sheetHandleBar} />
          </View>
          {/* <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity> */}
          <Text style={styles.sheetTitle}>Chat</Text>
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
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  fullScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 24 },
  openChatButton: { backgroundColor: '#FFD700', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 24 },
  openChatText: { color: '#1B365D', fontWeight: 'bold', fontSize: 16 },
  modalSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === 'ios' ? 600 : 700,
    backgroundColor: '#FFF8DC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: 12,
  },
  sheetHandleBar: { alignSelf: 'center', width: 60, height: 6, borderRadius: 3, backgroundColor: '#FFD700', marginBottom: 12 },
  closeButton: { position: 'absolute', top: 16, right: 16, zIndex: 30, backgroundColor: '#FFD700', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  closeButtonText: { color: '#1B365D', fontWeight: 'bold' },
  sheetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B365D', marginBottom: 8, textAlign: 'center', marginTop: 16 },
  chatList: { paddingBottom: 24, marginTop: 16 },
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  input: { flex: 1, borderWidth: 1, borderColor: '#FFD700', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, backgroundColor: '#FFF' },
  sendButton: { backgroundColor: '#FFD700', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  sendButtonText: { color: '#1B365D', fontWeight: 'bold' },
  swipeHint: { color: '#FFD700', marginTop: 16, fontSize: 14, fontWeight: 'bold' },
  swipeZone: { height: 60, width: '100%', alignItems: 'center', justifyContent: 'flex-start', position: 'relative', zIndex: 10 },
  absoluteSwipeZone: { position: 'absolute', top: 0, left: 0, right: 0, height: 70, zIndex: 20 },
  absoluteSwipeZoneDebug: { position: 'absolute', top: 0, left: 0, right: 0, height: 70, zIndex: 20, backgroundColor: 'rgba(174, 174, 178, 0.2)' },
}); 