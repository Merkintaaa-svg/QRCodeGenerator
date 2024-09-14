import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { FontAwesome } from '@expo/vector-icons'; // Для иконок

export const Footer = () => {
  const pathname = usePathname(); // Получаем текущий путь

  return (
    <View style={styles.footer}>
      {/* Иконка камеры */}
      <Link href="/" asChild>
        <Pressable style={styles.iconContainer}>
          <FontAwesome 
            name="camera" 
            size={pathname === "/" ? 40 : 30} // Если на главной, размер больше
            color="white" 
          />
        </Pressable>
      </Link>
      
      {/* Иконка QR кода */}
      <Link href="/backend/generator/QRCodeGenerator" asChild>
        <Pressable style={styles.iconContainer}>
          <FontAwesome 
            name="qrcode" 
            size={pathname === "/backend/generator/QRCodeGenerator" ? 50 : 40} // Если на странице генератора, размер больше
            color="white" 
          />
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.38)",
    paddingVertical: 25,
    paddingHorizontal: 30,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
