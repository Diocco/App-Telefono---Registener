import { useQuery } from "react-query";
import { CategoriaI } from "../../interfaces/categorias";
import { ProductoI } from "../../interfaces/producto";
import { solicitudObtenerProductos } from "../../services/productosAPI";
import { SetStateAction, useEffect, useState } from "react";
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

// Variables globales
import { definirProductos, filtrarProductos } from "../../redux/productosSlice";
import { definirCategorias } from "../../redux/categoriasSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
// import { VentanaVerProducto } from "./ventanaVerProducto";
import { ordenarProductos } from "../../helpers/ordenarProductos";
import { obtenerSourceImagen } from "../../helpers/obtenerSourceImagen";

// Iconos
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Variables globales
import { colores } from "../../constants/colores";
import { estilosGeneral } from "../../constants/estilosGenerales";
import { Stack, useRouter } from "expo-router";
import { modificarPreferencias } from "../../redux/tokenSlice";
import { SwitchGeneral1 } from "../../components/tsx/switches";
import { ErrorCarga } from "@/components/tsx/errorCarga";
import { OpcionesFlotantes } from "@/components/tsx/opcionesFlotantes";

interface RespuestaProductos {
  productos: ProductoI[];
  categoriasCompletas: CategoriaI[];
  paginasCantidad: number;
}

const VentanaConfiguracionProductos = ({
  setEsVerConfiguracion,
}: {
  setEsVerConfiguracion: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const usuario = useSelector((state: RootState) => state.tokenAcceso.usuario); // Obtiene los productos de la variable global
  const dispatch = useDispatch<AppDispatch>();

  const alternarEsAgruparCategoria = (estado: boolean) => {
    if (!estado) dispatch(filtrarProductos({ categoriasBuscadas: [] }));
    dispatch(modificarPreferencias({ esAgruparCategoria: estado }));
  }; // Cada vez que el switch cambia se ejecuta el cambio en el estado global

  return (
    <View id="ventanaProductos__ventanaConfiguracion">
      <View id="ventanaProductos__ventanaConfiguracion-View">
        <SwitchGeneral1
          titulo="Agrupar por categorias"
          onValueChange={alternarEsAgruparCategoria}
          valorInicial={usuario!.preferencias.esAgruparCategoria}
        />
        <SwitchGeneral1
          titulo="Agrupar por producto"
          onValueChange={() => {}}
          valorInicial={false}
        />
        <Pressable
          style={estilosGeneral.botonGeneral1}
          onPress={() => setEsVerConfiguracion(false)}
        >
          <Text style={estilosGeneral.letraBoton1}>Aceptar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function VentanaProductos() {
  const tokenAcceso = useSelector(
    (state: RootState) => state.tokenAcceso.tokenAcceso,
  ); // Obtiene el token de acceso de la variable global
  const productosTotales = useSelector(
    (state: RootState) => state.productos.productos,
  ); // Obtiene los productos de la variable global
  const productos = useSelector(
    (state: RootState) => state.productos.productosFiltrados,
  ); // Obtiene los productos de la variable global

  const esAgruparCategoria = useSelector(
    (state: RootState) =>
      state.tokenAcceso.usuario?.preferencias.esAgruparCategoria,
  ); // Obtiene los productos de la variable global
  const categorias = useSelector((state: RootState) =>
    state.categorias.categorias.map((categoria) => categoria.nombre),
  ); // Obtiene en un array los nombres de las categorias validas
  const router = useRouter();

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
  const [categoriasBuscadas, setCategoriaBuscadas] =
    useState<string[]>(categorias);

  useEffect(() => {
    reduxDispatch(filtrarProductos({ categoriasBuscadas: categoriasBuscadas }));
  }, [categoriasBuscadas]); // Cada vez que se modifica una categoria buscada lo actualiza en la variable global

  const Producto = ({ producto }: { producto: ProductoI }) => {
    return (
      <>
        <Pressable
          style={estilos.ventanaProductos__producto}
          key={producto._id}
          onPress={() =>
            router.push(`/ventanaProductos/${producto._id.toString()}`)
          }
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
            <Pressable
              onPress={() => {
                if (categoriaSeleccionada === section.title)
                  setCategoriaSeleccionada("");
                else setCategoriaSeleccionada(section.title);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  color: colores.letra,
                  paddingVertical: 15,
                  paddingLeft: 9,
                  marginVertical: 2,
                }}
              >
                {section.title}
              </Text>
              {categoriaSeleccionada === section.title ? (
                <Entypo name="chevron-left" size={30} color="white" />
              ) : (
                <Entypo name="chevron-down" size={30} color="white" />
              )}
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
      <Stack.Screen
        options={{
          headerLeft: () => {
            return (
              <Pressable
                style={estilosGeneral.encabezado__boton}
                onPress={() => router.push(`/ventanaProductos/-1`)}
              >
                <AntDesign name="plus" size={24} color="white" />
              </Pressable>
            );
          },
          headerTitleAlign: "center",
          headerTitle: () => {
            return (
              <TextInput
                style={[
                  estilosGeneral.inputGeneral,
                  {
                    width: 250,
                    color: "white",
                    marginTop: 0,
                  },
                ]}
                onChangeText={modificarPalabraBuscada}
                placeholder="Buscar"
                placeholderTextColor={colores.letraSecundario}
              ></TextInput>
            );
          },
          headerRight: () => {
            return (
              <Pressable
                style={estilosGeneral.encabezado__boton}
                onPress={() => {
                  setEsVerConfiguracion(true);
                }}
              >
                <FontAwesome name="gear" size={24} color="white" />
              </Pressable>
            );
          },
        }}
      />
      <View style={estilos.ventanaProductos}>
        {isLoading && (
          <ActivityIndicator
            size={"large"}
            color={"white"}
            style={{ flex: 1 }}
          />
        )}
        {isError && (
          <ErrorCarga mensaje="Error al cargar los productos, porfavor reinicie" />
        )}
        <View style={estilos.ventanaProductos__tablaProductos}>
          {esAgruparCategoria ? (
            <>
              <OpcionesFlotantes
                opciones={categorias}
                opcionesElegidas={categoriasBuscadas}
                setOpcionesElegidas={setCategoriaBuscadas}
              />
              <FlatList
                data={productos}
                keyExtractor={(producto) =>
                  producto._id.toString() + new Date().getTime.toString()
                }
                renderItem={(producto) => <Producto producto={producto.item} />}
              />
            </>
          ) : (
            <Acordeon productosOrdenados={productosOrdenados} />
          )}
        </View>
      </View>

      <Modal
        visible={esVerConfiguracion}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEsVerConfiguracion(false)}
      >
        <Pressable
          style={estilosGeneral.fondoModal}
          onPress={() => setEsVerConfiguracion(false)}
        >
          <View style={estilos.ventanaProductos__ventanaConfiguracionDiv}>
            <VentanaConfiguracionProductos
              setEsVerConfiguracion={setEsVerConfiguracion}
            />
          </View>
        </Pressable>
      </Modal>
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colores.fondoOscurecido, // Necesita conversión
    flex: 1,
    zIndex: 220,
  },

  ventanaProductos__ventanaConfiguracionDiv: {
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
    width: "auto",
    height: "auto",
    borderRadius: 10,
    padding: 20,
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
    maxHeight: 60,
  },

  ventanaProductos__filtroCategoriaCategoria: {
    backgroundColor: colores.fondoElemento,
    padding: 10,
    margin: 5,
    borderRadius: 15,
    width: "auto",
    height: 50,
  },

  ventanaProductos__filtroCategoriaCategoriaActive: {
    borderWidth: 2,
    borderColor: "white",
  },
  ventanaProductos__filtroCategoriaText: {
    color: colores.letra,
    fontSize: 20,
  },
});
