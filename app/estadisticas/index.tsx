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
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { obtenerFechaActual } from "../../helpers/formatearFecha";
import { SwitchGeneral1 } from "@/components/tsx/switches";

// Graficos
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";

const estados = ["Exitoso", "Modificado", "Anulado"]; // Array con los tres estados posibles de los registros

export const RegistroVenta = ({ registro }: { registro: RegistroVentaI }) => {
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

export default function VentanaVerProductoLayout() {
  const [esSemanaAnterior, setEsSemanaAnterior] = useState(false);

  const registros = useSelector(
    (state: RootState) => state.registroVentas.registros,
  ); // Obtiene los registros de la variable global
  const ventasProductosSemanales = useSelector(
    (state: RootState) => state.registroVentas.montoVentasPorDia,
  ); // Obtiene los registros de montos de venta semanal de la variable global
  const ventasProductosSemanalesAnterior = useSelector(
    (state: RootState) => state.registroVentas.montoVentasPorDiaAnterior,
  ); // Obtiene los registros de montos de venta semanal de la variable global

  const router = useRouter();

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
      <ScrollView style={estilos.contenedorSeccion}>
        <Pressable
          style={estilos.seccion}
          onPress={() => router.push("/estadisticas/registros")}
        >
          <Text style={estilosGeneral.titulo}>Registros</Text>
          <RegistroVenta
            registro={registros[0]}
            key={registros[0]._id.toString() + new Date().getTime.toString()}
          />
          <RegistroVenta
            registro={registros[1]}
            key={registros[1]._id.toString() + new Date().getTime.toString()}
          />
          <RegistroVenta
            registro={registros[2]}
            key={registros[2]._id.toString() + new Date().getTime.toString()}
          />
        </Pressable>
        <View style={estilos.seccion}>
          <View style={estilos.contenedorTitulo}>
            <Text style={estilosGeneral.titulo}>Ventas semanales</Text>
            <Pressable
              style={[
                estilosGeneral.botonGeneral3,
                [
                  !esSemanaAnterior && {
                    backgroundColor: colores.fondoOscurecido,
                  },
                ],
              ]}
              onPress={() => {
                setEsSemanaAnterior(true);
              }}
              disabled={esSemanaAnterior}
            >
              <Entypo name="chevron-left" size={24} color="white" />
            </Pressable>
            <Pressable
              style={[
                estilosGeneral.botonGeneral3,
                [
                  esSemanaAnterior && {
                    backgroundColor: colores.fondoOscurecido,
                  },
                ],
              ]}
              onPress={() => {
                setEsSemanaAnterior(false);
              }}
              disabled={!esSemanaAnterior}
            >
              <Entypo name="chevron-right" size={24} color="white" />
            </Pressable>
          </View>
          <LineChart
            data={{
              labels: ["D", "L", "M", "M", "J", "V", "S"],
              datasets: [
                {
                  data: esSemanaAnterior
                    ? [...ventasProductosSemanalesAnterior]
                    : [...ventasProductosSemanales],
                },
              ],
            }}
            width={Dimensions.get("window").width - 30}
            height={220}
            yAxisSuffix="k"
            yAxisInterval={2} // optional, defaults to 1
            chartConfig={{
              backgroundColor: colores.fondoElemento,
              backgroundGradientFrom: colores.fondoElemento,
              backgroundGradientTo: colores.fondoElemento,
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "7",
                strokeWidth: "5",
                stroke: colores.boton,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
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
  contenedorSeccion: {
    backgroundColor: colores.fondo,
    flex: 1,
    padding: 10,
  },
  seccion: {
    height: 300,
    padding: 5,
    borderRadius: 10,
    backgroundColor: colores.input,
    marginBottom: 10,
  },
  contenedorTitulo: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});
