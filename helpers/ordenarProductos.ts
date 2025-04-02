import { CategoriaI } from "../interfaces/categorias"
import { ProductoI } from "../interfaces/producto"

export const ordenarProductos=(productos:ProductoI[])=>{
    let productosAgrupados:ProductoI[][]=[] 
    let categoriasNombres:string[]=[]
    productos.forEach(producto=>{
        let index = categoriasNombres.findIndex(categoriaNombre => categoriaNombre === (producto.categoria as CategoriaI).nombre ) // Busca el index de la categoria del producto en el array de categorias ya encontradas
        if(index===-1){ // Si no se encontro la categoria del producto en las categorias ya encontradas entonces la agrega al final
            index = categoriasNombres.length 
            categoriasNombres.push((producto.categoria as CategoriaI).nombre)
        }
        if (!productosAgrupados[index]) {productosAgrupados[index] = []; } // Inicializamos si no existe
        if(productosAgrupados[index])productosAgrupados[index].push(producto) // Agrega el nuevo producto
    })
    return productosAgrupados
}