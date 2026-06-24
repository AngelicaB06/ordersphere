// pages/Categorias.jsx
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from "../firebase/categorias";
import {
  FaFolderOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaFolder,
  FaFolderMinus
} from "react-icons/fa";
import Swal from "sweetalert2";

function Categorias() {
  // ==========================
  // ESTADOS
  // ==========================
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);



  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null); // null = crear, objeto = editar
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [cantidadCategoria, setCantidadCategoria] = useState("");
  const [activaCategoria, setActivaCategoria] = useState(true);

  // ==========================
  // CARGAR DATOS
  // ==========================
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await obtenerCategorias();
      setCategorias(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las categorías",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FILTRAR CATEGORÍAS
  // ==========================
  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre?.toLowerCase().includes(busqueda.toLowerCase().trim())
  );

  // ==========================
  // ABRIR MODAL PARA CREAR
  // ==========================
  const abrirModalCrear = () => {
    setCategoriaEditando(null);
    setNombreCategoria("");
    setCantidadCategoria("");
    setActivaCategoria(true);
    setMostrarModal(true);
  };

  // ==========================
  // ABRIR MODAL PARA EDITAR
  // ==========================
  const abrirModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setNombreCategoria(categoria.nombre || "");
    setCantidadCategoria(categoria.cantidad?.toString() || "");
    setActivaCategoria(categoria.Activa !== undefined ? categoria.Activa : true);
    setMostrarModal(true);
  };

  // ==========================
  // GUARDAR (CREAR O ACTUALIZAR)
  // ==========================
  const guardarCategoria = async () => {
    const nombre = nombreCategoria.trim();
    if (!nombre) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Debes ingresar un nombre para la categoría",
        confirmButtonColor: "#f97316"
      });
      return;
    }

    try {
      if (categoriaEditando) {
        // Actualizar
        await actualizarCategoria(categoriaEditando.id, {
          nombre,
          cantidad: Number(cantidadCategoria) || 0,
          Activa: activaCategoria
        });
        Swal.fire({
          icon: "success",
          title: "Actualizada",
          text: "Categoría actualizada correctamente",
          confirmButtonColor: "#f97316"
        });
      } else {
        // Crear
        await crearCategoria({
          nombre,
          cantidad: Number(cantidadCategoria) || 0,
          Activa: activaCategoria
        });
        Swal.fire({
          icon: "success",
          title: "Creada",
          text: "Categoría creada correctamente",
          confirmButtonColor: "#f97316"
        });
      }

      setMostrarModal(false);
      cargarCategorias();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la categoría",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  // ==========================
  // ELIMINAR CON CONFIRMACIÓN
  // ==========================
  const borrarCategoria = async (id, nombre) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${nombre}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await eliminarCategoria(id);
        Swal.fire({
          icon: "success",
          title: "Eliminada",
          text: "Categoría eliminada correctamente",
          confirmButtonColor: "#f97316"
        });
        cargarCategorias();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la categoría",
          confirmButtonColor: "#ef4444"
        });
      }
    }
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 md:p-8">
        {/* HERO */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <FaFolderOpen className="text-5xl" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">Gestión de Categorías</h2>
              <p className="mt-2 text-orange-100 text-lg">
                Organiza tus productos por categorías.
              </p>
              <button
                onClick={abrirModalCrear}
                className="mt-4 bg-white text-orange-600 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2 shadow-md"
              >
                <FaPlus /> Nueva Categoría
              </button>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Categorías</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">{categorias.length}</p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
                <FaFolder className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Categorías Activas</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {categorias.filter(c => c.Activa !== false).length}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                <FaToggleOn className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Categorías Inactivas</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {categorias.filter(c => c.Activa === false).length}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                <FaToggleOff className="text-yellow-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <FaFolderOpen className="text-orange-500" />
                Lista de Categorías
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                  ({categoriasFiltradas.length} {categoriasFiltradas.length === 1 ? 'categoría' : 'categorías'})
                </span>
              </h3>
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <FaTimes size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
 
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Cantidad</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Estado</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600 dark:text-slate-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-500">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                      </div>
                      <p className="mt-2">Cargando categorías...</p>
                    </td>
                  </tr>
                ) : categoriasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-500">
                      {busqueda ? (
                        <>
                          <p>No se encontraron categorías para "<strong>{busqueda}</strong>"</p>
                          <button
                            onClick={() => setBusqueda("")}
                            className="mt-2 text-orange-500 hover:underline"
                          >
                            Limpiar búsqueda
                          </button>
                        </>
                      ) : (
                        <p>No hay categorías registradas aún.</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  categoriasFiltradas.map((categoria) => (
                    <tr key={categoria.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                      <td className="py-4 px-6 font-medium dark:text-white">{categoria.nombre}</td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{categoria.cantidad || 0}</td>
                      <td className="py-4 px-6">
                        {categoria.Activa !== false ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Inactiva
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => abrirModalEditar(categoria)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Editar"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => borrarCategoria(categoria.id, categoria.nombre)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                            title="Eliminar"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ==========================
          MODAL PARA CREAR/EDITAR
      ========================== */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl transform transition-all animate-fadeIn">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {categoriaEditando ? (
                  <>
                    <FaEdit className="text-blue-500" />
                    Editar Categoría
                  </>
                ) : (
                  <>
                    <FaPlus className="text-green-500" />
                    Nueva Categoría
                  </>
                )}
              </h3>
              <button
                onClick={() => setMostrarModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <FaTimes className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={nombreCategoria}
                  onChange={(e) => setNombreCategoria(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="Ej. Hamburguesas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cantidad (opcional)
                </label>
                <input
                  type="number"
                  value={cantidadCategoria}
                  onChange={(e) => setCantidadCategoria(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="0"
                  min="0"
                />
              </div>

              {/* Toggle de estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Estado
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActivaCategoria(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      activaCategoria === true
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <FaToggleOn size={20} />
                    Activa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivaCategoria(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      activaCategoria === false
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <FaToggleOff size={20} />
                    Inactiva
                  </button>
                </div>
              </div>
            </div>


            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 rounded-b-3xl flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCategoria}
                className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <FaSave /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animación modal */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </Layout>
  );
}
 
export default Categorias;