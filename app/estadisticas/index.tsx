import { BotonGeneral1 } from "@/components/tsx/botones";
import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { Entypo } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack } from "expo-router";
import { useState } from "react";
import {
  Text,
  SectionList,
  ActivityIndicator,
  View,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";

export default function VentanaVerProductoLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return <></>;
          },
          headerTitleAlign: "center",
          headerTitle: "Estadisticas",
        }}
      />
      <Text>Hola mundo</Text>
    </>
  );
}
const estilos = StyleSheet.create({
});
