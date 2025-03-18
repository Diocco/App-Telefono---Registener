import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  SectionList,
  ActivityIndicator,
  View,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
import { AppDispatch, RootState } from "../../redux/store";
import { FieldValues, useForm, Controller } from "react-hook-form";
import { CategoriaI } from "../../interfaces/categorias";
import { variante } from "../../interfaces/variante";
import { useState } from "react";
import { EspecificacionI, ProductoI } from "../../interfaces/producto";
import {
  actualizarProducto,
  eliminarProductoRedux,
} from "../../redux/productosSlice";
import { obtenerFormatoImagen } from "../helpers/obtenerFormatoImagen";
import {
  solicitudCrearProducto,
  solicitudEliminarProducto,
} from "../../services/productosAPI";
import { mostrarMensaje } from "../../redux/mensajeEmergenteSlice";
import { InputRegistro } from "../../components/tsx/inputRegistro";
import { colores } from "@/constants/colores";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useNavigation, useRouter } from "expo-router";
import { estilosGeneral } from "../../constants/estilosGenerales";
import Entypo from "@expo/vector-icons/Entypo";


// const VentanaImagen = ({
//   verImagen,
//   setVerImagen,
//   productoSeleccionado,
// }: {
//   verImagen: number;
//   setVerImagen: React.Dispatch<React.SetStateAction<number | undefined>>;
//   productoSeleccionado: ProductoI;
// }) => {
//   let source: string | undefined = undefined;
//   if (verImagen > -1) {
//     const imagen64 = productoSeleccionado.imagenes[verImagen - 1];
//     const formato = obtenerFormatoImagen(imagen64);
//     source = `data:image/${formato};base64,${imagen64}`;
//   } else {
//     source = "../src/assets/images/sinfoto.png";
//   }

//   return (
//     <>
//       {verImagen === -1 ? (
//         <View id="ventanaVerImagen">
//           <SubirImagen />
//           <Pressable
//             className="botonGeneral2"
//             onClick={() => setVerImagen(undefined)}
//           >
//             Volver
//           </Pressable>
//         </View>
//       ) : (
//         <View id="ventanaVerImagen">
//           <img src={source}></img>
//           <Pressable
//             className="botonGeneral2"
//             onClick={() => setVerImagen(undefined)}
//           >
//             Volver
//           </Pressable>
//         </View>
//       )}
//     </>
//   );
// };

// const VentanaVariante = ({
//   verVariante,
//   setVerVariante,
//   productoSeleccionado,
//   setproductoSeleccionado,
// }: {
//   verVariante: variante;
//   setVerVariante: React.Dispatch<React.SetStateAction<variante | undefined>>;
//   productoSeleccionado: ProductoI;
//   setproductoSeleccionado: React.Dispatch<React.SetStateAction<ProductoI | undefined>>;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const confirmarVariante = (data: FieldValues) => {
//     // Confirma los cambios en la variante

//     const varianteNueva: variante = {
//       // Ordena los datos modificables por el usuario en una nueva variante
//       ...verVariante, // Copia todas las propiedades de la variante, pero solo modifica las propiedades que son modificables por el usuario
//       color: data.color,
//       talle: data.talle,
//       SKU: data.SKU,
//       stock: data.stock,
//     };

//     let variantesNuevas: variante[];
//     if (verVariante._id) {
//       // Si la variante es una modificacion de una existente entonces la busca y actualiza
//       variantesNuevas = (productoSeleccionado.variantes as variante[]).map(
//         (
//           variante, // Obtiene el array de variantes con la variante actualizada
//         ) => (variante._id === varianteNueva._id ? varianteNueva : variante), // Devuelve la variante modificada si tiene el mismo id y devuelve la variante original si el id es diferente
//       );
//     } else {
//       // Si la variante es nueva entonces la agrega al final de las ya existentes
//       variantesNuevas = [
//         ...(productoSeleccionado.variantes as variante[]),
//         varianteNueva,
//       ];
//     }

//     const productoLocalModificado: ProductoI = {
//       ...productoSeleccionado, // Coloca todas las propiedades del producto local
//       variantes: variantesNuevas, // Modifica solo la propiedad de variantes, la cual esta modificada
//     };

//     setproductoSeleccionado(productoLocalModificado); // Aplica los cambios en el componente
//     setVerVariante(undefined); // Cierra la ventana emergente para modificar variantes
//   };

//   return (
//     <form
//       id="ventanaVerProductos__verVariante"
//       onSubmit={handleSubmit((data) => confirmarVariante(data))}
//     >
//       <InputRegistro
//         useFormParams={{
//           ...register("SKU", {
//             required: "Este campo no puede estar vacio",
//             minLength: 1,
//           }),
//         }}
//         textoError={errors.SKU?.message as string}
//         placeholder="Ingrese el SKU"
//         titulo="SKU"
//         defaultValue={verVariante.SKU}
//       />
//       <InputRegistro
//         useFormParams={{
//           ...register("color", {
//             required: "Este campo no puede estar vacio",
//             minLength: 1,
//           }),
//         }}
//         textoError={errors.color?.message as string}
//         placeholder="Ingrese el color"
//         titulo="Color"
//         defaultValue={verVariante.color}
//       />
//       <InputRegistro
//         useFormParams={{
//           ...register("talle", {
//             required: "Este campo no puede estar vacio",
//             minLength: 1,
//           }),
//         }}
//         textoError={errors.talle?.message as string}
//         placeholder="Ingrese el talle"
//         titulo="Talle"
//         defaultValue={verVariante.talle}
//       />
//       <InputRegistro
//         useFormParams={{
//           ...register("stock", {
//             required: "Este campo no puede estar vacio",
//             minLength: 1,
//           }),
//         }}
//         textoError={errors.stock?.message as string}
//         placeholder="Ingrese el stock"
//         titulo="Stock"
//         type="number"
//         defaultValue={verVariante.stock}
//       />

//       <View id="ventanaVerProductos__verVariante__botones">
//         <Pressable className="botonGeneral">Confirmar</Pressable>
//         <Pressable
//           className="botonGeneral2"
//           type="Pressable"
//           onClick={() => setVerVariante(undefined)}
//         >
//           Cancelar
//         </Pressable>
//       </View>
//     </form>
//   );
// };

// const VentanaEspecificacion = ({
//   verEspecificacion,
//   setVerEspecificacion,
//   productoSeleccionado,
//   setproductoSeleccionado,
// }: {
//   verEspecificacion: EspecificacionI;
//   setVerEspecificacion: React.Dispatch<
//     React.SetStateAction<EspecificacionI | undefined>
//   >;
//   productoSeleccionado: ProductoI;
//   setproductoSeleccionado: React.Dispatch<React.SetStateAction<ProductoI | undefined>>;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const confirmarEspecificacion = (data: FieldValues) => {
//     // Confirma los cambios en la especificacion

//     const especificacionNueva: EspecificacionI = {
//       // Ordena los datos modificables por el usuario en una nueva especificacion
//       ...verEspecificacion,
//       nombre: data.nombre,
//       descripcion: data.descripcion,
//     };

//     // Crea una nueva especificacion con las propiedades modificadas
//     let especificacionesNuevas: EspecificacionI[];
//     if (verEspecificacion._id) {
//       // Si se modifica una especificacion
//       especificacionesNuevas = productoSeleccionado.especificaciones.map(
//         (
//           especificacion, // Obtiene el array de especificaciones con la variante actualizada
//         ) =>
//           especificacion._id === especificacionNueva._id
//             ? especificacionNueva
//             : especificacion, // Devuelve la especificacion modificada si tiene el mismo id y devuelve la especificacion original si el id es diferente
//       );
//     } else {
//       // Si la especficacion es nueva (no tiene id)
//       especificacionesNuevas = [
//         ...productoSeleccionado.especificaciones,
//         especificacionNueva,
//       ];
//     }

//     const productoLocalModificado: ProductoI = {
//       ...productoSeleccionado, // Coloca todas las propiedades del producto local
//       especificaciones: especificacionesNuevas, // Modifica solo la propiedad de especificaciones, la cual esta modificada
//     };

//     setproductoSeleccionado(productoLocalModificado); // Aplica los cambios en el componente
//     setVerEspecificacion(undefined); // Cierra la ventana emergente para modificar especificaciones
//   };

//   return (
//     <form
//       id="ventanaVerProductos__verVariante"
//       onSubmit={handleSubmit((data) => confirmarEspecificacion(data))}
//     >
//       <InputRegistro
//         useFormParams={{
//           ...register("nombre", {
//             required: "Este campo no puede estar vacio",
//             minLength: 1,
//           }),
//         }}
//         textoError={errors.nombre?.message as string}
//         placeholder="Ingrese el nombre"
//         titulo="Nombre"
//         defaultValue={verEspecificacion.nombre}
//       />
//       <h4 className="inputGeneral-h4">Descripcion</h4>
//       <textarea
//         {...register("descripcion", {
//           required: "Este campo no puede estar vacio",
//           minLength: 1,
//         })}
//         className="inputGeneral inputGeneral-sinIcono textAreaGeneral"
//         name="descripcion"
//         defaultValue={verEspecificacion.descripcion}
//         placeholder="Ingrese la descripcion"
//       ></textarea>

//       <View id="ventanaVerProductos__verVariante__botones">
//         <Pressable className="botonGeneral">Confirmar</Pressable>
//         <Pressable
//           className="botonGeneral2"
//           type="Pressable"
//           onClick={() => setVerEspecificacion(undefined)}
//         >
//           Cancelar
//         </Pressable>
//       </View>
//     </form>
//   );
// };

export default function VentanaVerProducto() {
  const router = useRouter();

  const categorias = useSelector(
    (state: RootState) => state.categorias.categorias,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(); // TODO Manejar errores del formulario
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  );

  const productoSeleccionado: ProductoI = useSelector(
    (state: RootState) => state.productos.productos[0],
  );
  // State para alternar ventanas emergentes
  const [verVariante, setVerVariante] = useState<variante | undefined>(
    undefined,
  );
  const [verEspecificacion, setVerEspecificacion] = useState<
    EspecificacionI | undefined
  >(undefined);
  const [verImagen, setVerImagen] = useState<number | undefined>(undefined);
  const [esVentanaEmergente, setVentanaEmergente] = useState(false);
  const [esEliminarProducto, setEliminarProducto] = useState(false);

  // Dispatch para usar funciones globales
  const dispatch = useDispatch<AppDispatch>();

  // Funcion que actualiza el producto en la base de datos
  const confirmarProducto = async (data: FieldValues) => {
    const categoria = categorias.find(
      (categoria) => categoria._id === data.categoriaID,
    ); // Busca el id de las categoria seleccionada

    if (!categoria) {
      console.error("No se encontro la categoria");
      return;
    }
    const productoActualizado: ProductoI = {
      // Ordena los datos modificables por el usuario en un nuevo producto con las propiedades modificadas
      ...productoSeleccionado!,
      nombre: data.nombre,
      precio: data.precio,
      descripcion: data.descripcion,
      categoria: categoria,
      marca: data.marca,
      modelo: data.modelo,
    };
    if (!productoActualizado._id) {
      // Si el producto es nuevo entonces envia la solicitud al servidor
      const productoServidor = await solicitudCrearProducto(
        productoActualizado,
        tokenAcceso,
      ); // Agrega el nuevo producto en la base de datos global y lo recibe de vuelta con el ID
      if (!productoServidor)
        return console.error("No se pudo crear el producto");
      dispatch(actualizarProducto({ productoActualizado: productoServidor })); // Actualiza el producto en la variable global
    } else {
      dispatch(actualizarProducto({ productoActualizado })); // Actualiza el producto en la variable global
    }
    volverVentanaProductos(); // Cierra la ventana emergente para modificar el producto
  };

  // Variables que ayudan a agregar elementos dentro del producto
  const especificacionNueva: EspecificacionI = {
    nombre: "",
    _id: "",
    descripcion: "",
  };
  const varianteNueva: variante = {
    producto: productoSeleccionado._id,
    color: "",
    talle: "",
    SKU: new Date().getTime().toString(),
    stock: 0,
    esFavorito: false,
    usuario: productoSeleccionado.usuario,
  };

  if (esEliminarProducto) {
    // Si el usuario presiona que si entonces elimina el producto
    setEliminarProducto(false);
    const productoID = productoSeleccionado._id;
    if (!tokenAcceso) {
      dispatch(mostrarMensaje({ mensaje: "Sesion Caducada", esError: true })); // TODO: Vuelve al inicio de sesion
      return;
    }
    dispatch(eliminarProductoRedux({ productoID }));
    volverVentanaProductos(); // Vuelve al menu de productos
    solicitudEliminarProducto(productoID, tokenAcceso) // Elimina el producto de la base de datos del servidor
      .then((respuesta) => {
        if (respuesta !== 0) {
          dispatch(
            mostrarMensaje({
              mensaje: "No se pudo eliminar el producto",
              esError: true,
            }),
          );
          return;
        }
      });
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => {
            return (
              <Pressable
                style={estilosGeneral.encabezado__boton}
                onPress={() => router.back()}
              >
                <Entypo name="chevron-left" size={40} color="white" />
              </Pressable>
            );
          },
          headerTitleAlign: "center",
          headerTitle: () => {
            return <Text style={estilosGeneral.letraBoton1}>Ver producto</Text>;
          },
        }}
      />
      <View style={estilos.ventanaVerProductos}>
        {/* <View className="encabezado">
          <Pressable

            id="ventanaVerProductos__volver"
            data-testid="botonVolver"
            onPress={handleSubmit((data) => {
              confirmarProducto(data);
            })}
            className="botonGeneral"
          >
            <Entypo name="chevron-left" size={24} color="black" />
          </Pressable>
          <Text id="ventanaVerProductos__titulo">Ver producto</Text>
        </View> */}
        <View style={estilos.ventanaVerProducto__form}>
          <InputRegistro
            control={control}
            name="nombre"
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Este campo no puede estar vacio",
              },
            }}
            defaultValue={productoSeleccionado.nombre}
            placeholder={"Ingrese el nombre"}
            error={errors.nombre?.message as string}
          />
          <InputRegistro
            control={control}
            name="precio"
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Este campo no puede estar vacio",
              },
            }}
            defaultValue={productoSeleccionado.precio.toString()}
            placeholder={"Ingrese el precio"}
            error={errors.precio?.message as string}
          />
          {/* <Selector
            useFormParams={register("categoriaID")}
            className="inputGeneral inputGeneral-sinIcono"
            defaultValue={(productoSeleccionado?.categoria as CategoriaI)._id}
            titulo={"Categoria"}
            opciones={categorias.map((categoria) => {
              return { value: categoria._id, label: categoria.nombre };
            })}
          /> */}
          <InputRegistro
            control={control}
            name="marca"
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Este campo no puede estar vacio",
              },
            }}
            defaultValue={productoSeleccionado.marca}
            placeholder={"Ingrese la marca"}
            error={errors.marca?.message as string}
          />
          <InputRegistro
            control={control}
            name="modelo"
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Este campo no puede estar vacio",
              },
            }}
            defaultValue={productoSeleccionado.modelo}
            placeholder={"Ingrese el modelo"}
            error={errors.modelo?.message as string}
          />
          {/* <Text className="inputGeneral-h4">Imagenes</Text>
          <View id="ventanaVerProducto__imagenes-View">
            <View>
              {productoSeleccionado?.imagenes.map((imagen, index) => (
                <Pressable
                  onClick={() => setVerImagen(index + 1)}
                  className="inputGeneral ventanaVerProducto__botonImagen"
                  type="Pressable"
                  key={imagen.slice(10, 30)}
                >
                  {index + 1}
                </Pressable>
              ))}
            </View>
            <Pressable
              id="ventanaVerProducto__agregarImagen"
              type="Pressable"
              onClick={() => setVerImagen(-1)}
              className="inputGeneral"
            >
              <FontAwesomeIcon icon={faPlus} />
            </Pressable>
          </View>
          <h4 className="inputGeneral-h4">Variantes</h4>
          {(productoSeleccionado?.variantes as variante[]).map((variante) => (
            <Pressable
              type="Pressable"
              onClick={() => setVerVariante(variante)}
              className="inputGeneral inputGeneral-sinIcono"
              key={variante._id || new Date().getTime() * Math.random()}
            >
              {variante.SKU}
            </Pressable>
          ))}
          <Pressable
            data-testid="boton-agregarVariante"
            id="ventanaVerProducto__agregarVariante"
            type="Pressable"
            onClick={() => setVerVariante(varianteNueva)}
            className="inputGeneral"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Pressable>
          <h4 className="inputGeneral-h4">Especificaciones</h4>
          {(productoSeleccionado?.especificaciones as EspecificacionI[]).map(
            (especificacion) => (
              <Pressable
                type="Pressable"
                key={especificacion._id || new Date().getTime() * Math.random()}
                onClick={() => setVerEspecificacion(especificacion)}
                className="inputGeneral inputGeneral-sinIcono"
              >
                {especificacion.nombre}
              </Pressable>
            ),
          )}
          <Pressable
            data-testid="boton-agregarEspecificacion"
            id="ventanaVerProducto__agregarEspecificacion"
            type="Pressable"
            onClick={() => setVerEspecificacion(especificacionNueva)}
            className="inputGeneral"
          >
            <FontAwesomeIcon icon={faPlus} />
          </Pressable>
          <Pressable
            id="ventanaVerProducto__eliminarProducto"
            type="Pressable"
            onClick={() => {
              setVentanaEmergente(true);
            }}
            className="botonGeneral2"
          >
            Eliminar
          </Pressable> */}
        </View>
      </View>

      {/* {(verVariante || verEspecificacion || verImagen) && (
        <View id="ventanasFondo">
          {verVariante && (
            <VentanaVariante
              verVariante={verVariante}
              setVerVariante={setVerVariante}
              productoSeleccionado={productoSeleccionado}
              setproductoSeleccionado={setproductoSeleccionado}
            />
          )}
          {verEspecificacion && (
            <VentanaEspecificacion
              verEspecificacion={verEspecificacion}
              setVerEspecificacion={setVerEspecificacion}
              productoSeleccionado={productoSeleccionado}
              setproductoSeleccionado={setproductoSeleccionado}
            />
          )}
          {verImagen && (
            <VentanaImagen
              verImagen={verImagen}
              setVerImagen={setVerImagen}
              productoSeleccionado={productoSeleccionado}
            />
          )}
        </View>
      )}

      {esVentanaEmergente && (
        <VentanaEmergente
          mensaje="¿Estas seguro que desea eliminar el producto?"
          funcionAceptar={setEliminarProducto}
          funcionAceptarParams={true}
          funcionRechazar={setVentanaEmergente}
          funcionRechazarParams={false}
        />
      )} */}
    </>
  );
}

const estilos = StyleSheet.create({
  ventanaVerProductos: {
    flex: 1,
    zIndex: 300,
    flexDirection: "column",
    width: "100%",
    backgroundColor: colores.fondo, // Reemplaza con var(--fondo)
  },

  ventanaVerProductos__indice: {
    justifyContent: "center",
    flexDirection: "row",
  },

  ventanaVerProductos__volver: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  ventanaVerProductos__titulo: {
    textAlign: "center",
  },

  ventanaVerProducto__form: {
    flexDirection: "column",
    width: "80%",
    marginHorizontal: "10%",
    marginTop: 10,
  },

  ventanaVerProducto__imagenes_div: {
    flexDirection: "row",
  },

  ventanaVerProducto__botonImagen: {
    alignSelf: "flex-start",
    padding: 20,
    marginVertical: 10,
  },

  ventanaVerProducto__agregarImagen: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 10,
  },

  ventanaVerProducto__agregarVariante: {
    padding: 10,
    alignSelf: "center",
  },

  ventanaVerProducto__agregarEspecificacion: {
    padding: 10,
    alignSelf: "center",
  },

  ventanasFondo: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.329)",
    zIndex: 5000,
  },

  ventanaVerProductos__verVariante: {
    height: "auto",
    backgroundColor: "#f0f0f0", // Reemplaza con var(--fondo)
    borderWidth: 0,
    padding: 20,
    borderRadius: 30,
    width: "80%",
  },

  ventanaVerProductos__verVariante__botones: {
    flexDirection: "column",
    marginTop: 20,
  },

  ventanaVerImagen: {
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#f0f0f0", // Reemplaza con var(--fondo)
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },

  ventanaVerProducto__eliminarProducto: {
    margin: 50,
    backgroundColor: "#ff0000", // Reemplaza con var(--botonNegativo)
  },
});
