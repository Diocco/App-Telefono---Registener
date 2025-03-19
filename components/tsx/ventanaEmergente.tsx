import { colores } from "@/constants/colores";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { Modal, Pressable, View, StyleSheet, Text } from "react-native";

export const VentanaEmergente = ({
  visible,
  mensaje,
  funcionAceptar,
  funcionAceptarParams,
  funcionRechazar,
  funcionRechazarParams,
}: {
  visible: boolean;
  mensaje: string;
  funcionAceptar: Function;
  funcionAceptarParams: any;
  funcionRechazar: Function;
  funcionRechazarParams: any;
}) => {
  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => funcionRechazar(funcionRechazarParams)}
      >
        <Pressable
          style={estilosGeneral.fondoModal}
          onPress={() => funcionRechazar(funcionRechazarParams)}
        >
          <View style={estilos.ventanaEmergente}>
            <Text style={estilos.ventanaEmergente__titulo}>{mensaje}</Text>
            <View style={estilos.ventanaEmergente__botones}>
              <Pressable
                style={estilosGeneral.botonGeneral1}
                onPress={() => {
                  funcionAceptar(funcionAceptarParams);
                }}
              >
                <Text style={estilosGeneral.letraBoton1}>Aceptar</Text>
              </Pressable>
              <Pressable
                style={estilosGeneral.botonGeneral1}
                onPress={() => {
                  funcionRechazar(funcionRechazarParams);
                }}
              >
                <Text style={estilosGeneral.letraBoton1}>Rechazar</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const estilos = StyleSheet.create({
  ventanaEmergente: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    margin: 40,
    zIndex: 10000000000000,
    borderRadius: 30,
    backgroundColor: colores.fondo,
  },
  ventanaEmergente__titulo: {
    color: colores.letra,
    fontSize: 27,
    marginBottom: 20,
    textAlign: "center",
  },
  ventanaEmergente__botones: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
