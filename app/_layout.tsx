import { StrictMode } from "react";
import { Provider as ProviderRedux, useDispatch } from "react-redux";
import store, { AppDispatch } from "../redux/store"; // Se importa la store con todas las variables globales para envolver la aplicacion con un provider que tiene la store
import { QueryClient, QueryClientProvider } from "react-query";

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
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";

// Variables
import { colores } from "../constants/colores";
import { IniciarSesion } from "./iniciarSesion";
import { useSelector } from "react-redux";
import { estilosGeneral } from "@/constants/estilosGenerales";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { solicitudUsuarioVerificado } from "@/services/usuariosAPI";
import { definirUsuario, eliminarTokenAcceso } from "@/redux/tokenSlice";
import { mostrarMensaje } from "@/redux/mensajeEmergenteSlice";
import { verRegistroVentas } from "@/services/registroVentasAPI";
import { definirRegistroVentas } from "@/redux/registroVentasSlice";

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

  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!tokenAcceso) {
      // Si no existe el token, elimina el token guardado y muestra el mensaje
      dispatch(eliminarTokenAcceso());
      dispatch(
        mostrarMensaje({ mensaje: "Sesión ha caducado", esError: true }),
      );
      return;
    }

    // Realizar ambas solicitudes en paralelo
    solicitudUsuarioVerificado(tokenAcceso)
      .then((data) => {
        dispatch(definirUsuario(data.usuarioVerificado)); // Actualiza el usuario
      })
      .catch(() => {
        dispatch(eliminarTokenAcceso());
        dispatch(
          mostrarMensaje({ mensaje: "Sesión ha caducado", esError: true }),
        );
      });
    verRegistroVentas({
      tokenAcceso,
      fechaDesde: new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)).setHours(
          0,
          0,
          0,
          0,
        ),
      ),
      fechaHasta: new Date(new Date(new Date().setHours(23, 59, 59, 999))),
    })
      .then((data) => {
        dispatch(definirRegistroVentas(data.registroVentas)); // Actualiza el registro de ventas
      })
      .catch((error) => {
        console.error("Error al obtener registros de ventas:", error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenAcceso]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {!tokenAcceso ? (
        <IniciarSesion />
      ) : (
        <>
          <Tabs
            screenOptions={{
              // Aplica los estilos a toda la barra
              tabBarShowLabel: true,
              headerShown: false,
              headerStyle: estilosGeneral.encabezado,
              tabBarStyle: {
                backgroundColor: colores.fondo,
                height: 80,
                paddingTop: 10,
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                tabBarIconStyle: {
                  // Aplica los estilos al icono
                  height: 50,
                  width: 50,
                },
                title: "",
                tabBarIcon: ({ focused }) => {
                  // Pasa el icono
                  return (
                    <Entypo
                      name="home"
                      size={40}
                      color={focused ? colores.boton : colores.letraSecundario}
                    />
                  );
                },
              }}
            />
            <Tabs.Screen
              name="ventanaProductos"
              options={{
                tabBarIconStyle: {
                  height: 50,
                  width: 50,
                },
                title: "",
                tabBarIcon: ({ focused }) => {
                  return (
                    <AntDesign
                      name="bars"
                      size={40}
                      color={focused ? colores.boton : colores.letraSecundario}
                    />
                  );
                },
              }}
            />
            <Tabs.Screen
              name="estadisticas"
              options={{
                tabBarIconStyle: {
                  height: 50,
                  width: 50,
                },
                title: "",
                tabBarIcon: ({ focused }) => {
                  return (
                    <Ionicons
                      name="stats-chart"
                      size={40}
                      color={focused ? colores.boton : colores.letraSecundario}
                    />
                  );
                },
              }}
            />
            <Tabs.Screen
              name="configuracion"
              options={{
                tabBarIconStyle: {
                  height: 50,
                  width: 50,
                },
                title: "",
                tabBarIcon: ({ focused }) => {
                  return (
                    <FontAwesome
                      name="gear"
                      size={40}
                      color={focused ? colores.boton : colores.letraSecundario}
                    />
                  );
                },
              }}
            />
          </Tabs>
        </>
      )}

      <StatusBar style="light" />
    </ThemeProvider>
  );
}
