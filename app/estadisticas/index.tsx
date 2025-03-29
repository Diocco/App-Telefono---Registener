import { BotonGeneral1 } from "@/components/tsx/botones";
import { ErrorCarga } from "@/components/tsx/errorCarga";
import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { RegistroVentaI } from "@/interfaces/registroVentas";
import { definirRegistroVentas } from "@/redux/registroVentasSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { verRegistroVentas } from "@/services/registroVentasAPI";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
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
  RefreshControl,
} from "react-native";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { obtenerFechaActual } from "../helpers/formatearFecha";
import { SwitchGeneral1 } from "@/components/tsx/switches";
import SelectorFecha from "@/components/tsx/selectorFecha";
import { OpcionesFlotantes } from "@/components/tsx/opcionesFlotantes";

const estados = ["Exitoso", "Modificado", "Anulado"]; // Array con los tres estados posibles de los registros

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
        {registro.estado === "Anulado" && (
          <Text style={estilos.estadoAnulado}>Anulado</Text>
        )}
        {registro.estado === "Modificado" && (
          <Text style={estilos.estadoModificado}>Modificado</Text>
        )}
      </View>
    </View>
  );
};

const VentanaConfiguracionProductos = ({
  estadosSeleccionados,
  setEstadosSeleccionados,
  setEsVerConfiguracion,
  fechaDesde,
  setFechaDesde,
  fechaHasta,
  setFechaHasta,
}: {
  estadosSeleccionados: string[];
  setEstadosSeleccionados: React.Dispatch<React.SetStateAction<string[]>>;
  setEsVerConfiguracion: React.Dispatch<React.SetStateAction<boolean>>;
  fechaDesde: Date;
  setFechaDesde: React.Dispatch<React.SetStateAction<Date>>;
  fechaHasta: Date;
  setFechaHasta: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario); // Obtiene los productos de la variable global

  // const alternarEsAgruparCategoria = (estado: boolean) => {
  //   if (!estado) dispatch(filtrarProductos({ categoriasBuscadas: [] }));
  //   dispatch(modificarPreferencias({ esAgruparCategoria: estado }));
  // }; // Cada vez que el switch cambia se ejecuta el cambio en el estado global

  return (
    <View>
      <Text style={estilos.tituloFiltro}>Estados: </Text>
      <OpcionesFlotantes
        opciones={estados}
        opcionesElegidas={estadosSeleccionados}
        setOpcionesElegidas={setEstadosSeleccionados}
      />
      <View style={estilos.ventanaConfiguracion__contenedorFechas}>
        <View>
          <Text style={estilos.tituloFiltro}>Desde: </Text>
          <SelectorFecha date={fechaDesde} setDate={setFechaDesde} />
        </View>
        <View>
          <Text style={estilos.tituloFiltro}>Hasta: </Text>
          <SelectorFecha date={fechaHasta} setDate={setFechaHasta} />
        </View>
      </View>
    </View>
  );
};

export default function VentanaVerProductoLayout() {
  const [refreshing, setRefreshing] = useState(false);
  const [esVerConfiguracion, setEsVerConfiguracion] = useState<boolean>(false);
  const [fechaDesde, setFechaDesde] = useState<Date>( // La fecha desde que se buscan registros es el inicio del dia de hace 7 dias
    new Date(
      new Date(new Date().setDate(new Date().getDate() - 7)).setHours(
        0,
        0,
        0,
        0,
      ),
    ),
  );
  const [fechaHasta, setFechaHasta] = useState<Date>( // La fecha de hasta es el final del presente dia
    new Date(new Date(new Date().setHours(23, 59, 59, 999))),
  );
  const [estadosSeleccionados, setEstadosSeleccionados] =
    useState<string[]>(estados);

  useEffect(
    () => setRefreshing(true),
    [fechaDesde, fechaHasta, estadosSeleccionados],
  ); // Cada vez que se cambia las fechas de filtro de debe volver a realizar el fetch

  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  ); // Obtiene los productos de la variable global
  const registros = useSelector(
    (state: RootState) => state.registroVentas.registros,
  ); // Obtiene los productos de la variable global
  const dispatch = useDispatch();

  useQuery(
    "registroVentas",
    () =>
      verRegistroVentas({
        tokenAcceso,
        fechaDesde,
        fechaHasta,
        estados: estadosSeleccionados.join(","),
      }),
    {
      enabled: refreshing, // Condicion para realizar la solicitud
      onSuccess: (data) => {
        setRefreshing(false);
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
          headerRight: () => {
            return (
              <Pressable
                style={estilosGeneral.encabezado__boton}
                onPress={() => {
                  setEsVerConfiguracion(true);
                }}
              >
                <FontAwesome name="filter" size={30} color="white" />
              </Pressable>
            );
          },
          headerTitleAlign: "center",
          headerTitle: "Estadisticas",
        }}
      />
      <View style={{ backgroundColor: colores.fondo, flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(true)}
            />
          }
          data={registros}
          keyExtractor={(registro) =>
            registro!._id.toString() + new Date().getTime.toString()
          }
          renderItem={(registro) => <RegistroVenta registro={registro.item} />}
        />
      </View>
      <Modal
        visible={esVerConfiguracion}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEsVerConfiguracion(false)}
      >
        <Pressable
          style={estilosGeneral.fondoModal}
          onPress={() => setEsVerConfiguracion(false)}
        >
          <View style={estilos.modalConfiguracion}>
            <VentanaConfiguracionProductos
              estadosSeleccionados={estadosSeleccionados}
              setEstadosSeleccionados={setEstadosSeleccionados}
              fechaDesde={fechaDesde}
              fechaHasta={fechaHasta}
              setFechaDesde={setFechaDesde}
              setFechaHasta={setFechaHasta}
              setEsVerConfiguracion={setEsVerConfiguracion}
            />
          </View>
        </Pressable>
      </Modal>
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
  estadoAnulado: {
    color: colores.letra,
    backgroundColor: colores.botonNegativo,
    padding: 5,
    fontSize: 15,
    borderRadius: 2,
    width: "auto",
    height: "auto",
  },
  estadoModificado: {
    color: colores.letra,
    backgroundColor: colores.botonAdvertencia,
    padding: 5,
    fontSize: 15,
    borderRadius: 2,
    width: "auto",
    height: "auto",
  },
  modalConfiguracion: {
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
    width: "auto",
    height: "auto",
    borderRadius: 10,
    padding: 20,
    backgroundColor: colores.fondo,
    zIndex: 230,
  },
  tituloFiltro: {
    color: colores.letraSecundario,
    marginTop: 15,
  },
  ventanaConfiguracion__contenedorFechas: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
