import { useQuery } from "react-query";
import { CategoriaI } from "../interfaces/categorias";
import { ProductoI } from "../interfaces/producto";
import { solicitudObtenerProductos } from "../services/productosAPI";
import { useState } from "react";
import {
  Text,
  SectionList,
  ActivityIndicator,
  View,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";

// Variables globales
import { definirProductos, filtrarProductos } from "../redux/productosSlice";
import { definirCategorias } from "../redux/categoriasSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
// import { VentanaVerProducto } from "./ventanaVerProducto";
import { ordenarProductos } from "./helpers/ordenarProductos";
import { obtenerSourceImagen } from "./helpers/obtenerSourceImagen";

// Iconos
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Variables globales
import { colores } from "../constants/colores";
import { estilosGeneral } from "../constants/estilosGenerales";

interface RespuestaProductos {
  productos: ProductoI[];
  categoriasCompletas: CategoriaI[];
  paginasCantidad: number;
}

const productoNuevo: ProductoI = {
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

// const VentanaConfiguracionProductos = ({
//   setEsVerConfiguracion,
// }: {
//   setEsVerConfiguracion: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario); // Obtiene los productos de la variable global
//   const dispatch = useDispatch<AppDispatch>();

//   const alternarEsAgruparCategoria = (estado: boolean) => {
//     if (!estado) dispatch(filtrarProductos({ categoriasBuscadas: [] }));
//     dispatch(modificarPreferencias({ esAgruparCategoria: estado }));
//   }; // Cada vez que el switch cambia se ejecuta el cambio en el estado global

//   return (
//     <View id="ventanaProductos__ventanaConfiguracion">
//       <View id="ventanaProductos__ventanaConfiguracion-View">
//         <SwitchGeneral1
//           titulo="Agrupar por categorias"
//           onPress={alternarEsAgruparCategoria}
//           valorInicial={usuario!.preferencias.esAgruparCategoria}
//         />
//         <SwitchGeneral1
//           titulo="Agrupar por producto"
//           onPress={() => {}}
//           valorInicial={false}
//         />
//         <BotonGeneral1
//           id="ventanaProductos__ventanaConfiguracion-Pressable"
//           onPress={() => setEsVerConfiguracion(false)}
//           titulo="Aceptar"
//         />
//       </View>
//     </View>
//   );
// };

// const FiltrosCategorias = ({
//   categoria,
//   categoriasBuscadas,
//   alternarCategoriaBuscada,
// }: {
//   categoria: CategoriaI;
//   categoriasBuscadas: string[];
//   alternarCategoriaBuscada: Function;
// }) => {
//   let clase: string = "ventanaProductos__filtroCategoria__categoria"; // Clase por defecto

//   if (categoriasBuscadas.length > 0) {
//     // Verifica si existen clases buscadas en este momento
//     if (categoriasBuscadas.includes(categoria.nombre))
//       clase += " ventanaProductos__filtroCategoria__categoria-active"; // Verifica que la clase en el filtro este siendo buscada, de ser asi la marca visualmente como activa
//   }

//   return (
//     <span
//       className={clase}
//       onPress={() => alternarCategoriaBuscada(categoria.nombre)}
//     >
//       {categoria.nombre}
//     </span>
//   );
// };

export default function VentanaProductos({
  volverVentanaInicial,
  esDesaparecer,
}: {
  volverVentanaInicial: Function;
  esDesaparecer: boolean;
}) {
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  ); // Obtiene el token de acceso de la variable global
  const productosTotales = useSelector(
    (state: RootState) => state.productos.productos,
  ); // Obtiene los productos de la variable global
  const productos = useSelector(
    (state: RootState) => state.productos.productosFiltrados,
  ); // Obtiene los productos de la variable global
  const categoriasBuscadas = useSelector(
    (state: RootState) => state.productos.categoriasBuscadas,
  ); // Obtiene los productos de la variable global
  const esAgruparCategoria = useSelector(
    (state: RootState) =>
      state.tokenAcceso.usuario?.preferencias.esAgruparCategoria,
  ); // Obtiene los productos de la variable global
  const categorias = useSelector(
    (state: RootState) => state.categorias.categorias,
  );

  const [esVerProducto, setEsVerProducto] = useState<ProductoI | undefined>(
    undefined,
  );
  const [esVerConfiguracion, setEsVerConfiguracion] = useState<boolean>(false);

  const productosOrdenados = ordenarProductos(productos);

  const reduxDispatch = useDispatch();
  // Si no hay productos en la variable global entonces seria la solicitud al servidor para obtenerlos
  const { isError, isLoading } = useQuery<RespuestaProductos>(
    "productos",
    () =>
      solicitudObtenerProductos(
        tokenAcceso,
        "",
        "20",
        "",
        "",
        "",
        "",
        "",
        "true",
      ),
    {
      enabled: productosTotales.length < 1, // Condicion para realizar la solicitud
      onSuccess: (data) => {
        reduxDispatch(definirProductos(data.productos)); // Almacena los productos como variable global
        reduxDispatch(definirCategorias(data.categoriasCompletas)); // Almacena los productos como variable global
      },
    },
  );

  const [esTransicion, setEsTransicion] = useState<boolean>(false); // Indica a la ventana que tiene que hacer la animacion de desaparecer

  const volverVentanaProductos = () => {
    setEsTransicion(true); // Indica a cualquier ventana activa que tiene que comenzar a hacer la animacion de desaparecer
    setTimeout(() => {
      setEsVerProducto(undefined); // Desactiva todas las ventanas activas
      setEsTransicion(false); // Finaliza la animacion de desaparecer
    }, 180);
  };

  const alternarCategoriaBuscada = (categoria: string) => {
    const categoriasBuscadasActual = [...categoriasBuscadas]; // Copia el array de categorias filtradas
    const index = categoriasBuscadasActual.findIndex(
      (categoriaBuscada) => categoriaBuscada === categoria,
    );

    if (index === -1) {
      // Si la categoria no existe en las categorias filtradas entonces la agrega
      categoriasBuscadasActual.push(categoria);
      reduxDispatch(
        filtrarProductos({ categoriasBuscadas: categoriasBuscadasActual }),
      );
    } else {
      // Si existe lo elimina
      categoriasBuscadasActual.splice(index, 1);
      reduxDispatch(
        filtrarProductos({ categoriasBuscadas: categoriasBuscadasActual }),
      );
    }
  };

  const Producto = ({ producto }: { producto: ProductoI }) => {
    return (
      <>
        <Pressable
          onPress={() => {
            setEsVerProducto(producto);
          }}
          style={estilos.ventanaProductos__producto}
          key={producto._id}
        >
          <Image
            src={obtenerSourceImagen(producto.imagenes[0])}
            style={estilos.ventanaProductos__imagenProducto}
          ></Image>
          <View>
            <Text style={estilos.ventanaProductos__nombre}>
              {producto.nombre}
            </Text>
            <Text style={estilos.ventanaProductos__precio}>
              {"$ " + producto.precio.toLocaleString("es-AR")}
            </Text>
          </View>
          <View style={estilos.ventanaProductos__productoEstado}>
            {producto.disponible ? (
              <Entypo name="eye" size={24} color={colores.letra} />
            ) : (
              <Entypo
                name="eye-with-line"
                size={24}
                color={colores.letraSecundario}
              />
            )}
          </View>
        </Pressable>
      </>
    );
  };

  const Acordeon = ({
    productosOrdenados,
  }: {
    productosOrdenados: ProductoI[][];
  }) => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const secciones = productosOrdenados.map((productos: ProductoI[]) => {
      return {
        title: (productos[0].categoria as CategoriaI).nombre,
        data: productos,
      };
    });

    return (
      <>
        <SectionList
          sections={secciones}
          renderItem={({ item }) =>
            categoriaSeleccionada === (item.categoria as CategoriaI).nombre ? (
              <Producto
                key={item._id.toString() + new Date().getTime.toString()}
                producto={item}
              />
            ) : (
              <></>
            )
          }
          renderSectionHeader={({ section }) => (
            <Pressable onPress={() => setCategoriaSeleccionada(section.title)}>
              <Text style={{ fontSize: 20, color: colores.letra }}>
                {section.title}
              </Text>
            </Pressable>
          )}
        />
      </>
    );
  };

  const modificarPalabraBuscada = (palabra: string) => {
    if (!palabra) palabra = "&&&777&&&"; // Si se elimino la palabra buscada entonces manda este codigo para indicar que se quita la palabra buscada de parametro de busqueda
    reduxDispatch(filtrarProductos({ palabraBuscada: palabra }));
  };

  return (
    <>
      <View style={estilos.ventanaProductos}>
        <View style={estilosGeneral.encabezado}>
          <Pressable
            style={[
              estilos.ventanaProductos__botonVolver,
              estilosGeneral.botonGeneral1,
            ]}
            onPress={() => volverVentanaInicial()}
          >
            <AntDesign name="back" size={24} color="black" />
          </Pressable>
          <TextInput
            onChangeText={modificarPalabraBuscada}
            placeholder="Buscar"
          />
          <Pressable
            style={[
              estilos.ventanaProductos__botonVolver,
              estilosGeneral.botonGeneral1,
            ]}
            onPress={() => {
              setEsVerConfiguracion(true);
            }}
          >
            <FontAwesome name="gear" size={24} color="black" />
          </Pressable>
        </View>
        <View style={estilos.ventanaProductos__tablaProductos}>
          {esAgruparCategoria ? (
            <>
              {/* <View id="ventanaProductos__filtroCategoria">
                {categorias.map((categoria) => (
                  <FiltrosCategorias
                    key={categoria._id.toString() + "filtroCategoria"}
                    categoria={categoria}
                    alternarCategoriaBuscada={alternarCategoriaBuscada}
                    categoriasBuscadas={categoriasBuscadas}
                  />
                ))}
              </View>
              {productos.map((producto) => (
                <Producto
                  key={producto._id.toString() + new Date().getTime.toString()}
                  producto={producto}
                />
              ))} */}
            </>
          ) : (
            <Acordeon productosOrdenados={productosOrdenados} />
          )}

          {isLoading && <ActivityIndicator />}
          {isError && <MaterialIcons name="error" size={24} color="black" />}
        </View>
        <Pressable
          onPress={() => {
            setEsVerProducto(productoNuevo);
          }}
          style={[
            estilos.ventanaProductos__agregarProducto,
            estilosGeneral.botonGeneral1,
          ]}
        >
          <AntDesign name="plus" size={24} color="black" />
        </Pressable>
      </View>

      {/* {esVerConfiguracion && (
        // <VentanaConfiguracionProductos
        //   setEsVerConfiguracion={setEsVerConfiguracion}
        // />
      )} */}
      {/* {esVerProducto && (
        // <VentanaVerProducto
        //   setEsVerProducto={setEsVerProducto}
        //   esVerProducto={esVerProducto}
        //   volverVentanaProductos={volverVentanaProductos}
        //   esDesaparecer={esTransicion}
        // />
      )} */}
    </>
  );
}

const estilos = StyleSheet.create({
  ventanaProductos: {
    flex: 1,
    backgroundColor: colores.fondo,
    zIndex: 200,
  },
  ventanaProductos__inputBusqueda: {
    width: "60%",
    height: 20,
  },
  ventanaProductos__botonVolver: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
  ventanaProductos__tablaProductos: {
    flex: 1,
    flexDirection: "column",
  },
  ventanaProductos__iconoCargando: {
    fontSize: 5,
    alignSelf: "center",
  },
  ventanaProductos__iconoFallo: {
    fontSize: 5,
    alignSelf: "center",
  },
  ventanaProductos__productosAgrupados: {
    flexDirection: "column",
  },
  ventanaProductos__producto: {
    display: "flex",
    flexDirection: "row",
    fontSize: 20,
    padding: 10,
    margin: 5,
    backgroundColor: colores.fondoElemento, // Necesita conversión a RN
    borderRadius: 6,
  },
  ventanaProductos__nombre: {
    height: 30,
    color: colores.letra,
    fontSize: 20,
    marginBottom: 2,
  },
  ventanaProductos__precio: {
    color: colores.letraSecundario,
    fontSize: 20,
  },
  ventanaProductos__imagenProducto: {
    height: 60,
    width: 60,
    objectFit: "contain",
    backgroundColor: "white",
    borderRadius: 100,
    marginRight: 10,
  },
  ventanaProductos__productoNoDisponible: {
    color: colores.letraSecundario, // Necesita conversión
  },
  ventanaProductos__productoEstado: {
    flexDirection: "column",
    marginLeft: "auto",
  },

  ventanaProductos__productos__producto: {
    width: "auto",
    height: "auto",
    margin: 5,
    fontSize: 5,
    padding: 1,
    borderRadius: 3,
    backgroundColor: colores.boton,
    alignItems: "center",
  },
  ventanaProductos__categoria: {
    justifyContent: "space-between",
    padding: 10,
    fontSize: 25,
  },
  ventanaProductos__categoria__iconoActivo: {
    transform: [{ rotate: "90deg" }],
  },

  ventanaProductos__agregarProducto: {
    position: "absolute", // fixed no existe en RN
    zIndex: 220,
    display: "flex",
    fontSize: 41,
    width: 80,
    height: 80,
    paddingRight: 17,
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
  },

  ventanaProductos__ventanaConfiguracion: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "var(--fondoOscurecido)", // Necesita conversión
    top: 0,
    left: 0,
    flex: 1,
    zIndex: 220,
  },

  ventanaProductos__ventanaConfiguracionDiv: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
    padding: 5,
    backgroundColor: colores.fondo,
    zIndex: 230,
  },

  ventanaProductos__ventanaConfiguracionButton: {
    marginTop: 20,
    alignSelf: "center",
  },

  ventanaProductos__filtroCategoria: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    minHeight: "auto",
  },

  ventanaProductos__filtroCategoriaCategoria: {
    backgroundColor: colores.fondoElemento,
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },

  ventanaProductos__filtroCategoriaCategoriaActive: {
    borderWidth: 2,
    borderColor: "white",
  },
});
