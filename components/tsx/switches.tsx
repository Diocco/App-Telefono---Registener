"use client"

import { Switch } from "@chakra-ui/react"
import { useEffect, useState } from "react"


export const SwitchGeneral1 = ({titulo,onClick,valorInicial}:{titulo:string,onClick:Function,valorInicial:boolean}) => {
    const [checked, setChecked] = useState(valorInicial)



    return (
        <Switch.Root margin={"15px 10px"} key={'lg'} size={"lg"}
        checked={checked}
        onCheckedChange={(e) => setChecked(e.checked)}
        onClick={()=>onClick(!checked)}
        >
        <Switch.HiddenInput />
            <Switch.Control >
                <Switch.Thumb />
            </Switch.Control>
            <Switch.Label fontSize={"17px"}>{titulo}</Switch.Label>
        </Switch.Root>
    )
}
