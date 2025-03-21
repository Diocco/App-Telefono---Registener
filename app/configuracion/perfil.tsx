import { BotonGeneral1 } from "@/components/tsx/botones";
import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { AppDispatch, RootState } from "@/redux/store";
import { eliminarTokenAcceso } from "@/redux/tokenSlice";
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
import { useDispatch, useSelector } from "react-redux";
import { nombreIniciales } from "../helpers/letrasIniciales";

const Opcion = ({
  titulo,
  onPress,
}: {
  titulo: string;
  onPress?: Function;
}) => {
  const esHabilitado: boolean = onPress ? true : false;
  if (!esHabilitado) onPress = () => {};

  return (
    <>
      <Pressable style={estilos.opcion} onPress={() => onPress!()}>
        <Text
          style={[
            estilos.textoOpcion,
            !esHabilitado && { color: "gray" }, // Si es false, agrega el color gris
          ]}
        >
          {titulo}
        </Text>
        <Entypo name="chevron-right" size={30} color="gray" />
      </Pressable>
    </>
  );
};

export default function VentanaVerProductoLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return <></>;
          },
          headerTitleAlign: "center",
          headerTitle: "Configuracion",
        }}
      />
      <ScrollView>
        <View style={estilos.usuario}>
          <View style={estilos.usuario_imagen}>
            <Text style={estilos.usuario_sinImagen}>
              {nombreIniciales(usuario?.nombre)}
            </Text>
            <Entypo
              style={estilos.usuario_imagenIcono}
              name="camera"
              size={24}
              color="white"
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const estilos = StyleSheet.create({
  usuario: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    fontSize: 30, // Se usa número en vez de "30px"
    textAlign: "center",
    marginTop: 50,
  },
  usuario_imagen: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.fondoElemento, // Reemplaza con el color real
    borderRadius: 50, // 100% en CSS se reemplaza con la mitad del width/height
    width: 100,
    height: 100,
    fontSize: 40,
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 20,
  },
  usuario_sinImagen: {
    color: colores.letra,
    fontSize: 30,
  },
  usuario__nombre: {
    color: colores.letra,
    fontSize: 30,
  },
  usuario_imagenIcono: {
    borderWidth: 2,
    borderColor: "white",
    padding: 5,
    borderRadius: 100,
    position: "absolute",
    backgroundColor: colores.fondoElemento,
    bottom: 1,
    right: 1,
  },
});
