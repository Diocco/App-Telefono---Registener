

export interface RegistroCajaI {
    _id?:string,
    fechaApertura:Date,
    fechaCierre:Date,
    usuarioApertura:string,
    usuarioCierre:string,
    mediosDePago:[MediosDePagoI],
    observacion:string,
    usuario:string, 
}

export interface MediosDePagoI {
    medio:string,
    saldoInicial:number,
    saldoFinal:number,
    saldoEsperado:number
}