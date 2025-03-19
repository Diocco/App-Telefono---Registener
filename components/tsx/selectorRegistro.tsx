import React, { useState } from "react";
import { Text } from "react-native";
import {
  Controller,
  RegisterOptions,
  FieldValues,
  Control,
} from "react-hook-form";
import DropDownPicker from "react-native-dropdown-picker";
import { estilosGeneral } from "../../constants/estilosGenerales";
import { colores } from "../../constants/colores";

export default function SelectorRegistro({
  control,
  defaultValue,
  name,
  error,
  rules,
  opciones,
  titulo,
  setSelectorAbierto,
}: {
  control: Control<FieldValues, any>;
  defaultValue: string;
  name: string;
  error?: string;
  rules:
    | Omit<
        RegisterOptions<FieldValues, string>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
      >
    | undefined;
  opciones: { value: string; label: string }[];
  titulo?: string;
  setSelectorAbierto: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  //   const [value, setValue] = useState(null);
  const [items, setItems] = useState(opciones);

  return (
    <>
      {titulo && (
        <Text
          style={{
            color: colores.letra,
            fontSize: 15,
            marginTop: 10,
          }}
        >
          {titulo}
        </Text>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <DropDownPicker
            onOpen={() => setSelectorAbierto(true)}
            onClose={() => setSelectorAbierto(false)}
            theme="DARK"
            style={estilosGeneral.inputGeneral}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={onChange}
            placeholder="Selecciona una opción"
            dropDownContainerStyle={{
              backgroundColor: colores.fondoElemento,
              marginTop: 20,
            }}
            textStyle={{ color: colores.letra, fontSize: 20 }}
          />
        )}
      />
      {error && <Text>{error}</Text>}
    </>
  );
}
