import { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";

// Importamos los iconos necesarios
import { 
  FaHamburger, 
  FaEdit, 
  FaPlus, 
  FaBox, 
  FaExclamationTriangle, 
  FaCheck, 
  FaSave, 
  FaTrashAlt,
  FaTimes,
  FaSearch
} from "react-icons/fa";

import {
  crearProducto,
  obtenerProductos,
  eliminarProducto,
  actualizarProducto
} from "../firebase/productos";

function Productos() {

  // ===========================
  // ESTADOS
  // ===========================

  const [productos, setProductos] = useState([]);
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarGuardar, setMostrarGuardar] = useState(false);
  const [mostrarActualizar, setMostrarActualizar] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [busqueda, setBusqueda] = useState(""); // <--- NUEVO estado para búsqueda

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: ""
  });

  // ===========================
  // CARGAR PRODUCTOS
  // ===========================

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // ===========================
  // CATEGORÍAS ÚNICAS EXISTENTES (para el datalist)
  // ===========================

  const categoriasExistentes = useMemo(() => {
    const set = new Set();
    productos.forEach((p) => {
      if (p.categoria && p.categoria.trim()) {
        set.add(p.categoria.trim());
      }
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [productos]);

  // ===========================
  // FILTRADO DE PRODUCTOS (memoizado)
  // ===========================

  const productosFiltrados = useMemo(() => {
    if (!busqueda.trim()) return productos;

    const texto = busqueda.toLowerCase().trim();
    return productos.filter(producto =>
      producto.nombre?.toLowerCase().includes(texto) ||
      producto.categoria?.toLowerCase().includes(texto) ||
      producto.descripcion?.toLowerCase().includes(texto)
    );
  }, [productos, busqueda]);

  // ===========================
  // GUARDAR O ACTUALIZAR
  // ===========================

  const guardarProducto = async () => {
    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, {
          nombre: formulario.nombre,
          descripcion: formulario.descripcion,
          precio: Number(formulario.precio),
          categoria: formulario.categoria,
          imagen: formulario.imagen
        });
      } else {
        await crearProducto({
          nombre: formulario.nombre,
          descripcion: formulario.descripcion,
          precio: Number(formulario.precio),
          categoria: formulario.categoria,
          imagen: formulario.imagen,
          activo: true,
          fechaCreacion: new Date()
        });
      }

      setFormulario({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: ""
      });
      setProductoEditar(null);
      cargarProductos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  // ===========================
  // EDITAR
  // ===========================

  const editarProducto = (producto) => {
    setProductoEditar(producto);
    setFormulario({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      categoria: producto.categoria || "",
      imagen: producto.imagen || ""
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // ===========================
  // ELIMINAR
  // ===========================

  const borrarProducto = async (id) => {
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-8">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white mb-8 flex items-center gap-3">
          <FaHamburger className="text-5xl" />
          <div>
            <h1 className="text-4xl font-bold">Gestión de Productos</h1>
            <p className="mt-2 opacity-90">Administra tu menú desde Firebase</p>
          </div>
        </div>

        {/* FORMULARIO */}
        <div className="bg-white rounded-3xl p-6 shadow mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {productoEditar ? (
              <>
                <FaEdit className="text-blue-500" />
                Editar Producto
              </>
            ) : (
              <>
                <FaPlus className="text-green-500" />
                Nuevo Producto
              </>
            )}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={formulario.nombre}
              onChange={(e) =>
                setFormulario({ ...formulario, nombre: e.target.value })
              }
              className="border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
            />
            <input
              type="number"
              placeholder="Precio"
              value={formulario.precio}
              onChange={(e) =>
                setFormulario({ ...formulario, precio: e.target.value })
              }
              className="border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
            />

            {/* Campo de categoría con sugerencias (datalist) */}
            <div>
              <input
                type="text"
                list="lista-categorias"
                placeholder="Categoría"
                value={formulario.categoria}
                onChange={(e) =>
                  setFormulario({ ...formulario, categoria: e.target.value })
                }
                className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 outline-none"
              />
              <datalist id="lista-categorias">
                {categoriasExistentes.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            <input
              type="text"
              placeholder="URL Imagen"
              value={formulario.imagen}
              onChange={(e) =>
                setFormulario({ ...formulario, imagen: e.target.value })
              }
              className="border p-3 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Chips de categorías existentes como atajo rápido */}
          {categoriasExistentes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs text-slate-400 mt-1.5">Categorías existentes:</span>
              {categoriasExistentes.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormulario({ ...formulario, categoria: cat })}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    formulario.categoria === cat
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-orange-50 hover:border-orange-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <textarea
            rows="4"
            placeholder="Descripción"
            value={formulario.descripcion}
            onChange={(e) =>
              setFormulario({ ...formulario, descripcion: e.target.value })
            }
            className="w-full border p-3 rounded-xl mt-4 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <button
            onClick={() => {
              if (productoEditar) {
                setMostrarActualizar(true);
              } else {
                setMostrarGuardar(true);
              }
            }}
            className="mt-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            {productoEditar ? (
              <>
                <FaSave /> Actualizar Producto
              </>
            ) : (
              <>
                <FaCheck /> Guardar Producto
              </>
            )}
          </button>
        </div>

        {/* TABLA CON BUSCADOR */}
        <div className="bg-white rounded-3xl p-6 shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaBox className="text-indigo-500" />
              Lista de Productos
              <span className="text-sm font-normal text-slate-500 ml-2">
                ({productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'})
              </span>
            </h2>

            {/* Campo de búsqueda */}
            <div className="relative w-full md:w-72">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {busqueda ? (
                  <>
                    <p className="text-lg">No se encontraron productos que coincidan con <strong>"{busqueda}"</strong></p>
                    <button
                      onClick={() => setBusqueda("")}
                      className="mt-2 text-orange-500 hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <p className="text-lg">No hay productos registrados aún.</p>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Imagen</th>
                    <th className="text-left py-3">Producto</th>
                    <th className="text-left py-3">Categoría</th>
                    <th className="text-left py-3">Precio</th>
                    <th className="text-center py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr key={producto.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <img
                          src={producto.imagen || "https://picsum.photos/60"}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                      </td>
                      <td className="font-medium">{producto.nombre}</td>
                      <td>
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                          {producto.categoria}
                        </span>
                      </td>
                      <td className="font-semibold text-green-600">
                        ${producto.precio}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => editarProducto(producto)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 inline-flex items-center gap-1 transition-colors"
                        >
                          <FaEdit size={14} /> Editar
                        </button>
                        <button
                          onClick={() => {
                            setIdEliminar(producto.id);
                            setMostrarEliminar(true);
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-1 transition-colors"
                        >
                          <FaTrashAlt size={14} /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MODALES (sin cambios) */}
      {mostrarEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[400px]">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              Confirmar eliminación
            </h2>
            <p>¿Deseas eliminar este producto? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setMostrarEliminar(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                <FaTimes /> Cancelar
              </button>
              <button
                onClick={async () => {
                  await borrarProducto(idEliminar);
                  setMostrarEliminar(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
              >
                <FaTrashAlt /> Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarGuardar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[400px]">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <FaCheck className="text-green-500" />
              Guardar Producto
            </h2>
            <p>¿Deseas guardar este producto?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setMostrarGuardar(false)}
                className="bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <FaTimes /> Cancelar
              </button>
              <button
                onClick={async () => {
                  await guardarProducto();
                  setMostrarGuardar(false);
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <FaCheck /> Sí, guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarActualizar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[400px]">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <FaEdit className="text-blue-500" />
              Actualizar Producto
            </h2>
            <p>¿Deseas guardar los cambios realizados?</p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setMostrarActualizar(false)}
                className="bg-slate-300 hover:bg-slate-400 px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <FaTimes /> Cancelar
              </button>
              <button
                onClick={async () => {
                  await guardarProducto();
                  setMostrarActualizar(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
              >
                <FaSave /> Sí, actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Productos;