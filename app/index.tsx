import React, { useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Link, Stack } from "expo-router";
import { useCameraPermissions } from "expo-camera";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  useEffect(() => {
    if (!isPermissionGranted) {
      requestPermission();
    }
  }, [isPermissionGranted]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Text style={styles.title}>BookShow Online!</Text>
      <View style={styles.scanButton}>
        <Link href={"/scanner"} asChild>
          <Text style={styles.buttonText}>
            Scan QR Code
          </Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "white",
    fontSize: 40,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
