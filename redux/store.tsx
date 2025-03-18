import { configureStore } from "@reduxjs/toolkit";
import productosReducer from "./productosSlice"; // Se importa la configuracion de la variable productos
import categoriasReducer from "./categoriasSlice"; // Se importa la configuracion de la variable productos
import tokenAccesoReducer from "./tokenSlice"; // Se importa la configuracion de la variable productos
import mensajeEmergenteReducer from "./mensajeEmergenteSlice";

const store = configureStore({
  // Se configura todas las variables globales
  reducer: {
    productos: productosReducer,
    tokenAcceso: tokenAccesoReducer,
    categorias: categoriasReducer,
    mensajeEmergente: mensajeEmergenteReducer,
  },
});

export default store; // Se exporta la store con todas las variables globales
export type RootState = ReturnType<typeof store.getState>; // Se exporta los tipos para usar las funciones correctamente en TypeScript
export type AppDispatch = typeof store.dispatch; // Se exportan las funciones
