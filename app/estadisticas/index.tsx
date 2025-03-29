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
  RefreshControl,
} from "react-native";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { obtenerFechaActual } from "../helpers/formatearFecha";
import { SwitchGeneral1 } from "@/components/tsx/switches";
import SelectorFecha from "@/components/tsx/selectorFecha";

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
  setEsVerConfiguracion,
}: {
  setEsVerConfiguracion: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario); // Obtiene los productos de la variable global
  const dispatch = useDispatch<AppDispatch>();
  const fechaDesde: Date = new Date(
    new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0), // La fecha desde que se buscan registros es el inicio del dia de hace 7 dias
  ); // La fecha de inicio se fija en el inicio del dia pero 7 dias atras del dia actual
  const fechaHasta: Date = new Date(
    new Date(new Date().setHours(23, 59, 59, 999)),
  );
  // const alternarEsAgruparCategoria = (estado: boolean) => {
  //   if (!estado) dispatch(filtrarProductos({ categoriasBuscadas: [] }));
  //   dispatch(modificarPreferencias({ esAgruparCategoria: estado }));
  // }; // Cada vez que el switch cambia se ejecuta el cambio en el estado global

  return (
    <View id="ventanaProductos__ventanaConfiguracion">
      <View id="ventanaProductos__ventanaConfiguracion-View">
        <SelectorFecha fecha={fechaDesde} />
        <SelectorFecha fecha={fechaHasta} />
        {/* <SwitchGeneral1
          titulo="Agrupar por categorias"
          onValueChange={alternarEsAgruparCategoria}
          valorInicial={usuario!.preferencias.esAgruparCategoria}
        />
        <SwitchGeneral1
          titulo="Agrupar por producto"
          onValueChange={() => {}}
          valorInicial={false}
        />
        <Pressable
          style={estilosGeneral.botonGeneral1}
          onPress={() => setEsVerConfiguracion(false)}
        >
          <Text style={estilosGeneral.letraBoton1}>Aceptar</Text>
        </Pressable> */}
      </View>
    </View>
  );
};

export default function VentanaVerProductoLayout() {
  const [refreshing, setRefreshing] = useState(false);
  const [esVerConfiguracion, setEsVerConfiguracion] = useState<boolean>(false);

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
      enabled: registros.length < 1 || refreshing, // Condicion para realizar la solicitud
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
                <FontAwesome name="gear" size={24} color="white" />
              </Pressable>
            );
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
});
