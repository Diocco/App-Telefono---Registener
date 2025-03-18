import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoriaI } from "../interfaces/categorias";

interface CategoriasState {
  // Crea la interface de lo que contiene la variable global
  categorias: CategoriaI[];
}

const initialState: CategoriasState = {
  // Crea las condiciones iniciales
  categorias: [],
};

const categoriasSlice = createSlice({
  // Crea el slice, donde se coloca lo anterior y ademas se le define funciones para modificar la variable en "reducers"
  name: "categorias",
  initialState,
  reducers: {
    definirCategorias: (state, action: PayloadAction<CategoriaI[]>) => {
      state.categorias = action.payload;
    },
    reiniciarCategorias: () => initialState,
  },
});

export const { definirCategorias, reiniciarCategorias } =
  categoriasSlice.actions; // Se exporta las funciones
export default categoriasSlice.reducer; // Se exporta la configuracion
