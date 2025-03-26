import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  View,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { AppDispatch, RootState } from "../../redux/store";
import { FieldValues, useForm } from "react-hook-form";
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
import { colores } from "../../constants/colores";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { estilosGeneral } from "../../constants/estilosGenerales";
import Entypo from "@expo/vector-icons/Entypo";
import SelectorRegistro from "../../components/tsx/selectorRegistro";
import { obtenerSourceImagen } from "../helpers/obtenerSourceImagen";
import { VentanaEmergente } from "../../components/tsx/ventanaEmergente";
import { seleccionarImagen } from "../helpers/seleccionarImagen";
import { produce } from "immer";

const VentanaImagen = ({
  verImagen,
  setVerImagen,
  productoSeleccionado,
}: {
  verImagen: number;
  setVerImagen: React.Dispatch<React.SetStateAction<number | undefined>>;
  productoSeleccionado: ProductoI;
}) => {
  return (
    <>
      {verImagen === -1 ? (
        <View style={estilos.ventanaVerImagen}>
          {/* <SubirImagen /> */}
          <Pressable
            style={estilosGeneral.botonGeneral1}
            onPress={() => setVerImagen(undefined)}
          >
            <Text style={estilosGeneral.letraBoton1}>Volver</Text>
          </Pressable>
        </View>
      ) : (
        <View style={estilos.ventanaVerImagen}>
          <Image
            style={estilos.ventanaVerImagen__imagen}
            src={obtenerSourceImagen(
              productoSeleccionado.imagenes[verImagen - 1],
            )}
          ></Image>
          <Pressable
            style={estilosGeneral.botonGeneral1}
            onPress={() => setVerImagen(undefined)}
          >
            <Text style={estilosGeneral.letraBoton1}>Volver</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

const VentanaVariante = ({
  verVariante,
  setVerVariante,
  productoSeleccionado,
  setProductoSeleccionado,
}: {
  verVariante: variante;
  setVerVariante: React.Dispatch<React.SetStateAction<variante | undefined>>;
  productoSeleccionado: ProductoI;
  setProductoSeleccionado: React.Dispatch<React.SetStateAction<ProductoI>>;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const confirmarVariante = (data: FieldValues) => {
    // Confirma los cambios en la variante
    const varianteNueva: variante = {
      // Ordena los datos modificables por el usuario en una nueva variante
      ...verVariante, // Copia todas las propiedades de la variante, pero solo modifica las propiedades que son modificables por el usuario
      color: data.color,
      talle: data.talle,
      SKU: data.SKU,
      stock: data.stock,
    };

    let variantesNuevas: variante[];
    if (verVariante._id) {
      // Si la variante es una modificacion de una existente entonces la busca y actualiza
      variantesNuevas = (productoSeleccionado.variantes as variante[]).map(
        (
          variante, // Obtiene el array de variantes con la variante actualizada
        ) => (variante._id === varianteNueva._id ? varianteNueva : variante), // Devuelve la variante modificada si tiene el mismo id y devuelve la variante original si el id es diferente
      );
    } else {
      // Si la variante es nueva entonces la agrega al final de las ya existentes
      variantesNuevas = [
        ...(productoSeleccionado.variantes as variante[]),
        varianteNueva,
      ];
    }

    const productoModificado: ProductoI = {
      ...productoSeleccionado,
      variantes: variantesNuevas,
    };

    setProductoSeleccionado(productoModificado); // Modifica el estado del producto seleccionado para reflejar los cambios en la ventana
    setVerVariante(undefined); // Cierra la ventana emergente para modificar variantes
  };

  return (
    <View style={estilos.ventanaVerProductos__verVariante}>
      <InputRegistro
        name="SKU"
        rules={{
          required: "Este campo no puede estar vacio",
          minLength: 1,
        }}
        error={errors.SKU?.message as string}
        placeholder="Ingrese el SKU"
        titulo="SKU"
        defaultValue={verVariante.SKU}
        control={control}
      />
      <InputRegistro
        name="color"
        rules={{
          required: "Este campo no puede estar vacio",
          minLength: 1,
        }}
        error={errors.color?.message as string}
        placeholder="Ingrese el color"
        titulo="Color"
        defaultValue={verVariante.color}
        control={control}
      />
      <InputRegistro
        name="talle"
        rules={{
          required: "Este campo no puede estar vacio",
          minLength: 1,
        }}
        error={errors.talle?.message as string}
        placeholder="Ingrese el talle"
        titulo="Talle"
        defaultValue={verVariante.talle}
        control={control}
      />
      <InputRegistro
        name="stock"
        rules={{
          required: "Este campo no puede estar vacio",
          minLength: 1,
        }}
        error={errors.stock?.message as string}
        placeholder="Ingrese el stock"
        titulo="Stock"
        defaultValue={verVariante.stock.toString()}
        control={control}
      />

      <View id="ventanaVerProductos__verVariante__botones">
        <Pressable
          style={estilosGeneral.botonGeneral1}
          onPress={handleSubmit(confirmarVariante)}
        >
          <Text style={estilosGeneral.letraBoton1}>Confirmar</Text>
        </Pressable>
        <Pressable
          style={estilosGeneral.botonGeneral2}
          onPress={() => setVerVariante(undefined)}
        >
          <Text style={estilosGeneral.letraBoton2}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
};

const VentanaEspecificacion = ({
  verEspecificacion,
  setVerEspecificacion,
  productoSeleccionado,
  setProductoSeleccionado,
}: {
  verEspecificacion: EspecificacionI;
  setVerEspecificacion: React.Dispatch<
    React.SetStateAction<EspecificacionI | undefined>
  >;
  productoSeleccionado: ProductoI;
  setProductoSeleccionado: React.Dispatch<React.SetStateAction<ProductoI>>;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const confirmarEspecificacion = (data: FieldValues) => {
    // Confirma los cambios en la especificacion

    const especificacionNueva: EspecificacionI = {
      // Ordena los datos modificables por el usuario en una nueva especificacion
      ...verEspecificacion,
      nombre: data.nombre,
      descripcion: data.descripcion,
    };

    // Crea una nueva especificacion con las propiedades modificadas
    let especificacionesNuevas: EspecificacionI[];
    if (verEspecificacion._id) {
      // Si se modifica una especificacion
      especificacionesNuevas = productoSeleccionado.especificaciones.map(
        (
          especificacion, // Obtiene el array de especificaciones con la variante actualizada
        ) =>
          especificacion._id === especificacionNueva._id
            ? especificacionNueva
            : especificacion, // Devuelve la especificacion modificada si tiene el mismo id y devuelve la especificacion original si el id es diferente
      );
    } else {
      // Si la especficacion es nueva (no tiene id)
      especificacionesNuevas = [
        ...productoSeleccionado.especificaciones,
        especificacionNueva,
      ];
    }

    const productoLocalModificado: ProductoI = {
      ...productoSeleccionado, // Coloca todas las propiedades del producto local
      especificaciones: especificacionesNuevas, // Modifica solo la propiedad de especificaciones, la cual esta modificada
    };

    setProductoSeleccionado(productoLocalModificado); // Aplica los cambios en el componente
    setVerEspecificacion(undefined); // Cierra la ventana emergente para modificar especificaciones
  };

  return (
    <View style={estilos.ventanaVerProductos__verVariante}>
      <InputRegistro
        name="nombre"
        titulo="Nombre"
        rules={{
          required: "Este campo no puede estar vacio",
          minLength: 1,
        }}
        error={errors.nombre?.message as string}
        placeholder="Ingrese el nombre"
        defaultValue={verEspecificacion.nombre}
        control={control}
      />
      <InputRegistro
        name="descripcion"
        titulo="Descripcion"
        rules={{
          required: "Este campo no puede estar vacio",
          minLength: 1,
        }}
        defaultValue={verEspecificacion.descripcion}
        placeholder="Ingrese la descripcion"
        control={control}
        multiline={true}
        maxLength={400}
      />

      <View style={estilos.ventanaVerProductos__verVariante__botones}>
        <Pressable
          style={estilosGeneral.botonGeneral1}
          onPress={handleSubmit(confirmarEspecificacion)}
        >
          <Text style={estilosGeneral.letraBoton1}>Confirmar</Text>
        </Pressable>
        <Pressable
          style={estilosGeneral.botonGeneral2}
          onPress={() => setVerEspecificacion(undefined)}
        >
          <Text style={estilosGeneral.letraBoton1}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function VentanaVerProducto() {
  const { productoId } = useLocalSearchParams();

  // Estados
  const [verVariante, setVerVariante] = useState<variante | undefined>(
    undefined,
  );
  const [verEspecificacion, setVerEspecificacion] = useState<
    EspecificacionI | undefined
  >(undefined);
  const [verImagen, setVerImagen] = useState<number | undefined>(undefined);
  const [esVentanaEmergente, setVentanaEmergente] = useState(false);
  const [esEliminarProducto, setEliminarProducto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoI>(
    useSelector((state: RootState) => {
      let producto = state.productos.productos.find(
        (producto) => producto._id === productoId,
      );
      if (!producto) {
        // Si no encuentra el producto es porque es un producto nuevo, entonces coloca informacion vacia en el producto seleccionado
        producto = {
          _id: "",
          nombre: "",
          marca: "",
          modelo: "",
          estado: false,
          usuario: "",
          categoria: "",
          categoriaNombre: "",
          variantes: [],
          descripcion: "",
          precio: 0,
          precioViejo: 0,
          especificaciones: [],
          disponible: false,
          tags: [],
          imagenes: [],
        };
      }
      return producto!;
    }),
  );
  const [selectorAbierto, setSelectorAbierto] = useState(false);

  const router = useRouter();

  // Redux
  const categorias = useSelector(
    (state: RootState) => state.categorias.categorias,
  );
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm(); // TODO Manejar errores del formulario

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
    router.back();
  };

  const agregarImagen = async () => {
    const imagen64 = await seleccionarImagen();
    if (!imagen64) return;
    setProductoSeleccionado(
      produce(productoSeleccionado, (borrador) => {
        borrador.imagenes.push(imagen64); // Actualiza el estado
      }),
    );
    // TODO Chequear que no se suba la misma imagen ya que sino el componente va a tener la misma key
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
    setEliminarProducto(false);
    // Si el usuario presiona que si entonces elimina el producto
    const productoID = productoSeleccionado._id;
    if (!tokenAcceso) {
      dispatch(mostrarMensaje({ mensaje: "Sesion Caducada", esError: true })); // TODO: Vuelve al inicio de sesion
      return;
    }
    dispatch(eliminarProductoRedux({ productoID }));
    // volverVentanaProductos(); // Vuelve al menu de productos
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
        router.back();
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
                onPress={handleSubmit(confirmarProducto)}
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
      <ScrollView
        style={estilos.ventanaVerProductos}
        scrollEnabled={!selectorAbierto}
      >
        <View style={estilos.ventanaVerProducto__form}>
          <InputRegistro
            control={control}
            titulo="Nombre"
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
            titulo="Precio"
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
          <SelectorRegistro
            setSelectorAbierto={setSelectorAbierto}
            name={"categoriaID"}
            titulo="Categoria"
            defaultValue={(productoSeleccionado?.categoria as CategoriaI)._id}
            opciones={categorias.map((categoria) => {
              return { value: categoria._id, label: categoria.nombre };
            })}
            control={control}
            rules={{
              required: true,
              minLength: {
                value: 1,
                message: "Este campo no puede estar vacio",
              },
            }}
            error={errors.categoriaID?.message?.toString()}
          />
          <InputRegistro
            control={control}
            titulo="Marca"
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
            titulo="Modelo"
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
          <Text style={estilos.ventanaVerProductos__titulo}>Imagenes</Text>
          <View style={estilos.ventanaVerProducto__imagenes_div}>
            {productoSeleccionado?.imagenes.map((imagen, index) => (
              <Pressable
                onPress={() => setVerImagen(index + 1)}
                style={[
                  estilosGeneral.inputGeneral,
                  estilos.ventanaVerProducto__botonImagen,
                ]}
                key={imagen.slice(10, 30)}
              >
                <Text style={{ color: colores.letra }}>{index + 1}</Text>
              </Pressable>
            ))}
            <Pressable
              style={[
                estilosGeneral.inputGeneral,
                estilos.ventanaVerProducto__agregarImagen,
              ]}
              onPress={() => agregarImagen()}
            >
              <AntDesign name="plus" size={24} color="white" />
            </Pressable>
          </View>
          <Text style={estilos.ventanaVerProductos__titulo}>Variantes</Text>
          {(productoSeleccionado?.variantes as variante[]).map((variante) => (
            <Pressable
              onPress={() => setVerVariante(variante)}
              style={estilosGeneral.inputGeneral}
              key={variante._id || new Date().getTime() * Math.random()}
            >
              <Text style={{ color: colores.letra }}>{variante.SKU}</Text>
            </Pressable>
          ))}
          <Pressable
            style={[
              estilosGeneral.inputGeneral,
              estilos.ventanaVerProducto__agregarVariante,
            ]}
            onPress={() => setVerVariante(varianteNueva)}
          >
            <AntDesign name="plus" size={24} color="white" />
          </Pressable>
          <Text style={estilos.ventanaVerProductos__titulo}>
            Especificaciones
          </Text>
          {(productoSeleccionado?.especificaciones as EspecificacionI[]).map(
            (especificacion) => (
              <Pressable
                key={especificacion._id || new Date().getTime() * Math.random()}
                onPress={() => setVerEspecificacion(especificacion)}
                className="inputGeneral inputGeneral-sinIcono"
                style={estilosGeneral.inputGeneral}
              >
                <Text style={{ color: colores.letra }}>
                  {especificacion.nombre}
                </Text>
              </Pressable>
            ),
          )}
          <Pressable
            style={[
              estilosGeneral.inputGeneral,
              estilos.ventanaVerProducto__agregarEspecificacion,
            ]}
            onPress={() => setVerEspecificacion(especificacionNueva)}
          >
            <AntDesign name="plus" size={24} color="white" />
          </Pressable>
          <Pressable
            style={[
              estilosGeneral.botonGeneral1,
              estilos.ventanaVerProducto__eliminarProducto,
            ]}
            onPress={() => {
              setVentanaEmergente(true);
            }}
          >
            <Text style={{ color: colores.letra }}>Eliminar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={verImagen ? true : false}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVerImagen(undefined)}
      >
        <Pressable
          style={estilosGeneral.fondoModal}
          onPress={() => setVerImagen(undefined)}
        >
          <VentanaImagen
            verImagen={verImagen!}
            setVerImagen={setVerImagen}
            productoSeleccionado={productoSeleccionado}
          />
        </Pressable>
      </Modal>
      <Modal
        visible={verVariante ? true : false}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVerVariante(undefined)}
      >
        <Pressable
          style={estilosGeneral.fondoModal}
          onPress={() => setVerVariante(undefined)}
        >
          <VentanaVariante
            verVariante={verVariante!}
            setVerVariante={setVerVariante}
            productoSeleccionado={productoSeleccionado}
            setProductoSeleccionado={setProductoSeleccionado}
          />
        </Pressable>
      </Modal>
      <Modal
        visible={verEspecificacion ? true : false}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setVerEspecificacion(undefined)}
      >
        <Pressable
          style={estilosGeneral.fondoModal}
          onPress={() => setVerEspecificacion(undefined)}
        >
          <VentanaEspecificacion
            verEspecificacion={verEspecificacion!}
            setVerEspecificacion={setVerEspecificacion}
            productoSeleccionado={productoSeleccionado}
            setProductoSeleccionado={setProductoSeleccionado}
          />
        </Pressable>
      </Modal>

      <VentanaEmergente
        visible={esVentanaEmergente}
        mensaje="¿Estas seguro que desea eliminar el producto?"
        funcionAceptar={setEliminarProducto}
        funcionAceptarParams={true}
        funcionRechazar={setVentanaEmergente}
        funcionRechazarParams={false}
      />
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
    color: colores.letra,
    fontSize: 15,
    marginTop: 10,
  },

  ventanaVerProducto__form: {
    flexDirection: "column",
    width: "80%",
    marginHorizontal: "10%",
    marginTop: 10,
  },

  ventanaVerProducto__imagenes_div: {
    flexDirection: "row",
    alignItems: "center",
  },

  ventanaVerProducto__botonImagen: {
    alignSelf: "flex-start",
    padding: 20,
    margin: 5,
  },

  ventanaVerProducto__agregarImagen: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    width: 45,
    margin: 5,
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
    backgroundColor: colores.fondo, // Reemplaza con var(--fondo)
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
    alignItems: "center",
    backgroundColor: colores.fondo,
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },

  ventanaVerImagen__imagen: {
    height: 300,
    width: 300,
    objectFit: "contain",
    backgroundColor: "white",
    borderRadius: 20,
  },

  ventanaVerProducto__eliminarProducto: {
    marginTop: 30,
    backgroundColor: colores.botonNegativo,
    alignItems: "center",
  },
});
