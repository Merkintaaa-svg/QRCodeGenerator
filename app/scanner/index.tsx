import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Vibration,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Overlay } from "./Overlay";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handlePress = () => {
    if (scannedData) {
      Linking.openURL(scannedData);
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            Vibration.vibrate();
            setScannedData(data);
            setTimeout(() => {
              qrLock.current = false; // Unlock scanning ability
            }, 1000);
          }
        }}
      />
      <Overlay />
      {scannedData && ( // If there is scanned data, display it
        <View style={styles.textContainer}>
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.scannedText}>{scannedData}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 8,
  },
  scannedText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
});
