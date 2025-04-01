import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductoI } from "../interfaces/producto";
import { RegistroVentaI } from "@/interfaces/registroVentas";

interface ProductosState {
  // Crea la interface de lo que contiene la variable global
  registros: RegistroVentaI[];
  registrosFiltrados: RegistroVentaI[];
  montoVentasPorDia: number[];
  montoVentasPorDiaAnterior: number[];
  ingresoSemanal: number;
  ingresoSemanalAnterior: number;
  ventas: number;
  ventasAnterior: number;
  productosVendidos: number;
  productosVendidosAnterior: number;
}

const initialState: ProductosState = {
  // Crea las condiciones iniciales
  registros: [],
  registrosFiltrados: [],
  montoVentasPorDia: [0, 0, 0, 0, 0, 0, 0],
  montoVentasPorDiaAnterior: [0, 0, 0, 0, 0, 0, 0],
  ingresoSemanal: 0,
  ingresoSemanalAnterior: 0,
  ventas: 0,
  ventasAnterior: 0,
  productosVendidos: 0,
  productosVendidosAnterior: 0,
};

const esFechaDeEstaSemana = (fecha: Date): boolean => {
  // Recibe una fecha y devuelve un booleando indicando si la fecha de se encuentra en la semana actual
  // Obtenemos la fecha actual y la reseteamos a las 00:00
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Calculamos el inicio de la semana (domingo a las 00:00)
  const diaSemana = hoy.getDay(); // Domingo = 0, Lunes = 1, etc.
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - diaSemana); // Retrocede hasta el domingo

  // Calculamos el final de la semana (sábado a las 23:59:59.999)
  const finSemana = new Date(inicioSemana);
  finSemana.setDate(inicioSemana.getDate() + 6);
  finSemana.setHours(23, 59, 59, 999);

  // Verificamos si la fecha pasada está entre el inicio y fin de la semana
  return fecha >= inicioSemana && fecha <= finSemana;
};
const esFechaDeLaSemanaAnterior = (fecha: Date): boolean => {
  // Obtenemos la fecha actual y la reseteamos a las 00:00
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Determinamos el inicio de la semana actual (domingo a las 00:00)
  const diaSemana = hoy.getDay(); // Domingo = 0, Lunes = 1, etc.
  const inicioSemanaActual = new Date(hoy);
  inicioSemanaActual.setDate(hoy.getDate() - diaSemana);

  // Calculamos el inicio de la semana anterior (domingo de la semana pasada)
  const inicioSemanaAnterior = new Date(inicioSemanaActual);
  inicioSemanaAnterior.setDate(inicioSemanaActual.getDate() - 7);

  // Calculamos el fin de la semana anterior (sábado a las 23:59:59.999)
  const finSemanaAnterior = new Date(inicioSemanaAnterior);
  finSemanaAnterior.setDate(inicioSemanaAnterior.getDate() + 6);
  finSemanaAnterior.setHours(23, 59, 59, 999);

  // Verificamos si la fecha está dentro del rango de la semana anterior
  return fecha >= inicioSemanaAnterior && fecha <= finSemanaAnterior;
};

const calcularEstadisticas = (registros: RegistroVentaI[]) => {
  const resultados = {
    montoVentasPorDia: [0, 0, 0, 0, 0, 0, 0],
    montoVentasPorDiaAnterior: [0, 0, 0, 0, 0, 0, 0],
    ventas: 0,
    ventasAnterior: 0,
    productosVendidos: 0,
    productosVendidosAnterior: 0,
  };
  registros.forEach((registro) => {
    // Variables del registro
    const fecha = new Date(registro.fechaVenta); // Fecha de la venta
    const diaSemana = fecha.getDay(); // Dia de la semana de la venta

    // Suma los montos de la venta al dia de la semana correspondiente de esta semana o la anterior
    if (esFechaDeEstaSemana(fecha)) {
      resultados.montoVentasPorDia[diaSemana] += registro.total / 1000;
      resultados.ventas += 1;
      resultados.productosVendidos += registro.productosVendidos; // Suma la cantidad de productos vendidos en el carrito
    } else if (esFechaDeLaSemanaAnterior(fecha)) {
      resultados.montoVentasPorDiaAnterior[diaSemana] += registro.total / 1000;
      resultados.ventasAnterior += 1;
      resultados.productosVendidosAnterior += registro.productosVendidos; // Suma la cantidad de productos vendidos en el carrito
    }
  });
  return resultados;
};

const registroVentasSlice = createSlice({
  // Crea el slice, donde se coloca lo anterior y ademas se le define funciones para modificar la variable en "reducers"
  name: "productos",
  initialState,
  reducers: {
    definirRegistroVentas: (state, action: PayloadAction<RegistroVentaI[]>) => {
      state.registros = action.payload;
      state.registrosFiltrados = action.payload;

      const resultados = calcularEstadisticas(action.payload); // Calcula los montos vendidos por dia de la semana actual y la anterior
      state.montoVentasPorDia = resultados.montoVentasPorDia;
      state.montoVentasPorDiaAnterior = resultados.montoVentasPorDiaAnterior;
      state.ventas = resultados.ventas;
      state.ventasAnterior = resultados.ventasAnterior;
      state.ingresoSemanal = resultados.montoVentasPorDia.reduce(
        (acumulado, actual) => acumulado + actual, // Suma los montos de todos los dias de la semana
      );
      state.ingresoSemanalAnterior =
        resultados.montoVentasPorDiaAnterior.reduce(
          (acumulado, actual) => acumulado + actual, // Suma los montos de todos los dias de la semana anterior
        );
    },
    reiniciarRegistroVentas: () => initialState,
  },
});

export const { definirRegistroVentas, reiniciarRegistroVentas } =
  registroVentasSlice.actions; // Se exporta las funciones
export default registroVentasSlice.reducer; // Se exporta la configuracion
