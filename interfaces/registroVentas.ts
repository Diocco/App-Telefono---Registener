
import { ElementoCarritoI } from "./elementoCarrito.js";


export interface RegistroVentaI{
    _id:string,
    lugarVenta?:string
    fechaVenta:Date
    total:number
    metodo1:string
    metodo2?:string
    pago1?:number
    pago2?:number
    descuentoNombre?:string
    descuento?:number
    promocion?:string,
    observacion?:string
    etiqueta?:string
    cliente?:string,
    carrito?:ElementoCarritoI[]
    vendedor?:string
    estado:string,
    modificaciones?:[{
        fecha:Date,
        usuarioNombre:string,
        modificacion:string
    }],
    usuario:string ,
    productosVendidos: number,
}