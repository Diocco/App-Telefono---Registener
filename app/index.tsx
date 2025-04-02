// import '../src/css/index.css'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { mostrarMensaje, ocultarMensaje } from "../redux/mensajeEmergenteSlice";
import { useEffect } from "react";
import { solicitudUsuarioVerificado } from "../services/usuariosAPI";
import { definirUsuario, eliminarTokenAcceso } from "../redux/tokenSlice";
import { Modal, View, Text, StyleSheet } from "react-native";

// Iconos
import AntDesign from "@expo/vector-icons/AntDesign";

// Variables
import { colores } from "../constants/colores";
import { nombreIniciales } from "./helpers/letrasIniciales";

function VentanaInicial() {
  const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario);
  const montoVentaSemanal = useSelector(
    (state: RootState) => state.registroVentas.ingresoSemanal,
  ); // Obtiene los registros de la variable global
  const montoVentaSemanalAnterior = useSelector(
    (state: RootState) => state.registroVentas.ingresoSemanalAnterior,
  ); // Obtiene los registros de la variable global
  const ventasCantidad = useSelector(
    (state: RootState) => state.registroVentas.ventas,
  ); // Obtiene los registros de la variable global
  const ventasCantidadAnterior = useSelector(
    (state: RootState) => state.registroVentas.ventasAnterior,
  ); // Obtiene los registros de la variable global
  const productosVendidos = useSelector(
    (state: RootState) => state.registroVentas.productosVendidos,
  );
  const productosVendidosAnterior = useSelector(
    (state: RootState) => state.registroVentas.productosVendidosAnterior,
  );

  const ResumenVentas = ({
    titulo,
    valor,
    porcentaje,
    esMonto = false,
  }: {
    titulo: string;
    valor: number;
    porcentaje: number;
    esMonto?: boolean;
  }) => {
    const color = porcentaje > 0 ? "#007a00" : "red";
    return (
      <>
        <View
          style={[
            estilos.ventanaInicial__resumen__contenedor,
            [esMonto && { width: 340 }],
          ]}
        >
          <View style={estilos.ventanaInicial__resumen__tituloContenedor}>
            {esMonto ? (
              <Text style={estilos.ventanaInicial__resumen__valor}>
                {montoVentaSemanal > 0 ? "$ " : "- $ "}
                {Math.abs(montoVentaSemanal * 1000).toLocaleString("es-AR")}
              </Text>
            ) : (
              <Text style={estilos.ventanaInicial__resumen__valor}>
                {valor}
              </Text>
            )}

            {isFinite(porcentaje) && (
              <AntDesign
                name={porcentaje > 0 ? "arrowup" : "arrowdown"}
                size={20}
                color={color}
              />
            )}
          </View>
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
              {isFinite(porcentaje) &&
                `${porcentaje > 0 ? "+" : "-"}${porcentaje.toFixed(1)} %`}
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
        <ResumenVentas
          titulo={"Ventas"}
          valor={ventasCantidad}
          porcentaje={(ventasCantidad / ventasCantidadAnterior - 1) * 100}
        />
        <ResumenVentas
          titulo={"Productos vendidos"}
          valor={productosVendidos}
          porcentaje={(productosVendidos / productosVendidosAnterior - 1) * 100}
        />
        <ResumenVentas
          titulo={"Ingresos brutos"}
          valor={Math.abs(montoVentaSemanal * 1000)}
          porcentaje={(montoVentaSemanal / montoVentaSemanalAnterior - 1) * 100}
          esMonto={true}
        />
      </View>
    </View>
  );
}

const MensajeEmergente = () => {
  const mensaje = useSelector(
    (state: RootState) => state.mensajeEmergente.mensaje,
  );
  const esError = useSelector(
    (state: RootState) => state.mensajeEmergente.esError,
  );
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      {
        <Modal
          id="mensajeEmergente"
          onTouchStart={() => dispatch(ocultarMensaje())}
          className={esError ? "mensajeEmergente-enError" : ""}
        >
          <Text>{mensaje}</Text>
        </Modal>
      }
    </>
  );
};

export default function App() {
  const esMensajeEmergente = useSelector(
    (state: RootState) => state.mensajeEmergente.esActivo,
  );

  return (
    <>
      {esMensajeEmergente && <MensajeEmergente />}
      <VentanaInicial />
    </>
  );
}

const estilos = StyleSheet.create({
  ventanaInicial: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    zIndex: 100,
    justifyContent: "center",
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
    flexBasis: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  ventanaInicial__resumen__titulo: {
    maxWidth: 100,
    textAlign: "center",
    color: colores.letraSecundario,
    fontSize: 12,
  },
  ventanaInicial__resumen__valor: {
    color: colores.letra,
    fontSize: 35,
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
  ventanaInicial__resumen__porcentajeNegativo: {
    color: "red",
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
