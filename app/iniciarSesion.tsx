import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import {
  solicitudIniciarSesion,
  solicitudRegistrarUsuario,
} from "../services/usuariosAPI";
import { useDispatch } from "react-redux";
import { definirTokenAcceso } from "../redux/tokenSlice";
import { SafeAreaView } from "react-native-safe-area-context";

// Estilos globales
import { colores } from "../constants/colores";
import { estilosGeneral } from "../constants/estilosGenerales";

export function IniciarSesion() {
  const [esRegistro, setRegistro] = useState(false);
  const reduxDispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
    watch,
  } = useForm();

  const enviarFormulario = (datos: any) => {
    datos.passwordRepetir = undefined;
    if (esRegistro) {
      mutationRegistro.mutate(datos);
    } else {
      datos.nombre = undefined;
      mutationInicioSesion.mutate(datos);
    }
  };

  const alternarRegistro = () => {
    clearErrors();
    setRegistro(!esRegistro);
  };

  const erroresManualesRegistro = (errores: any) => {
    errores.forEach((error: any) => {
      setError(error.path, {
        type: "manual",
        message: error.msg,
      });
    });
  };

  const mutationInicioSesion = useMutation(solicitudIniciarSesion, {
    onSuccess: (data) => {
      setTimeout(() => {
        mutationInicioSesion.reset();
        reduxDispatch(
          definirTokenAcceso({
            token: data.token as string,
            usuario: data.usuario,
          }),
        );
      }, 1000);
    },
    onError: (error: any) => {
      setTimeout(() => mutationInicioSesion.reset(), 2000);
      erroresManualesRegistro(error.errors);
    },
  });

  const mutationRegistro = useMutation(solicitudRegistrarUsuario, {
    onSuccess: (data) => {
      setTimeout(() => mutationRegistro.reset(), 2000);
      reduxDispatch(
        definirTokenAcceso({
          token: data.token as string,
          usuario: data.usuario,
        }),
      );
    },
    onError: (error: any) => {
      erroresManualesRegistro(error.errors);
      setTimeout(() => mutationRegistro.reset(), 2000);
    },
  });

  return (
    <SafeAreaView style={estilos.fondo}>
      <View style={estilos.registro}>
        <Text style={estilos.titulo}>
          {esRegistro ? "Registrarse" : "Iniciar Sesión"}
        </Text>
        {esRegistro && (
          <>
            <Controller
              name="nombre"
              rules={{ required: "El nombre de usuario es obligatorio" }}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="Nombre de usuario"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={estilosGeneral.inputGeneral}
                  placeholderTextColor={colores.letraSecundario}
                />
              )}
            />
            {errors.nombre && (
              <Text style={{ color: "red" }}>
                {errors.nombre.message?.toString()}
              </Text>
            )}
          </>
        )}

        <Controller
          name="correo"
          rules={{
            required: "El email es obligatorio",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Email no valido",
            },
          }}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Correo"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={estilosGeneral.inputGeneral}
              placeholderTextColor={colores.letraSecundario}
            />
          )}
        />
        {errors.correo && (
          <Text style={{ color: "red" }}>
            {errors.correo.message?.toString()}
          </Text>
        )}

        <Controller
          name="password"
          rules={{
            required: "La contraseña es obligatoria",
            minLength: {
              value: 8,
              message: "Debe contener al menos 8 caracteres",
            },
          }}
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              placeholder="Contraseña"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              style={estilosGeneral.inputGeneral}
              placeholderTextColor={colores.letraSecundario}
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: "red" }}>
            {errors.password.message?.toString()}
          </Text>
        )}

        {esRegistro && (
          <>
            <Controller
              name="passwordRepetir"
              rules={{
                required: "La contraseña es obligatoria",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
                minLength: {
                  value: 8,
                  message: "Debe contener al menos 8 caracteres",
                },
              }}
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  secureTextEntry={true}
                  placeholder="Repetir contraseña"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  style={estilosGeneral.inputGeneral}
                  placeholderTextColor={colores.letraSecundario}
                />
              )}
            />
            {errors.passwordRepetir && (
              <Text style={{ color: "red" }}>
                {errors.passwordRepetir.message?.toString()}
              </Text>
            )}
          </>
        )}

        <Pressable
          onPress={handleSubmit(enviarFormulario)}
          style={estilosGeneral.botonGeneral1}
        >
          {mutationInicioSesion.isLoading || mutationRegistro.isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : esRegistro ? (
            <Text style={estilosGeneral.letraBoton1}>Registrarse</Text>
          ) : (
            <Text style={estilosGeneral.letraBoton1}>Ingresar</Text>
          )}
        </Pressable>

        <Pressable
          onPress={alternarRegistro}
          style={estilosGeneral.botonGeneral2}
        >
          <Text style={estilosGeneral.letraBoton1}>
            {esRegistro ? "Iniciar Sesión" : "Registrarse"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    backgroundColor: colores.fondo,
  },
  titulo: {
    color: "#fff",
    textAlign: "center",
    fontSize: 28,
    margin: 20,
  },
  registro: {
    borderRadius: 15,
    width: 300,
    backgroundColor: colores.fondoElemento,
    padding: 20,
  },
});
