import { Stack } from "expo-router";
import { Footer } from "./components/footer"; // Импортируем футер
import { View, StyleSheet } from "react-native"; // Для создания контейнера

export default function Layout() {
  return (
    <View style={styles.container}>
      {/* Stack для управления страницами */}
      <Stack />
      
      {/* Глобальный футер */}
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
