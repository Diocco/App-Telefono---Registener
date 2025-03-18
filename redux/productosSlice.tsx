import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductoI } from "../interfaces/producto";
import { variante } from "../interfaces/variante";
import { CategoriaI } from "../interfaces/categorias";

interface ProductosState {
  // Crea la interface de lo que contiene la variable global
  productos: ProductoI[];
  productosFiltrados: ProductoI[];
  palabraBuscada: string;
  categoriasBuscadas: string[];
}

const initialState: ProductosState = {
  // Crea las condiciones iniciales
  productos: [],
  productosFiltrados: [],
  palabraBuscada: "",
  categoriasBuscadas: [],
};

const actualizarProductosFiltrados = ({
  productos,
  palabraBuscada,
  categoriasBuscadas,
}: {
  productos: ProductoI[];
  palabraBuscada: string;
  categoriasBuscadas: string[];
}) => {
  // Realiza la nueva busqueda
  let productosFiltrados: ProductoI[] = [];

  productos.forEach((producto) => {
    // Si se estan buscando ciertas categorias especificas verifica que el producto cumple con esa condicion antes de buscar cohincidencias especificas
    if (categoriasBuscadas.length > 0) {
      const esCategoriaBuscada = categoriasBuscadas.includes(
        (producto.categoria as CategoriaI).nombre,
      ); // Verifica si la categoria del producto se encuentra dentro de las categorias buscadas
      if (!esCategoriaBuscada) return; // Si la categoria no es una de las buscadas entonces no se tiene en cuenta el producto
    }

    // Busca alguna coincidencia entre la palabra buscada y el producto
    if (
      producto.nombre
        .toLocaleLowerCase()
        .includes(palabraBuscada.toLocaleLowerCase())
    ) {
      // Nombre
      productosFiltrados.push(producto);
      return;
    }
    if (
      (producto.categoria as CategoriaI).nombre
        .toLocaleLowerCase()
        .includes(palabraBuscada.toLocaleLowerCase())
    ) {
      // Nombre categoria
      productosFiltrados.push(producto);
      return;
    }
    if (
      producto.marca
        .toLocaleLowerCase()
        .includes(palabraBuscada.toLocaleLowerCase())
    ) {
      // Marca
      productosFiltrados.push(producto);
      return;
    }
    if (
      producto.modelo
        .toLocaleLowerCase()
        .includes(palabraBuscada.toLocaleLowerCase())
    ) {
      // Modelo
      productosFiltrados.push(producto);
      return;
    }
    // TODO Falta que revise coincidencias en los tags y los SKU
  });

  return productosFiltrados;
};

const productosSlice = createSlice({
  // Crea el slice, donde se coloca lo anterior y ademas se le define funciones para modificar la variable en "reducers"
  name: "productos",
  initialState,
  reducers: {
    definirProductos: (state, action: PayloadAction<ProductoI[]>) => {
      state.productos = action.payload;
      state.productosFiltrados = action.payload;
    },
    actualizarVariante: (
      state,
      action: PayloadAction<{ variante: variante; productoId: string }>,
    ) => {
      const producto = state.productos.find(
        (producto) => producto._id === action.payload.productoId,
      ); // Obtiene el producto por referencia
      if (producto) {
        producto.variantes = (producto.variantes as variante[]).map(
          (v) =>
            v._id === action.payload.variante._id
              ? { ...action.payload.variante }
              : v, // Si se cumple la condicion entonces devuelve el la variante nueva, sino la variante vieja, remplazando todo el array de variantes solo que con una variante modificada
        );
      }
      state.productosFiltrados = actualizarProductosFiltrados({
        productos: state.productos,
        palabraBuscada: state.palabraBuscada,
        categoriasBuscadas: state.categoriasBuscadas,
      }); // Vuelve a filtrar los productos para agregar los cambios a los productos filtrados
    },
    actualizarProducto: (
      state,
      action: PayloadAction<{ productoActualizado: ProductoI }>,
    ) => {
      const index = state.productos.findIndex(
        (producto) => producto._id === action.payload.productoActualizado._id,
      ); // Busca el indice del producto modificado

      if (index > -1)
        state.productos[index] = action.payload.productoActualizado; // Si lo encuentra en la base de datos lo actualiza
      else state.productos.push(action.payload.productoActualizado); // Si no esta en la base de datos lo agrega
      state.productosFiltrados = actualizarProductosFiltrados({
        productos: state.productos,
        palabraBuscada: state.palabraBuscada,
        categoriasBuscadas: state.categoriasBuscadas,
      }); // Vuelve a filtrar los productos para agregar los cambios a los productos filtrados
    },
    eliminarProductoRedux: (
      state,
      action: PayloadAction<{ productoID: string }>,
    ) => {
      const index = state.productos.findIndex(
        (producto) => producto._id === action.payload.productoID,
      ); // Busca el indice del producto que se busca eliminar
      if (index === -1) return;
      state.productos.splice(index, 1); // Elimina el producto de la variable global
      state.productosFiltrados = actualizarProductosFiltrados({
        productos: state.productos,
        palabraBuscada: state.palabraBuscada,
        categoriasBuscadas: state.categoriasBuscadas,
      }); // Vuelve a filtrar los productos para agregar los cambios a los productos filtrados
    },
    filtrarProductos: (
      state,
      action: PayloadAction<{
        palabraBuscada?: string;
        categoriasBuscadas?: string[];
      }>,
    ) => {
      // Remplaza las variables de busqueda
      if (action.payload.categoriasBuscadas)
        state.categoriasBuscadas = action.payload.categoriasBuscadas;
      if (action.payload.palabraBuscada) {
        if (action.payload.palabraBuscada === "&&&777&&&")
          state.palabraBuscada = ""; // Se elimina la palabra buscada como parametro de busqueda
        else state.palabraBuscada = action.payload.palabraBuscada;
      }

      state.productosFiltrados = actualizarProductosFiltrados({
        productos: state.productos,
        palabraBuscada: state.palabraBuscada,
        categoriasBuscadas: state.categoriasBuscadas,
      }); // Vuelve a filtrar los productos para agregar los cambios a los productos filtrados
    },

    reiniciarProductos: () => initialState,
  },
});

export const {
  definirProductos,
  actualizarVariante,
  actualizarProducto,
  eliminarProductoRedux,
  reiniciarProductos,
  filtrarProductos,
} = productosSlice.actions; // Se exporta las funciones
export default productosSlice.reducer; // Se exporta la configuracion
