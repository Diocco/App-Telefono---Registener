import { BotonGeneral1 } from "@/components/tsx/botones";
import * as ImagePicker from "expo-image-picker";
import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { AppDispatch, RootState } from "@/redux/store";
import { eliminarTokenAcceso } from "@/redux/tokenSlice";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useRouter } from "expo-router";
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
import { useDispatch, useSelector } from "react-redux";
import SelectorFecha from "@/components/tsx/selectorFecha";
import { OpcionesFlotantes } from "@/components/tsx/opcionesFlotantes";
import { RegistroVenta } from ".";
import { useQuery } from "react-query";
import { verRegistroVentas } from "@/services/registroVentasAPI";
import { definirRegistroVentas } from "../../redux/registroVentasSlice";
import { RegistroVentaI } from "@/interfaces/registroVentas";

const estados = ["Exitoso", "Modificado", "Anulado"]; // Array con los tres estados posibles de los registros

const filtrarRegistros = ({
  fechaDesde,
  fechaHasta,
  estadosSeleccionados,
  registros,
}: {
  fechaDesde: Date;
  fechaHasta: Date;
  estadosSeleccionados: string[];
  registros: RegistroVentaI[];
}) => {
  // Realiza la nueva busqueda
  let registrosFiltrados: RegistroVentaI[] = [];

  registros.forEach((registro) => {
    const fecha = new Date(registro.fechaVenta);

    // Verifica las fechas y el estado del registro, si cumple con los filtros se lo agrega a los registros filtrados
    if (!(fecha > fechaDesde && fecha < fechaHasta)) return; // Verifica que este entre las fechas de filtro
    if (!estadosSeleccionados.includes(registro.estado)) return; // Verifica que el estado del registro pertenezca a los estados buscados

    registrosFiltrados.push(registro); // El registro paso los filtros por lo que es agregado a los registros filtrados
  });

  return registrosFiltrados;
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
  const [estadosSeleccionados, setEstadosSeleccionados] =
    useState<string[]>(estados);
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
  const registros = useSelector(
    (state: RootState) => state.registroVentas.registros,
  ); // Obtiene los registros de la variable global
  let registrosFiltrados = filtrarRegistros({
    fechaDesde,
    fechaHasta,
    estadosSeleccionados,
    registros,
  });
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  ); // Obtiene el token de acceso de la variable global

  const router = useRouter();

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
            return (
              <Pressable
                style={estilosGeneral.encabezado__boton}
                onPress={() => router.back()}
              >
                <Entypo name="chevron-left" size={40} color="white" />
              </Pressable>
            );
          },
          headerRight: () => {
            return (
              <Pressable
                style={estilosGeneral.encabezado__boton}
                onPress={() => {
                  setEsVerConfiguracion(true);
                }}
              >
                <FontAwesome name="filter" size={24} color="white" />
              </Pressable>
            );
          },
          headerTitleAlign: "center",
          headerTitle: "Registros",
        }}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
        data={registrosFiltrados}
        keyExtractor={(registro) =>
          registro!._id.toString() + new Date().getTime.toString()
        }
        renderItem={(registro) => <RegistroVenta registro={registro.item} />}
      />
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
