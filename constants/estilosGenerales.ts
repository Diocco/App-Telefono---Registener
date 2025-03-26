import { StyleSheet } from "react-native";
import { colores } from "./colores";

export const estilosGeneral = StyleSheet.create({
  inputGeneral: {
    fontSize: 20,
    padding: 10,
    backgroundColor: colores.input,
    borderRadius: 10,
    borderWidth: 0,
    marginTop: 15,
    color: colores.letra,
  },
  botonGeneral1: {
    backgroundColor: colores.boton,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
    marginHorizontal: 10,
    borderRadius: 6,
  },
  letraBoton1: {
    textAlign: "center",
    fontSize: 20,
    color: colores.letra,
  },
  botonGeneral2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colores.boton,
  },
  letraBoton2: {
    textAlign: "center",
    fontSize: 20,
    color: colores.boton,
  },
  encabezado: {
    height: 110,
    backgroundColor: colores.boton,
  },
  encabezado__boton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
  },
  fondoModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colores.fondoOscurecido,
  },
});
