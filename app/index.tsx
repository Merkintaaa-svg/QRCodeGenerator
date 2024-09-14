import { SafeAreaView, StatusBar, StyleSheet, View, Platform, Pressable, Text } from "react-native";
import { Stack, Link } from "expo-router";
import { CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Vibration } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; // Для иконок
import { Overlay } from "./backend/scanner/Overlay"; // Импортируем оверлей
import * as ImagePicker from "expo-image-picker"; // Для выбора изображений
import React from 'react';
export default function Home() {
  const qrLock = useRef(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleScan = (data: string) => {
    if (data && !qrLock.current) {
      qrLock.current = true;
      Vibration.vibrate();
      setScannedData(data);
      setTimeout(() => {
        qrLock.current = false; // Разблокировать сканирование
      }, 3000);
    }
  };

  const pickImage = async () => {
    // Запрос разрешения на доступ к фото
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access photos is required!");
      return;
    }

    // Запуск выбора изображения
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // Обработка результата
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setImage(uri);
      // Здесь можно добавить функцию для сканирования QR кода из изображения
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "QR Code Scanner",
          headerShown: false,
        }}
      />
      {Platform.OS === "android" ? <StatusBar hidden /> : null}
      
      {/* Компонент камеры */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => handleScan(data)}
      />
      
      {/* Подключаем оверлей */}
      <Overlay />

      {/* Отображение отсканированного текста */}
      {scannedData && (
        <View style={styles.textContainer}>
          <Text style={styles.scannedText}>{scannedData}</Text>
        </View>
      )}

      {/* Кнопка выбора изображения */}
      <Pressable style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageText}>Pick QR from Gallery</Text>
      </Pressable>
      
      {/* Футер с иконками */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    bottom: 81,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 4,
  },
  scannedText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  pickImageButton: {
    position: "absolute",
    bottom: 200,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  pickImageText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
 
});
