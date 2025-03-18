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
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={estilosGeneral.inputGeneral}
            placeholder={placeholder}
            placeholderTextColor={colores.letraSecundario}
            defaultValue={defaultValue}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </>
  );
};
