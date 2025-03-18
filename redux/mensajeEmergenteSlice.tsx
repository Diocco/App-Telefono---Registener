import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "./store";

const initialState: {
  mensaje: string;
  esError: boolean;
  esActivo: boolean;
} = {
  mensaje: "",
  esError: false,
  esActivo: false,
};

const mensajeEmergenteSlice = createSlice({
  // Crea el slice, donde se coloca lo anterior y ademas se le define funciones para modificar la variable en "reducers"
  name: "mensajeEmergente",
  initialState,
  reducers: {
    definirMensaje: (
      state,
      action: PayloadAction<{ mensaje: string; esError: boolean }>,
    ) => {
      state.esActivo = true;
      state.mensaje = action.payload.mensaje;
      state.esError = action.payload.esError;
    },
    ocultarMensaje: (state) => {
      state.esActivo = false;
      state.mensaje = "";
      state.esError = false;
    },
  },
});

export const mostrarMensaje =
  ({ mensaje, esError }: { mensaje: string; esError?: boolean }) =>
  (dispatch: AppDispatch) => {
    if (!esError) esError = false;
    dispatch(definirMensaje({ mensaje, esError }));
    setTimeout(() => {
      dispatch(ocultarMensaje());
    }, 7000);
  };
export const { definirMensaje, ocultarMensaje } = mensajeEmergenteSlice.actions; // Se exporta las funciones
export default mensajeEmergenteSlice.reducer; // Se exporta la configuracion
