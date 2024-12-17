import { useEffect, useRef } from "react";
import { CameraView, } from "expo-camera";
import { Link, Stack, useRouter } from "expo-router";
import {
  AppState,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Overlay } from "./Overlay";

export default function Home() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  const router = useRouter();

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

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Scanner",
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
            setTimeout(() => {
              console.log("Scanned:", data);
              const parts = data.split("/");
              const orderId = parts[parts.length - 1];
              router.push(`/show-details?orderId=${orderId}`)
            }, 500);
          }
        }}
      />
      <Overlay />
      <View style={styles.cancelButtonContainer}>
        <Link href={"/"} asChild>
          <Pressable>
            <Text style={styles.buttonStyle}>
              Cancel
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    color: '#007AFF',
    fontSize: 16,
    marginLeft: 10,
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonStyle: {
    backgroundColor: 'red',
    paddingHorizontal: 30,
    color: "white",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 100,
    fontSize: 16,
    fontWeight: 'bold',
  },
});