import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { usuario } from "../interfaces/usuario";
import { AppDispatch } from "./store";
import { reiniciarProductos } from "./productosSlice";
import { reiniciarCategorias } from "./categoriasSlice";
import * as SecureStore from "expo-secure-store";

interface ProductosState {
  // Crea la interface de lo que contiene la variable global
  tokenAcceso: string | null;
  usuario: usuario | undefined;
}
const initialState: ProductosState = {
  // Crea las condiciones iniciales
  tokenAcceso: "" /*SecureStore.getItem('tokenAcceso')*/,
  usuario: undefined,
};

const tokenSlice = createSlice({
  // Crea el slice, donde se coloca lo anterior y ademas se le define funciones para modificar la variable en "reducers"
  name: "tokenAcceso",
  initialState,
  reducers: {
    definirTokenAcceso: (
      state,
      action: PayloadAction<{ token: string; usuario: usuario }>,
    ) => {
      SecureStore.setItem("tokenAcceso", action.payload.token);
      state.tokenAcceso = action.payload.token;
      state.usuario = action.payload.usuario;
    },
    definirUsuario: (state, action: PayloadAction<usuario>) => {
      state.usuario = action.payload;
    },
    reiniciarTokenAcceso: () => initialState,
    modificarPreferencias: (
      state,
      action: PayloadAction<{ esAgruparCategoria: boolean }>,
    ) => {
      if (state.usuario) {
        state.usuario.preferencias.esAgruparCategoria =
          action.payload.esAgruparCategoria;
      }
    },
  },
});

export const eliminarTokenAcceso = () => (dispatch: AppDispatch) => {
  // SecureStore.deleteItemAsync('tokenAcceso')
  dispatch(reiniciarProductos());
  dispatch(reiniciarTokenAcceso());
  dispatch(reiniciarCategorias());
};

export const {
  definirTokenAcceso,
  definirUsuario,
  reiniciarTokenAcceso,
  modificarPreferencias,
} = tokenSlice.actions; // Se exporta las funciones
export default tokenSlice.reducer; // Se exporta la configuracion
