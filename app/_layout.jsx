import { Slot, SplashScreen, useRouter, useSegments } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"
import SafeScreen from "../components/SafeScreen"
import { StatusBar } from "expo-status-bar"
import { useAuthStore } from "../store/authStore"
import { useEffect, useState } from "react"
import { useFonts } from "expo-font"

SplashScreen.preventAutoHideAsync ()

export default function RootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const { checkAuth, token, user } = useAuthStore()
  const [isReady, setIsReady] = useState(false)

  const loadedF = useFonts ({
    "JetBrainsMono-Medium": require ("../assets/fonts/JetBrainsMono-Medium.ttf")
  })
  useEffect (() => {
    if (loadedF) SplashScreen.hideAsync ()
  }, [loadedF])

  useEffect(() => {
    const init = async () => {
      await checkAuth()
      setIsReady(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!isReady) return

    const inAuthScreen = segments[0] === "(auth)"
    const isLoggedIn = user && token

    if (!isLoggedIn && !inAuthScreen) router.replace("/(auth)")
    else if (isLoggedIn && inAuthScreen) router.replace("/(tabs)")
  }, [user, token, segments, isReady])

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Slot />
      </SafeScreen>
      <StatusBar style="light" />
    </SafeAreaProvider>
  )
}
