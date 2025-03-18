import { View, Text, StyleSheet, Pressable } from "react-native";

// import { VentanaProductos } from "./ventanaProductos";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

// Estilos globales
import { colores } from "../constants/colores";

// Iconos
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, Stack } from "expo-router";

const nombreIniciales = (nombre: string | undefined) => {
  if (!nombre) return "";
  const iniciales = nombre?.split(" ");
  if (iniciales.length > 1)
    return `${iniciales[0][0].toUpperCase()}${iniciales[1][0].toUpperCase()}`;
  else return `${nombre[0].toUpperCase()}${nombre[1].toUpperCase()}`;
};

export default function VentanaInicial() {
  const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario);

  const ResumenVentas = ({
    titulo,
    valor,
    porcentaje,
  }: {
    titulo: string;
    valor: number;
    porcentaje: number;
  }) => {
    const color = porcentaje > 0 ? "#007a00" : "red";

    return (
      <>
        <View style={estilos.ventanaInicial__resumen__contenedor}>
          <Text style={estilos.ventanaInicial__resumen__valor}>{valor}</Text>
          <AntDesign
            name={porcentaje > 0 ? "arrowup" : "arrowdown"}
            size={20}
            color={color}
          />
          <View style={estilos.ventanaInicial__resumen__tituloContenedor}>
            <Text style={estilos.ventanaInicial__resumen__titulo}>
              {titulo}
            </Text>
            <Text
              style={[
                estilos.ventanaInicial__resumen__porcentaje,
                { color: color },
              ]}
            >
              {`${porcentaje > 0 ? "+" : "-"}${porcentaje} %`}
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={estilos.ventanaInicial}>
      <View style={estilos.ventanaInicial__usuario}>
        <View style={estilos.ventanaInicial__usuario_imagen}>
          <Text style={estilos.ventanaInicial__usuario_sinImagen}>
            {nombreIniciales(usuario?.nombre)}
          </Text>
        </View>
        <Text style={estilos.ventanaInicial__usuario__nombre}>
          {usuario?.nombre}
        </Text>
      </View>
      <View style={estilos.ventanaInicial__resumen}>
        <ResumenVentas titulo={"Ventas"} valor={55} porcentaje={-5} />
        <ResumenVentas
          titulo={"Productos vendidos"}
          valor={55}
          porcentaje={2}
        />
        <View
          style={[estilos.ventanaInicial__resumen__contenedor, { width: 340 }]}
        >
          <Text
            style={[estilos.ventanaInicial__resumen__valor, { marginLeft: 50 }]}
          >
            $ 1.300.500
          </Text>
          <AntDesign name={"arrowup"} size={20} color={"green"} />
          <View
            style={[
              estilos.ventanaInicial__resumen__tituloContenedor,
              { width: 340, alignItems: "center" },
            ]}
          >
            <Text
              style={[
                estilos.ventanaInicial__resumen__titulo,
                { width: "auto" },
              ]}
            >
              {"Ingresos brutos"}
            </Text>
            <Text style={estilos.ventanaInicial__resumen__porcentaje}>
              +2,5 %
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  ventanaInicial: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    justifyContent: "space-between",
    zIndex: 100,
  },
  ventanaInicial__opciones: {
    flexDirection: "row",
    backgroundColor: colores.boton,
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderTopLeftRadius: 20,
    borderTopEndRadius: 20,
  },
  ventanaInicial__opciones__opcion: {
    flexDirection: "row",
    color: colores.letra,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
  },
  ventanaInicial__resumen: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
  },
  ventanaInicial__resumen__contenedor: {
    backgroundColor: colores.boton,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    paddingVertical: 20,
    width: 150,
    margin: 20,
    borderRadius: 10,
  },
  ventanaInicial__resumen__tituloContenedor: {
    width: 130,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
  },
  ventanaInicial__resumen__titulo: {
    textAlign: "center",
    color: colores.letraSecundario,
    fontSize: 12,
    width: 70,
  },
  ventanaInicial__resumen__valor: {
    color: colores.letra,
    fontSize: 35,
    marginLeft: 40,
    marginRight: 10,
  },
  ventanaInicial__resumen__flecha: {
    backgroundColor: "#deffde",
    borderRadius: 50,
  },
  ventanaInicial__resumen__porcentaje: {
    color: "green",
    marginLeft: 10,
  },
  ventanaInicial__usuario: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    fontSize: 30, // Se usa número en vez de "30px"
    textAlign: "center",
    marginTop: 50,
  },
  ventanaInicial__usuario_imagen: {
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
  ventanaInicial__usuario_sinImagen: {
    color: colores.letra,
    fontSize: 30,
  },
  ventanaInicial__usuario__nombre: {
    color: colores.letra,
    fontSize: 30,
  },
});
