import React, { useState } from "react";
import { View, Platform, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { obtenerFechaActual } from "@/app/helpers/formatearFecha";

export const SelectorFecha = ({ fecha }: { fecha: Date }) => {
  const [date, setDate] = useState(fecha);
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          onPress={() => setShow(true)}
          style={estilosGeneral.botonGeneral1}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="white" />
        </Pressable>
      </View>
      {show && (
        <DateTimePicker // TOOOOOOODOOOOOO No hace falta envolver todo en un componente, solo los state y el dateTime, o capaz que ni eso, mañana me fijo
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default SelectorFecha;
