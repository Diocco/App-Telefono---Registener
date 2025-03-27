import { BotonGeneral1 } from "@/components/tsx/botones";
import { ErrorCarga } from "@/components/tsx/errorCarga";
import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { RegistroVentaI } from "@/interfaces/registroVentas";
import { definirRegistroVentas } from "@/redux/registroVentasSlice";
import { RootState } from "@/redux/store";
import { verRegistroVentas } from "@/services/registroVentasAPI";
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
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { obtenerFechaActual } from "../helpers/formatearFecha";

const RegistroVenta = ({ registro }: { registro: RegistroVentaI }) => {
  return (
    <View style={estilos.contenedorRegistro}>
      <View style={estilos.registroFila}>
        <Text style={estilos.nombre}>{registro.etiqueta}</Text>
        <Text style={estilos.precio}>
          {"$ " + Number(registro.total).toLocaleString("es-AR")}
        </Text>
      </View>
      <View style={estilos.registroFila}>
        <Text style={estilos.fecha}>
          {obtenerFechaActual(registro.fechaVenta)}
        </Text>
        {registro.estado === "Exitoso" && (
          <Text style={estilos.estadoExitoso}>Exitoso</Text>
        )}
      </View>
    </View>
  );
};

export default function VentanaVerProductoLayout() {
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  ); // Obtiene los productos de la variable global
  const registros = useSelector(
    (state: RootState) => state.registroVentas.registros,
  ); // Obtiene los productos de la variable global
  const dispatch = useDispatch();

  const { isError, isLoading } = useQuery(
    "registroVentas",
    () => verRegistroVentas({ tokenAcceso }),
    {
      enabled: registros.length < 1, // Condicion para realizar la solicitud
      onSuccess: (data) => {
        dispatch(definirRegistroVentas(data.registroVentas)); // Almacena los productos como variable global
      },
    },
  );

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
      <View style={{ backgroundColor: colores.fondo, flex: 1 }}>
        {isLoading && (
          <ActivityIndicator
            size={"large"}
            color={"white"}
            style={{ flex: 1 }}
          />
        )}
        {isError && (
          <ErrorCarga mensaje="Error al cargar los productos, porfavor reinicie" />
        )}
        <FlatList
          data={registros}
          keyExtractor={(registro) =>
            registro!._id.toString() + new Date().getTime.toString()
          }
          renderItem={(registro) => <RegistroVenta registro={registro.item} />}
        />
      </View>
    </>
  );
}
const estilos = StyleSheet.create({
  contenedorRegistro: {
    flex: 1,
    height: 76,
    paddingVertical: 2,
    margin: 4,
    backgroundColor: colores.fondoElemento,
  },
  registroFila: {
    flex: 1,
    flexDirection: "row",
    height: 36,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  nombre: {
    color: colores.letra,
    fontSize: 25,
  },
  fecha: {
    fontSize: 15,
    color: colores.letraSecundario,
  },
  precio: {
    color: colores.letra,
    alignSelf: "baseline",
    fontSize: 25,
  },
  estadoExitoso: {
    color: colores.letra,
    backgroundColor: colores.botonPositivo,
    padding: 5,
    fontSize: 15,
    borderRadius: 2,
    width: "auto",
    height: "auto",
  },
});
