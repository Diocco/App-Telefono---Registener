import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductoI } from "../interfaces/producto";
import { RegistroVentaI } from "@/interfaces/registroVentas";

interface ProductosState {
  // Crea la interface de lo que contiene la variable global
  registros: RegistroVentaI[];
  registrosFiltrados: RegistroVentaI[];
}

const initialState: ProductosState = {
  // Crea las condiciones iniciales
  registros: [],
  registrosFiltrados: [],
};

const registroVentasSlice = createSlice({
  // Crea el slice, donde se coloca lo anterior y ademas se le define funciones para modificar la variable en "reducers"
  name: "productos",
  initialState,
  reducers: {
    definirRegistroVentas: (state, action: PayloadAction<RegistroVentaI[]>) => {
      state.registros = action.payload;
      state.registrosFiltrados = action.payload;
    },
    reiniciarRegistroVentas: () => initialState,
  },
});

export const { definirRegistroVentas, reiniciarRegistroVentas } =
  registroVentasSlice.actions; // Se exporta las funciones
export default registroVentasSlice.reducer; // Se exporta la configuracion
