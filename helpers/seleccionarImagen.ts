import * as ImagePicker from "expo-image-picker";

export const seleccionarImagen = async () => {
  // Abre una ventana emergente para que el usuario pueda elegir una imagen de su galeria
  let resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    base64: true, // Convertir a Base64
    quality: 0.8, // Reducir calidad si es necesario
  });

  if (!resultado.canceled) return resultado.assets[0].base64; // Si todo sale bien devuelve el base64 de la imagen

  return undefined;
};
