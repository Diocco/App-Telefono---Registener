import { obtenerFormatoImagen } from "./obtenerFormatoImagen"

export const obtenerSourceImagen=(imagen64:string|undefined)=>{
    let source:string|undefined=undefined
    if(imagen64){
        const formato = obtenerFormatoImagen(imagen64)
        source=`data:image/${formato};base64,${imagen64}`
    }else{
        source="../src/assets/images/sinfoto.png"
    }

    return source
}