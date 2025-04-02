import { colores } from "@/constants/colores";
import { Stack } from "expo-router";

export default function VentanaVerProductoLayout() {
  return (
    <Stack screenOptions={{ animation: "slide_from_right" }}>
      <Stack.Screen
        name="index"
        options={{ headerStyle: { backgroundColor: colores.boton } }}
      />
      <Stack.Screen
        name="registros"
        options={{ headerStyle: { backgroundColor: colores.boton } }}
      />
    </Stack>
  );
}
