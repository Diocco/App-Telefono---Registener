import { StyleSheet } from "react-native";
import { colores } from "./colores";

export const estilosGeneral = StyleSheet.create({
  inputGeneral: {
    fontSize: 20,
    padding: 10,
    backgroundColor: "#383838",
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
    flexDirection: "row",
    width: "auto",
    height: 80,
    backgroundColor: colores.boton,
    borderStartEndRadius: 20,
    borderEndEndRadius: 20,
  },
});
