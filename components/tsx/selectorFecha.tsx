import React, { useState } from "react";
import { View, Platform, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { Fontisto } from "@expo/vector-icons";
import { obtenerFechaActual } from "@/app/helpers/formatearFecha";

export const SelectorFecha = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: React.Dispatch<Date>;
}) => {
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
          style={[
            estilosGeneral.inputGeneral,
            {
              flexDirection: "row",
              width: 160,
              justifyContent: "space-between",
            },
          ]}
        >
          <Text style={estilosGeneral.letraBoton1}>
            {obtenerFechaActual(date, true)}
          </Text>
          <Fontisto name="date" size={24} color="white" />
        </Pressable>
      </View>
      {show && (
        <DateTimePicker
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
