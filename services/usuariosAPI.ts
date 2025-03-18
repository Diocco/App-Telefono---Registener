// import { error } from "../interfaces/error.js";
// import { producto } from "../interfaces/producto.js";
// import { usuario } from "../interfaces/usuario.js";

const url = 'https://registener-production.up.railway.app'








export const solicitudUsuarioVerificado = async (tokenAcceso:string)=>{

    const respuesta = await fetch(url+'/api/usuarios/token', {  // Solicita la informacion del usuario
        method: 'GET',
        headers: { 'Content-Type': 'application/json',
                    'tokenAcceso':`${tokenAcceso}`},
    })
    if (!respuesta.ok) {
        // Devuelves el contenido de la respuesta, incluso si es un error
        const errorData = await respuesta.json(); // Detalles del error enviados por el servidor
        return Promise.reject(errorData);  // Rechazas la promesa con los datos de error
        }
    return respuesta.json()
}

export const solicitudIniciarSesion=async(datos:{nombre:string,correo:string})=>{
    const respuesta = await fetch(url + `/api/auth/login`, { // Realiza el post
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(datos) // Convertir los datos a JSON
        })


    if (!respuesta.ok) {
        // Devuelves el contenido de la respuesta, incluso si es un error
        const errorData = await respuesta.json(); // Detalles del error enviados por el servidor
        return Promise.reject(errorData);  // Rechazas la promesa con los datos de error
    }
    return respuesta.json()
}

export const solicitudRegistrarUsuario=async (datos:{nombre:string,correo:string,password:string})=>{

    const respuesta = await fetch(url + '/api/usuarios', { // Realiza el post
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos) // Convertir los datos a JSON
    })
    
    if (!respuesta.ok) {
        // Devuelves el contenido de la respuesta, incluso si es un error
        const errorData = await respuesta.json(); // Detalles del error enviados por el servidor
        return Promise.reject(errorData);  // Rechazas la promesa con los datos de error
        }
    return respuesta.json()
}

// export const obtenerListaDeseados=async(productoCompleto:boolean=true)=>{
//     let respuesta: {
//         errors:error[],
//         productos:producto[]|string[]
//     }={
//         errors: [],
//         productos: []
//     }

//     await fetch(url+`/api/usuarios/listaDeseados?productoCompleto=${productoCompleto}`,{ 
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json',
//             'tokenAcceso':`${tokenAcceso}` // Envia el token de acceso del usuario
//         },
//         })
//         .then(response => response.json()) // Parsea la respuesta 
//         .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
//             if(data.errors) respuesta.errors=data.errors
//             else respuesta.productos = data
//         })
//         .catch(error => { // Si hay un error se manejan 
//             mostrarMensaje('2',true);
//             console.error(error);
//         })
    
//     return respuesta
// }

// export const solicitudAlternarProductoDeseado=async(productoId:string)=>{
//     let respuesta: {
//         errors:error[],
//     }={
//         errors: [],
//     }

//     await fetch(url+`/api/usuarios/listaDeseados/${productoId}`,{ // Envia el id del producto como un queryparam
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json',
//             'tokenAcceso':`${tokenAcceso}` // Envia el token de acceso del usuario
//         }
//     })
//     .then(response=>response.json())
//     .then(data=> { // Si todo sale bien se maneja la respuesta del servidor
//         if(data.errors) respuesta.errors=data.errors
//     })
//     .catch(error => { // Si hay un error se manejan 
//         mostrarMensaje('2',true);
//         console.error(error);
//     })

//     return respuesta
// }

// export const solicitudActualizarUsuario =async(datosFormulario:FormData)=>{
//     let respuesta: {errors:error[]}={errors: []}

//     await fetch(url+`/api/usuarios`, {
//         method: 'PUT',
//         headers: { 'tokenAcceso':`${tokenAcceso}`},
//         body: datosFormulario
//     })
//     .then(response => response.json()) // Parsear la respuesta como JSON
//     .then(data=> {if(data.errors) respuesta.errors=data.errors }) // Si todo sale bien se maneja la respuesta del servidor
//     .catch(error => { // Si hay un error se manejan 
//         console.error(error);
//         mostrarMensaje('2',true);
//     })
//     return respuesta
// }