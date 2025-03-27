import { MaterialIcons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export const ErrorCarga = ({ mensaje }: { mensaje: string }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <MaterialIcons name="error" size={30} color={"white"} />
      <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
        {mensaje}
      </Text>
    </View>
  );
};
