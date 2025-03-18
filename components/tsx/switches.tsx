"use client";

import { colores } from "@/constants/colores";
import { useState } from "react";
import { Switch, View, Text, StyleSheet } from "react-native";

export const SwitchGeneral1 = ({
  titulo,
  onValueChange,
  valorInicial,
}: {
  titulo: string;
  onValueChange: Function;
  valorInicial: boolean;
}) => {
  const [checked, setChecked] = useState(valorInicial);

  return (
    <View style={styles.container}>
      <Switch
        value={checked}
        onValueChange={() => {
          setChecked(!checked);
          onValueChange(!checked);
        }} // Cambia el estado cuando se toca el switch
        trackColor={{ false: "#767577", true: colores.boton }} // Color del track en modo apagado o encendido
        thumbColor="white" // Color del thumb (el círculo)
      />
      <Text style={styles.text}>{titulo}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    color: colores.letra,
    fontSize: 18,
    paddingLeft: 5,
  },
});
