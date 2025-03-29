import { RegistroVentaI } from "../interfaces/registroVentas.js";

const url = "https://registener-production.up.railway.app";

const urlRegistroVentas = url + "/api/registroVentas";

// export const registrarVenta = async (
//   total: number,
//   metodo1: string,
//   estado: string,
//   etiqueta: string,
//   pago1?: number,
//   pago2?: number,
//   metodo2?: string,
//   lugarVenta?: string,
//   descuento?: number,
//   descuentoNombre?: string,
//   observacion?: string,
//   carrito?: ElementoCarritoI[],
// ): Promise<RegistroVentaI | undefined> => {
//   // Estructura la informacion y le da formato de string
//   const fechaVenta = new Date();
//   if (!pago1) pago1 = total;
//   const data = JSON.stringify({
//     fechaVenta,
//     total,
//     pago1,
//     pago2,
//     etiqueta,
//     metodo1,
//     metodo2,
//     estado,
//     lugarVenta,
//     descuento,
//     descuentoNombre,
//     observacion,
//     carrito,
//   });

//   let registroVenta: RegistroVentaI | undefined = undefined;

//   await fetch(urlRegistroVentas, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       tokenAcceso: `${tokenAcceso}`,
//     },
//     body: data,
//   })
//     .then((response) => response.json()) // Parsear la respuesta como JSON
//     .then((data) => {
//       // Maneja la respuesta del servidor
//       if (data.errors)
//         mostrarErroresConsola(data.errors); // Si hay errores de tipeo los muestra en consola
//       else registroVenta = data; // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch((error) => {
//       // Si hay un error se manejan
//       console.error(error);
//       mostrarMensaje("2", true);
//     });

//   return registroVenta;
// };

export const verRegistroVentas = async ({
  tokenAcceso,
  desde = "",
  cantidadElementos = "25",
  pagina = "",
  IDVenta = "",
  metodo = "",
  estados = "",
  buscarObservacion = "",
  fechaDesde = undefined,
  fechaHasta = undefined,
}: {
  tokenAcceso: string | null;
  desde?: string;
  cantidadElementos?: string;
  pagina?: string;
  IDVenta?: string;
  metodo?: string;
  estados?: string;
  buscarObservacion?: string;
  fechaDesde?: Date | undefined;
  fechaHasta?: Date | undefined;
}): Promise<{
  registroVentas: RegistroVentaI[];
  registroVentasCantidad: number;
  paginasCantidad: number;
}> => {
  const respuesta = await fetch(
    urlRegistroVentas +
      `?desde=${desde}&cantidadElementos=${cantidadElementos}&pagina=${pagina}&IDVenta=${IDVenta}&metodo=${metodo}&estados=${estados}&buscarObservacion=${buscarObservacion}&fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        tokenAcceso: `${tokenAcceso}`,
      },
    },
  );

  if (!respuesta.ok) {
    // Devuelves el contenido de la respuesta, incluso si es un error
    const errorData = await respuesta.json(); // Detalles del error enviados por el servidor
    return Promise.reject(errorData); // Rechazas la promesa con los datos de error
  }

  return respuesta.json();
};

// export const solicitudObtenerIngresos = async (fechaDesde: Date) => {
//   let ingresos:
//     | [
//         {
//           metodo: string;
//           monto: number;
//         },
//       ]
//     | undefined;

//   await fetch(urlRegistroVentas + `/ingresos/:${fechaDesde}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       tokenAcceso: `${tokenAcceso}`,
//     },
//   })
//     .then((response) => response.json()) // Parsea la respuesta
//     .then((data) => {
//       // Maneja la respuesta del servidor
//       if (data.errors)
//         mostrarErroresConsola(data.errors); // Si hay errores de tipeo los muestra en consola
//       else ingresos = data.ingresos; // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch((error) => {
//       // Si hay un error se manejan
//       console.error(error);
//       mostrarMensaje("2", true);
//     });

//   return ingresos;
// };

export const obtenerRegistro = async (id: string) => {
  let registro: RegistroVentaI | undefined;

  await fetch(urlRegistroVentas + `/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      tokenAcceso: `${tokenAcceso}`,
    },
  })
    .then((response) => response.json()) // Parsea la respuesta
    .then((data) => {
      // Maneja la respuesta del servidor
      if (data.errors)
        mostrarErroresConsola(data.errors); // Si hay errores de tipeo los muestra en consola
      else registro = data; // Si el servidor no devuelve errores guarda la respuesta
    })
    .catch((error) => {
      // Si hay un error se manejan
      console.error(error);
      mostrarMensaje("2", true);
    });

  return registro;
};

// export const modificarRegistro = async (formdata: FormData) => {
//   let registroVenta: RegistroVentaI | undefined = undefined;

//   await fetch(urlRegistroVentas, {
//     method: "PUT",
//     headers: { tokenAcceso: `${tokenAcceso}` },
//     body: formdata,
//   })
//     .then((response) => response.json()) // Parsear la respuesta como JSON
//     .then((data) => {
//       // Maneja la respuesta del servidor
//       if (data.errors)
//         mostrarErroresConsola(data.errors); // Si hay errores de tipeo los muestra en consola
//       else registroVenta = data; // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch((error) => {
//       // Si hay un error se manejan
//       console.error(error);
//       mostrarMensaje("2", true);
//     });

//   return registroVenta;
// };

// export const eliminarRegistro = async (registroVentaID: string) => {
//   let respuesta = -1;

//   await fetch(urlRegistroVentas + `/${registroVentaID}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       tokenAcceso: `${tokenAcceso}`,
//     },
//   })
//     .then((response) => response.json()) // Parsear la respuesta como JSON
//     .then((data) => {
//       // Maneja la respuesta del servidor
//       if (data.errors)
//         mostrarErroresConsola(data.errors); // Si hay errores de tipeo los muestra en consola
//       else respuesta = 0; // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch((error) => {
//       // Si hay un error se manejan
//       console.error(error);
//       mostrarMensaje("2", true);
//     });

//   return respuesta;
// };
