
import { CategoriaI } from "./categorias.js"
import { variante } from "./variante.js"

export interface ProductoI {
    _id:string,
    nombre:string,
    marca:string,
    modelo:string,
    estado:boolean,
    usuario:string, 
    categoria:string|CategoriaI,
    categoriaNombre:string,
    variantes: string[]|variante[],
    descripcion: string
    precio:number,
    precioViejo:number,
    especificaciones:EspecificacionI[]
    disponible:boolean,
    tags:string[],
    imagenes: string[],
    }

export interface EspecificacionI {
    _id:string
    nombre:string,
    descripcion:string
}