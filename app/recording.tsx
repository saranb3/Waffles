import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, RotateCcw, Square, Circle } from 'lucide-react-native';
import { Video } from 'expo-av';

export default function RecordingScreen() {
  const { promptText, promptEmoji } = useLocalSearchParams<{
    promptText: string;
    promptEmoji: string;
  }>();
  
  const [facing, setFacing] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const intervalRef = useRef<number | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [retakeCount, setRetakeCount] = useState(0);
  const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null);
  const [showReplay, setShowReplay] = useState(false);
  const [recordingPromise, setRecordingPromise] = useState<Promise<any> | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    if (Platform.OS === 'web') {
      setIsRecording(true);
      setRecordingTime(0);
      setRecordedVideoUri('simulated-web-video.mp4');
    } else {
      if (cameraRef.current) {
        setIsRecording(true);
        setRecordingTime(0);
        const promise = cameraRef.current.recordAsync({ maxDuration: 30 });
        setRecordingPromise(promise);
      }
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (Platform.OS === 'web') {
      setRecordedVideoUri('simulated-web-video.mp4');
      setShowReplay(true);
    } else {
      if (cameraRef.current && recordingPromise) {
        cameraRef.current.stopRecording();
        try {
          const video = await recordingPromise;
          setRecordedVideoUri(video.uri);
        } catch (e) {
          // handle error
        }
        setShowReplay(true);
        setRecordingPromise(null);
      }
    }
  };

  const handleRetake = () => {
    setRetakeCount((prev) => prev + 1);
    setRecordedVideoUri(null);
    setShowReplay(false);
    setRecordingTime(0);
    setIsRecording(false);
  };

  const handleSend = () => {
    router.push({
      pathname: '/send-to',
      params: {
        promptText: promptText,
        duration: recordingTime.toString(),
        videoUri: recordedVideoUri || '',
      },
    });
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Needed</Text>
          <Text style={styles.permissionText}>
            We need your permission to record waffles
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={styles.replayButtonsBar}>
            <TouchableOpacity
              style={[styles.retakeButton, { opacity: retakeCount < 1 ? 1 : 0.5 }]}
              onPress={retakeCount < 1 ? handleRetake : undefined}
              disabled={retakeCount >= 1}
            >
              <RotateCcw size={24} color="#1B365D" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <ArrowLeft size={24} color="#FFD700" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {Platform.OS !== 'web' ? (
          <CameraView style={StyleSheet.absoluteFill} facing={facing} ref={cameraRef} />
        ) : (
          <View style={[styles.webCamera, StyleSheet.absoluteFill]} />
        )}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <RecordingOverlay />
        </View>
      </View>
    </SafeAreaView>
  );

  function RecordingOverlay() {
    return (
      <>
        <View style={styles.topOverlay}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:
              {String(recordingTime % 60).padStart(2, '0')}
            </Text>
            <View style={[
              styles.timerBar,
              { width: `${(recordingTime / 30) * 100}%` }
            ]} />
          </View>

          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{promptText}</Text>
            <Text style={styles.promptEmoji}>{promptEmoji}</Text>
          </View>
        </View>

        {!showReplay && (
          <View style={styles.bottomOverlay}>
            {!isRecording ? (
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  { backgroundColor: '#FFD700' }
                ]}
                onPress={startRecording}
                disabled={retakeCount >= 2}
              >
                <Circle size={32} color="#1B365D" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.recordButton, { backgroundColor: '#FF6B6B' }]
                }
                onPress={stopRecording}
              >
                <Square size={32} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  webCamera: {
    flex: 1,
    backgroundColor: '#333',
    justifyContent: 'space-between',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#1B365D',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Regular',
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Quicksand-SemiBold',
    color: '#1B365D',
  },
  topOverlay: {
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  promptContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  promptEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  promptText: {
    fontSize: 20,
    fontFamily: 'Quicksand-Medium',
    color: '#FFF',
    textAlign: 'center',
  },
  timerContainer: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  timerBar: {
    height: 4,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    alignSelf: 'flex-start',
    minWidth: 40,
  },
  bottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5%',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  placeholder: {
    width: 50,
  },
  replayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  retakeCounter: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    marginBottom: 12,
  },
  replayVideo: {
    width: '100%',
    height: 350,
    backgroundColor: '#222',
    borderRadius: 16,
    marginBottom: 24,
  },
  replayButtonsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    gap: 24,
  },
  retakeButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginRight: 16,
  },
  retakeButtonText: {
    color: '#1B365D',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  sendButton: {
    backgroundColor: '#1B365D',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  sendButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
});