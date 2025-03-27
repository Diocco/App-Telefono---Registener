import { ProductoI } from "../../../App Telefono - Registener/src/interfaces/producto";

const url = "https://registener-production.up.railway.app";

const urlProductos = url + "/api/productos";

// Realiza la peticion GET para obtener los productos
export const solicitudObtenerProductos = async (
  tokenAcceso: string | null,
  desde: string = "",
  cantidadElementos: string = "",
  precioMin: string = "",
  precioMax: string = "",
  palabraBuscada: string = "",
  categorias: string = "",
  ordenar: string = "",
  categoriasNombre: string = "",
  SKUBuscado: string = "",
  pagina: string = "",
) => {
  const respuesta = await fetch(
    urlProductos +
      `?disponible=true&variantes=true&desde=${desde}&cantidadElementos=${cantidadElementos}&precioMin=${precioMin}&precioMax=${precioMax}&palabraBuscada=${palabraBuscada}&categorias=${categorias}&ordenar=${ordenar}&categoriasNombre=${categoriasNombre}&SKUBuscado=${SKUBuscado}&pagina=${pagina}`,
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

// // Carga las categorias validas en el DOM
// export const buscarCategoriasValidas=async()=>{
//     let nombreCategorias:string[] = []
//     await fetch(
//         urlCategorias+`?nombres=true`, { // Realiza la peticion GET para obtener un string[] con los nombres de las categorias validas
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json'  ,
//             'tokenAcceso' : `${tokenAcceso}`  },
//     })
//     .then(response => response.json()) // Parsear la respuesta como JSON
//     .then(data=> { // Maneja la respuesta del servidor
//         if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola
//         else nombreCategorias = data.categorias // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch(error => { // Si hay un error se manejan
//         mostrarMensaje('2',true)
//         console.error(error);
//     })
//     return nombreCategorias
// }

// // Sube una nueva foto del producto al servidor
// export const subirFotoProducto =async(productoID:string,imagenNueva?:File,URLImagenVieja?:string)=>{

//     const formData = new FormData()
//     if(imagenNueva) formData.append('img',imagenNueva) // Si se envia una imagen para agregar, la agrega al FormData
//     if(URLImagenVieja) formData.append('URLImagenVieja',URLImagenVieja) // Si se envia una imagen para eliminar la agrega al FormData

//     return actualizarProducto(formData,productoID)
// }

// export const actualizarProducto= async(datosProducto:FormData,productoId:string)=>{
//     let respuesta:{
//         productoActualizado:producto|undefined,
//         errors:error[]
//     }={
//         productoActualizado: undefined,
//         errors: []
//     }

//     await fetch(urlProductos+`/${productoId}`, {
//         method: 'PUT',
//         headers: { 'tokenAcceso':`${tokenAcceso}`},
//         body: datosProducto
//     })
//     .then(response => response.json()) // Parsear la respuesta como JSON
//     .then(data=> { // Maneja la respuesta del servidor
//         if(data.errors) {
//             respuesta.errors = data.errors // Si hay errores de tipeo los muestra en consola
//             mostrarErroresConsola (data.errors)
//         }
//         else respuesta.productoActualizado = data.productoActualizado // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch(error => { // Si hay un error se manejan
//         console.error(error);
//         mostrarMensaje('2',true);
//     })

//     return respuesta
// }

export const solicitudCrearProducto = async (
  datosProducto: ProductoI,
  tokenAcceso: string | null,
): Promise<ProductoI | undefined> => {
  const respuesta = await fetch(urlProductos, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      tokenAcceso: `${tokenAcceso}`,
    },
    body: JSON.stringify(datosProducto),
  });
  if (!respuesta.ok) {
    // Devuelves el contenido de la respuesta, incluso si es un error
    const errorData = await respuesta.json(); // Detalles del error enviados por el servidor
    return Promise.reject(errorData); // Rechazas la promesa con los datos de error
  }

  return respuesta.json();
};

// export const obtenerProducto =async (productoId:string)=>{
//     let producto:producto|undefined
//     await fetch(urlProductos+`/${productoId}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' ,
//             'tokenAcceso' : `${tokenAcceso}`  },
//         })
//     .then(response => response.json()) // Parsea la respuesta
//     .then(data=> { // Maneja la respuesta del servidor
//         if(data.errors) mostrarErroresConsola (data.errors) // Si hay errores de tipeo los muestra en consola
//         else producto = data // Si el servidor no devuelve errores guarda la respuesta
//     })
//     .catch(error => { // Si hay un error se manejan
//         console.error(error);
//         mostrarMensaje('2',true);
//     })

//     return producto
// }

export const solicitudEliminarProducto = async (
  productoId: string,
  tokenAcceso: string,
) => {
  const respuesta = await fetch(urlProductos + `/${productoId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      tokenAcceso: `${tokenAcceso}`,
    },
  });
  if (!respuesta.ok) {
    // Devuelves el contenido de la respuesta, incluso si es un error
    const errorData = await respuesta.json(); // Detalles del error enviados por el servidor
    return Promise.reject(errorData); // Rechazas la promesa con los datos de error
  }

  return 0;
};
