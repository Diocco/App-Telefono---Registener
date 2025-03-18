import "../css/ventanaEmergente.css"

export const VentanaEmergente=({mensaje,funcionAceptar,funcionAceptarParams,funcionRechazar,funcionRechazarParams}:{mensaje:string,funcionAceptar:Function,funcionAceptarParams:any,funcionRechazar:Function,funcionRechazarParams:any})=>{
    return(<>
    <div id="ventanaEmergente__fondo">
        <div id="ventanaEmergente">
            <h3 id="ventanaEmergente__h3">{mensaje}</h3>
            <div id="ventanaEmergente__botones">
                <button className="botonGeneral" onClick={()=>{funcionAceptar(funcionAceptarParams)}}>Aceptar</button>
                <button className="botonGeneral" onClick={()=>{funcionRechazar(funcionRechazarParams)}}>Rechazar</button>
            </div>
        </div>
    </div>
    </>)
}