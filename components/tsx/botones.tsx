import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
// import '../css/botones.css'

export const BotonExitoso =()=>{return <button data-testid="boton-exitoso" className='botonGeneral-exitoso'><FontAwesomeIcon icon={faCheck} /></button>}
export const BotonError =()=>{return <button data-testid="boton-error" className='botonGeneral-error'><FontAwesomeIcon icon={faXmark} /></button>}

import { Button, HStack } from "@chakra-ui/react"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    titulo:string
    id:string
};

export const BotonGeneral1: React.FC<Props> = ({id,titulo,...props}) => {
    return (
        <HStack id={id} wrap="wrap" gap="6">

            <Button {...props} size="xl" padding={"9px 20px 10px 20px"} fontSize={"20px"} className="botonGeneral1" variant="surface">{titulo}</Button>

        </HStack>
    )
}
