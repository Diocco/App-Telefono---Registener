// import '../src/css/index.css'
import IniciarSesion from "./iniciarSesion";
import VentanaInicial from "./ventanaInicial";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { mostrarMensaje, ocultarMensaje } from "../redux/mensajeEmergenteSlice";
import { useEffect, useState } from "react";
import { solicitudUsuarioVerificado } from "../services/usuariosAPI";
import { definirUsuario, eliminarTokenAcceso } from "../redux/tokenSlice";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";

// Iconos
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";

// Variables
import { colores } from "../constants/colores";
import VentanaProductos from "./ventanaProductos/ventanaProductos";
import { Link, useRouter } from "expo-router";

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
  const [ventanaActiva, setVentanaActiva] = useState<string>("inicial");
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  );
  const esMensajeEmergente = useSelector(
    (state: RootState) => state.mensajeEmergente.esActivo,
  );
  const [esDesvanecer, setEsDesvanecer] = useState(false);
  const [esCargando, setEsCargando] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  const [esTransicion, setEsTransicion] = useState<boolean>(false); // Indica a la ventana que tiene que hacer la animacion de desaparecer
  const volverVentanaInicial = () => {
    setEsTransicion(true); // Indica a cualquier ventana activa que tiene que comenzar a hacer la animacion de desaparecer
    setTimeout(() => {
      setVentanaActiva("inicial"); // Desactiva todas las ventanas activas
      setEsTransicion(false); // Finaliza la animacion de desaparecer
    }, 180);
  };

  const cerrarSesion = () => {
    dispatch(eliminarTokenAcceso());
    setVentanaActiva("inicial");
    setEsTransicion(false);
  };

  useEffect(() => {
    if (!tokenAcceso) {
      // Si no existe el token entonces manda al usuario al inicio de sesion
      setEsCargando(false);
      return;
    }

    // Si existe un token entonces lo verifica
    solicitudUsuarioVerificado(tokenAcceso) // Verifica el usuario en la base de datos
      .then((data) => {
        dispatch(definirUsuario(data.usuarioVerificado)); // Define el usuario en la variable global
      })
      .catch(() => {
        dispatch(eliminarTokenAcceso());
        dispatch(
          mostrarMensaje({ mensaje: "Sesion ha caducado", esError: true }),
        ); // Si el token no es valido reedirije al usuario al inicio de sesion
      })
      .finally(() => {
        setEsDesvanecer(true);
        setEsCargando(false);
        setTimeout(() => {
          setEsDesvanecer(false);
        }, 180);
      });
  }, []);

  return (
    <>
      {(esCargando || esDesvanecer) && (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      {!esCargando && (
        <>
          {esMensajeEmergente && <MensajeEmergente />}
          {}
          {!tokenAcceso ? (
            <IniciarSesion />
          ) : (
            <>
              <VentanaInicial />
            </>
          )}
        </>
      )}
    </>
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
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    borderTopLeftRadius: 20,
    borderTopEndRadius: 20,
  },
  ventanaInicial__opciones__opcion: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
  },
});
