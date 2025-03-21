import { BotonGeneral1 } from "@/components/tsx/botones";
import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { AppDispatch } from "@/redux/store";
import { eliminarTokenAcceso } from "@/redux/tokenSlice";
import { Entypo } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Href, RelativePathString, Stack, useRouter } from "expo-router";
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
import { useDispatch } from "react-redux";

const Opcion = ({
  titulo,
  direccion = "/configuracion",
}: {
  titulo: string;
  direccion?: Href;
}) => {
  const esHabilitado: boolean = direccion !== "/configuracion" ? true : false;

  const router = useRouter();

  return (
    <>
      <Pressable
        style={estilos.opcion}
        onPress={() => router.push(direccion)}
        disabled={!esHabilitado}
      >
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
        <View style={estilos.contenedorOpciones}>
          <Text style={estilos.titulo}>Cuenta</Text>
          <Opcion titulo="Perfil" direccion="/configuracion/perfil" />
          <Opcion titulo="Notificaciones" />
          <Opcion titulo="Contraseña" />
        </View>
        <View style={estilos.contenedorOpciones}>
          <Text style={estilos.titulo}>Aplicacion</Text>
          <Opcion titulo="Tema" />
          <Opcion titulo="Idioma" />
          <Opcion titulo="Productos" />
        </View>
        <Pressable
          style={[
            estilosGeneral.botonGeneral2,
            { borderColor: colores.botonNegativo },
          ]}
          onPress={() => dispatch(eliminarTokenAcceso())}
        >
          <Text
            style={[
              estilosGeneral.letraBoton2,
              { color: colores.botonNegativo },
            ]}
          >
            Cerrar Sesion
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}
const estilos = StyleSheet.create({
  contenedorOpciones: {
    paddingVertical: 10,
  },
  opcion: {
    ...estilosGeneral.botonGeneral2,
    flexDirection: "row",
    borderWidth: 0,
    margin: 5,
    justifyContent: "space-between",
  },
  textoOpcion: {
    ...estilosGeneral.letraBoton1,
    borderWidth: 0,
    textAlign: "left",
  },
  titulo: {
    color: colores.letraSecundario,
    fontSize: 15,
    paddingLeft: 5,
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingBottom: 5,
    marginHorizontal: 7,
  },
});
