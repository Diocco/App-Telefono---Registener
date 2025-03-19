import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { TextInput, Text } from "react-native";
import { estilosGeneral } from "@/constants/estilosGenerales";
import { colores } from "@/constants/colores";

export const InputRegistro = ({
  control,
  defaultValue,
  placeholder,
  name,
  error,
  rules,
  titulo,
  multiline = false,
  maxLength = 100,
}: {
  control: Control<FieldValues, any>;
  defaultValue: string;
  placeholder: string;
  name: string;
  error?: string;
  rules:
    | Omit<
        RegisterOptions<FieldValues, string>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
      >
    | undefined;
  titulo?: string;
  multiline?: boolean;
  maxLength?: number;
}) => {
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
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={estilosGeneral.inputGeneral}
            placeholder={placeholder}
            placeholderTextColor={colores.letraSecundario}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            multiline={multiline}
            maxLength={maxLength}
          />
        )}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </>
  );
};
