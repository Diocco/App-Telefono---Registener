

export interface MetodoPagoI {
    _id?:string;
    nombre: string;        // Nombre del método de pago
    tipo: "Digital" | "Bancario" | "Efectivo"; // Tipo del método de pago
    estado: boolean;       // Estado (activo o inactivo)
    usuario:string, 
    save?: () => Promise<void>
}