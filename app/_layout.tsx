import { StrictMode } from "react";
import { Provider as ProviderRedux } from "react-redux";
import store from "../redux/store"; // Se importa la store con todas las variables globales para envolver la aplicacion con un provider que tiene la store
import { QueryClient, QueryClientProvider } from "react-query";
import { Slot } from "expo-router";

import { RootState } from "../redux/store"; // Se importa la store con todas las variables globales para envolver la aplicacion con un provider que tiene la store

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Iconos
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";

// Variables
import { colores } from "../constants/colores";
import IniciarSesion from "./iniciarSesion";
import { useSelector } from "react-redux";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Si _layout.tsx se carga fuera del Provider, envolvémoslo aquí
  return (
    <StrictMode>
      <ProviderRedux store={store}>
        <QueryClientProvider client={new QueryClient()}>
          <LayoutContent />
        </QueryClientProvider>
      </ProviderRedux>
    </StrictMode>
  );
}

function LayoutContent() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  );
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {!tokenAcceso ? (
        <IniciarSesion />
      ) : (
        <>
          <Tabs
            screenOptions={{
              tabBarStyle: {
                backgroundColor: colores.fondo,
                height: 100,
                paddingTop: 25, // Aplica padding en la parte superior // Estilo común de fondo para todas las pestañas
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                title: "",
                tabBarIcon: ({ focused }) => {
                  return (
                    <Entypo
                      name="home"
                      size={30}
                      color={focused ? colores.boton : colores.letraSecundario}
                    />
                  );
                },
              }}
            />
            <Tabs.Screen
              name="ventanaProductos"
              options={{
                title: "",
                tabBarIcon: ({ focused }) => {
                  return (
                    <Ionicons
                      name="stats-chart"
                      size={30}
                      color={focused ? colores.boton : colores.letraSecundario}
                    />
                  );
                },
              }}
            />
          </Tabs>
        </>
      )}

      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
