// pages/Promociones.jsx
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  obtenerPromociones,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion
} from "../firebase/promociones";
import {
  FaGift,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSave,
  FaToggleOn,
  FaToggleOff,
  FaPercentage,
  FaImage
} from "react-icons/fa";
import Swal from "sweetalert2";

function Promociones() {
  // ==========================
  // ESTADOS
  // ==========================
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // Modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [descuento, setDescuento] = useState("");
  const [imagen, setImagen] = useState("");
  const [activa, setActiva] = useState(true);
  const [editando, setEditando] = useState(null); // id de la promoción a editar

  // ==========================
  // CARGAR PROMOCIONES
  // ==========================
  useEffect(() => {
    cargarPromociones();
  }, []);

  const cargarPromociones = async () => {
    try {
      setLoading(true);
      const data = await obtenerPromociones();
      setPromociones(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las promociones",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FILTRAR
  // ==========================
  const promocionesFiltradas = promociones.filter((promo) =>
    promo.titulo?.toLowerCase().includes(busqueda.toLowerCase().trim()) ||
    promo.descripcion?.toLowerCase().includes(busqueda.toLowerCase().trim())
  );

  // ==========================
  // ABRIR MODAL CREAR
  // ==========================
  const abrirModalCrear = () => {
    setEditando(null);
    setTitulo("");
    setDescripcion("");
    setDescuento("");
    setImagen("");
    setActiva(true);
    setMostrarModal(true);
  };

  // ==========================
  // ABRIR MODAL EDITAR
  // ==========================
  const abrirModalEditar = (promo) => {
    setEditando(promo.id);
    setTitulo(promo.titulo || "");
    setDescripcion(promo.descripcion || "");
    setDescuento(promo.descuento?.toString() || "");
    setImagen(promo.imagen || "");
    setActiva(promo.activa !== undefined ? promo.activa : true);
    setMostrarModal(true);
  };

  // ==========================
  // GUARDAR (CREAR O ACTUALIZAR)
  // ==========================
  const guardarPromocion = async () => {
    if (!titulo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Título requerido",
        text: "Debes ingresar un título para la promoción",
        confirmButtonColor: "#f97316"
      });
      return;
    }

    try {
      const data = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        descuento: Number(descuento) || 0,
        imagen: imagen.trim(),
        activa: activa
      };

      if (editando) {
        await actualizarPromocion(editando, data);
        Swal.fire({
          icon: "success",
          title: "Actualizada",
          text: "Promoción actualizada correctamente",
          confirmButtonColor: "#f97316"
        });
      } else {
        await crearPromocion(data);
        Swal.fire({
          icon: "success",
          title: "Creada",
          text: "Promoción creada correctamente",
          confirmButtonColor: "#f97316"
        });
      }

      setMostrarModal(false);
      cargarPromociones();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la promoción",
        confirmButtonColor: "#ef4444"
      });
    }
  };

  // ==========================
  // ELIMINAR CON CONFIRMACIÓN
  // ==========================
  const borrarPromocion = async (id, titulo) => {
    const result = await Swal.fire({
      title: `¿Eliminar "${titulo}"?`,
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
        await eliminarPromocion(id);
        Swal.fire({
          icon: "success",
          title: "Eliminada",
          text: "Promoción eliminada correctamente",
          confirmButtonColor: "#f97316"
        });
        cargarPromociones();
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar la promoción",
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
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6 md:p-8">
        {/* HERO */}
        <div className="relative overflow-hidden bg-linear-to-r from-pink-500 to-rose-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
              <FaGift className="text-5xl" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight">Gestión de Promociones</h2>
              <p className="mt-2 text-pink-100 text-lg">
                Administra las promociones y ofertas especiales.
              </p>
              <button
                onClick={abrirModalCrear}
                className="mt-4 bg-white text-pink-600 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2 shadow-md"
              >
                <FaPlus /> Nueva Promoción
              </button>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Promociones</p>
                <p className="text-3xl font-bold text-pink-500 mt-1">{promociones.length}</p>
              </div>
              <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-xl">
                <FaGift className="text-pink-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Promociones Activas</p>
                <p className="text-3xl font-bold text-green-500 mt-1">
                  {promociones.filter(p => p.activa !== false).length}
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
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Promociones Inactivas</p>
                <p className="text-3xl font-bold text-yellow-500 mt-1">
                  {promociones.filter(p => p.activa === false).length}
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                <FaToggleOff className="text-yellow-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE PROMOCIONES */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <FaGift className="text-pink-500" />
                Promociones
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                  ({promocionesFiltradas.length} {promocionesFiltradas.length === 1 ? 'promoción' : 'promociones'})
                </span>
              </h3>
              <div className="relative w-full sm:w-64">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar promoción..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-pink-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
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

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-slate-500">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-pink-500 border-t-transparent"></div>
                </div>
                <p className="mt-2">Cargando promociones...</p>
              </div>
            ) : promocionesFiltradas.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                {busqueda ? (
                  <>
                    <p>No se encontraron promociones para "<strong>{busqueda}</strong>"</p>
                    <button
                      onClick={() => setBusqueda("")}
                      className="mt-2 text-pink-500 hover:underline"
                    >
                      Limpiar búsqueda
                    </button>
                  </>
                ) : (
                  <p>No hay promociones registradas aún.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promocionesFiltradas.map((promo) => (
                  <div
                    key={promo.id}
                    className="border rounded-2xl overflow-hidden hover:shadow-md transition-shadow dark:border-slate-700"
                  >
                    {promo.imagen && (
                      <img
                        src={promo.imagen}
                        alt={promo.titulo}
                        className="w-full h-36 object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    )}
                    <div className="p-5">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg dark:text-white">{promo.titulo}</h4>
                            {promo.activa !== false ? (
                              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full">Activa</span>
                            ) : (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs px-2 py-1 rounded-full">Inactiva</span>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{promo.descripcion}</p>
                          <div className="flex items-center gap-1 mt-2 text-pink-500 font-bold">
                            <FaPercentage />
                            <span>{promo.descuento}% OFF</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => abrirModalEditar(promo)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all"
                          >
                            <FaEdit size={14} /> Editar
                          </button>
                          <button
                            onClick={() => borrarPromocion(promo.id, promo.titulo)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all"
                          >
                            <FaTrash size={14} /> Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA CREAR/EDITAR */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl transform transition-all animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {editando ? (
                  <>
                    <FaEdit className="text-blue-500" />
                    Editar Promoción
                  </>
                ) : (
                  <>
                    <FaPlus className="text-green-500" />
                    Nueva Promoción
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
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Ej. 2x1 en Hamburguesas"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción de la promoción"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows="3"
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Descuento (%)
                </label>
                <input
                  type="number"
                  placeholder="Ej. 20"
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <FaImage className="text-pink-500" />
                  URL de la imagen (opcional)
                </label>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imagen}
                  onChange={(e) => setImagen(e.target.value)}
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                {imagen && (
                  <img
                    src={imagen}
                    alt="Vista previa"
                    className="w-full h-32 object-cover rounded-xl mt-2 border dark:border-slate-600"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Estado
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActiva(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      activa === true
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <FaToggleOn size={20} />
                    Activa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiva(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                      activa === false
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
                onClick={guardarPromocion}
                className="px-6 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <FaSave /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Promociones;