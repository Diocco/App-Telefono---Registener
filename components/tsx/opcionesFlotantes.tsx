import { colores } from "@/constants/colores";
import { produce } from "immer";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

const OpcionFlotante = ({
  opcion,
  opcionesElegidas,
  alternarOpcionElegida,
}: {
  opcion: string;
  opcionesElegidas: string[];
  alternarOpcionElegida: Function;
}) => {
  let esActivo: boolean = false;

  // Verifica si existen clases buscadas en este momento
  if (opcionesElegidas.length > 0)
    if (opcionesElegidas.includes(opcion)) {
      // Verifica si la clase actual forma parte de las clases buscadas
      esActivo = true;
    }

  return (
    <Pressable
      style={esActivo ? [estilos.opcionActive, estilos.opcion] : estilos.opcion}
      onPress={() => alternarOpcionElegida(opcion)}
    >
      <Text style={estilos.opcionText}>{opcion}</Text>
    </Pressable>
  );
};

export const OpcionesFlotantes = ({
  opciones,
  opcionesElegidas,
  setOpcionesElegidas,
}: {
  opciones: string[];
  opcionesElegidas: string[];
  setOpcionesElegidas: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const alternarOpcionElegida = (opcion: string) => {
    setOpcionesElegidas((opcionesElegidas) =>
      produce(opcionesElegidas, (draft) => {
        const index = opcionesElegidas.findIndex(
          (opcionBuscada) => opcionBuscada === opcion,
        );
        if (index === -1) {
          // Si la opcion no existe en las categorias filtradas entonces la agrega
          draft.push(opcion);
        } else {
          // Si existe lo elimina
          draft.splice(index, 1);
        }
      }),
    );
  };

  return (
    <ScrollView horizontal={true} style={estilos.contenedorOpciones}>
      {opciones.map((opcion) => (
        <OpcionFlotante
          key={opcion + "opcionFlotante"}
          opcion={opcion}
          alternarOpcionElegida={alternarOpcionElegida}
          opcionesElegidas={opcionesElegidas}
        />
      ))}
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  contenedorOpciones: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    maxHeight: 60,
  },
  opcion: {
    backgroundColor: colores.fondoElemento,
    padding: 10,
    margin: 5,
    borderRadius: 15,
    width: "auto",
    height: 50,
  },

  opcionActive: {
    borderWidth: 2,
    borderColor: "white",
  },
  opcionText: {
    color: colores.letra,
    fontSize: 20,
  },
});
