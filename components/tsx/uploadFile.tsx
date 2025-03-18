"use client"

import {
  Button,
  FileUpload,
  Float,
  useFileUploadContext,
} from "@chakra-ui/react"
import { LuFileImage, LuX } from "react-icons/lu"

const FileUploadList = () => {
    const fileUpload = useFileUploadContext()
    const files = fileUpload.acceptedFiles
    if (files.length === 0) return null
    return (
        <FileUpload.ItemGroup>
        {files.map((file) => (
            <FileUpload.Item
            boxSize="20"
            width="100%"
            height="100%"
            file={file}
            key={file.name}
            >
            <FileUpload.ItemPreviewImage 
            objectFit="cover"
            width="100%"
            height="100%"/>
            <Float placement="top-end">
                <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
                </FileUpload.ItemDeleteTrigger>
            </Float>
            </FileUpload.Item>
        ))}
        </FileUpload.ItemGroup>
    )
}

export const SubirImagen = () => {
    return (
        <FileUpload.Root accept="image/*">
            <FileUpload.HiddenInput />
                <FileUpload.Trigger asChild padding="0px">
                    <Button variant="outline" alignSelf="center" size="sm">
                        <LuFileImage /> Subir Imagen
                    </Button>
                </FileUpload.Trigger>
            <FileUploadList  />
        </FileUpload.Root>
    )
}
