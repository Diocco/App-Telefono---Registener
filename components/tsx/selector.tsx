"use client"

import { Field, createListCollection } from "@chakra-ui/react"

import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../ui/select"

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
    titulo:string,
    opciones:{value:string,label:string}[],
    errorTexto?:string,
    useFormParams:any,
    defaultValue:string,
    className:string
};

export const Selector: React.FC<Props> = ({titulo,opciones,errorTexto,useFormParams,defaultValue,className,...props}) => {

    const coleccion = createListCollection({items:opciones})

    return (
        <Field.Root  invalid={errorTexto?true:false}>
        <SelectRoot {...useFormParams} {...props} collection={coleccion} marginBottom="15px" defaultValue={[defaultValue]}  >
            <SelectLabel >{titulo}</SelectLabel>
            <SelectTrigger fontSize="18px" className="selectGeneral" >
                <SelectValueText paddingLeft="10px" placeholder="Seleccione una categoria" />
            </SelectTrigger>
            <SelectContent className={className} >
            {coleccion.items.map((opcion) => (
                <SelectItem  fontSize="18px" padding="10px 0 10px 10px" className="optionGeneral" item={opcion} key={opcion.value}>
                    {opcion.label}
                </SelectItem>
            ))}
            </SelectContent>
        </SelectRoot>
        <Field.ErrorText>{errorTexto}</Field.ErrorText>
        </Field.Root>
    )
}

