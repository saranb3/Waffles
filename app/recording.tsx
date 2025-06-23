import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, RotateCcw, Square, Circle } from 'lucide-react-native';

export default function RecordingScreen() {
  const { promptText, promptEmoji } = useLocalSearchParams<{
    promptText: string;
    promptEmoji: string;
  }>();
  
  const [facing, setFacing] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<CameraView>(null);

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
      // Web recording simulation
      setIsRecording(true);
      setRecordingTime(0);
    } else {
      // Native recording would go here
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Navigate to send-to screen
    setTimeout(() => {
      router.push({
        pathname: '/send-to',
        params: {
          promptText: promptText,
          duration: recordingTime.toString(),
        }
      });
    }, 500);
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

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS !== 'web' ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <RecordingOverlay />
        </CameraView>
      ) : (
        <View style={styles.webCamera}>
          <RecordingOverlay />
        </View>
      )}
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
          
          <View style={styles.promptContainer}>
            <Text style={styles.promptEmoji}>{promptEmoji}</Text>
            <Text style={styles.promptText}>{promptText}</Text>
          </View>
          
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
        </View>

        <View style={styles.bottomOverlay}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <RotateCcw size={24} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? '#FF6B6B' : '#FFD700' }
            ]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? (
              <Square size={32} color="#FFF" />
            ) : (
              <Circle size={32} color="#1B365D" />
            )}
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>
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
    paddingTop: 50,
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
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#FFF',
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 40,
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
});