
export interface variante {
    _id?: string, 
    producto: string, 
    color: string,
    talle: string,
    SKU: string,
    stock: number,
    esFavorito: boolean,
    usuario:string
    save?: () => Promise<void>
    }
