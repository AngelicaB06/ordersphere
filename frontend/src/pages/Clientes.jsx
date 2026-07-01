import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import {
  FaUsers,
  FaSearch,
  FaTimes,
  FaTrashAlt,
  FaToggleOn,
  FaToggleOff,
  FaExclamationTriangle,
  FaEnvelope,
  FaUserShield,
  FaUserAlt,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";

function Clientes() {

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState(null);
  const [filtroRol, setFiltroRol] = useState("todos");

  // ===========================
  // CARGAR CLIENTES
  // ===========================
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      // ✅ Colección con U mayúscula, sin orderBy para evitar error de índice
      const snapshot = await getDocs(collection(db, "Usuarios"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      // Ordenar en el cliente por correo
      data.sort((a, b) =>
        (a.correo || "").localeCompare(b.correo || "")
      );
      setClientes(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // FILTRAR
  // ===========================
  const clientesFiltrados = clientes.filter((c) => {
    const texto = busqueda.toLowerCase();
    const coincideTexto =
      c.correo?.toLowerCase().includes(texto) ||
      c.nombre?.toLowerCase().includes(texto) ||
      c.telefono?.toLowerCase().includes(texto);
    const coincideRol =
      filtroRol === "todos" || c.rol === filtroRol;
    return coincideTexto && coincideRol;
  });

  // ===========================
  // CAMBIAR ROL
  // ===========================
  const cambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === "admin" ? "cliente" : "admin";
    try {
      await updateDoc(doc(db, "Usuarios", id), { rol: nuevoRol });
      setClientes((prev) =>
        prev.map((c) => c.id === id ? { ...c, rol: nuevoRol } : c)
      );
      if (clienteSeleccionado?.id === id) {
        setClienteSeleccionado((prev) => ({ ...prev, rol: nuevoRol }));
      }
    } catch (error) {
      console.error("Error cambiando rol:", error);
    }
  };

  // ===========================
  // ACTIVAR / DESACTIVAR
  // ===========================
  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    try {
      await updateDoc(doc(db, "Usuarios", id), { activo: nuevoEstado });
      setClientes((prev) =>
        prev.map((c) => c.id === id ? { ...c, activo: nuevoEstado } : c)
      );
      if (clienteSeleccionado?.id === id) {
        setClienteSeleccionado((prev) => ({ ...prev, activo: nuevoEstado }));
      }
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // ===========================
  // ELIMINAR
  // ===========================
  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "Usuarios", id));
      setClientes((prev) => prev.filter((c) => c.id !== id));
      if (clienteSeleccionado?.id === id) setClienteSeleccionado(null);
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  // ===========================
  // ESTADÍSTICAS
  // ===========================
  const total    = clientes.length;
  const activos  = clientes.filter((c) => c.activo !== false).length;
  const admins   = clientes.filter((c) => c.rol === "admin").length;
  const inactivos = clientes.filter((c) => c.activo === false).length;

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-8">

        {/* HEADER */}
        <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl">
              <FaUsers className="text-5xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Gestión de Clientes</h1>
              <p className="mt-2 text-orange-100 text-lg">
                Administra los usuarios registrados en OrderSphere.
              </p>
            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Usuarios",  value: total,     color: "text-orange-500", border: "border-orange-400" },
            { label: "Activos",         value: activos,   color: "text-green-500",  border: "border-green-400"  },
            { label: "Inactivos",       value: inactivos, color: "text-red-400",    border: "border-red-400"    },
            { label: "Administradores", value: admins,    color: "text-blue-500",   border: "border-blue-400"   },
          ].map(({ label, value, color, border }) => (
            <div key={label} className={`bg-white rounded-2xl p-6 shadow-sm border-l-4 ${border}`}>
              <p className="text-slate-500 text-sm font-medium">{label}</p>
              <p className={`text-4xl font-black mt-2 tracking-tight ${color}`}>
                {loading ? "—" : value}
              </p>
            </div>
          ))}
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaUsers className="text-orange-500" />
              Lista de Usuarios
              <span className="text-sm font-normal text-slate-400 ml-1">
                ({clientesFiltrados.length})
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <select
                value={filtroRol}
                onChange={(e) => setFiltroRol(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none bg-white"
              >
                <option value="todos">Todos los roles</option>
                <option value="cliente">Clientes</option>
                <option value="admin">Administradores</option>
              </select>

              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, correo o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9 pr-9 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none w-full sm:w-72"
                />
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <FaTimes size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p className="text-slate-400">Cargando usuarios...</p>
              </div>
            ) : clientesFiltrados.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FaUsers className="text-5xl mx-auto mb-3 opacity-20" />
                <p>No se encontraron usuarios.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left py-4 px-6 text-slate-500 text-sm font-semibold">Usuario</th>
                    <th className="text-left py-4 px-6 text-slate-500 text-sm font-semibold">Correo</th>
                    <th className="text-left py-4 px-6 text-slate-500 text-sm font-semibold">Teléfono</th>
                    <th className="text-left py-4 px-6 text-slate-500 text-sm font-semibold">Rol</th>
                    <th className="text-left py-4 px-6 text-slate-500 text-sm font-semibold">Estado</th>
                    <th className="text-center py-4 px-6 text-slate-500 text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="border-t border-slate-100 hover:bg-orange-50/40 transition-colors cursor-pointer"
                      onClick={() => setClienteSeleccionado(cliente)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            {cliente.rol === "admin"
                              ? <FaUserShield className="text-orange-500" />
                              : <FaUserAlt className="text-orange-400" />
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {cliente.nombre || "Sin nombre"}
                            </p>
                            <p className="text-slate-400 text-xs">
                              {cliente.direccion || "Sin dirección"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <FaEnvelope className="text-slate-300 shrink-0" />
                          {cliente.correo || "Sin correo"}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                          <FaPhone className="text-slate-300 shrink-0" />
                          {cliente.telefono || "—"}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cliente.rol === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {cliente.rol === "admin" ? "Admin" : "Cliente"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          cliente.activo !== false
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {cliente.activo !== false ? "● Activo" : "● Inactivo"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => toggleEstado(cliente.id, cliente.activo !== false)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                              cliente.activo !== false
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            {cliente.activo !== false
                              ? <><FaToggleOff /> Desactivar</>
                              : <><FaToggleOn /> Activar</>
                            }
                          </button>

                          <button
                            onClick={() => cambiarRol(cliente.id, cliente.rol)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1 transition-all"
                          >
                            <FaUserShield />
                            {cliente.rol === "admin" ? "→ Cliente" : "→ Admin"}
                          </button>

                          <button
                            onClick={() => {
                              setIdEliminar(cliente.id);
                              setMostrarEliminar(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-1 transition-all"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DETALLE */}
      {clienteSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setClienteSeleccionado(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-black text-slate-900">Detalle del usuario</h3>
              <button
                onClick={() => setClienteSeleccionado(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <FaTimes className="text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                {clienteSeleccionado.rol === "admin"
                  ? <FaUserShield className="text-orange-500 text-2xl" />
                  : <FaUserAlt className="text-orange-400 text-2xl" />
                }
              </div>
              <div>
                <p className="font-black text-slate-900 text-lg">
                  {clienteSeleccionado.nombre || "Sin nombre"}
                </p>
                <p className="text-slate-500 text-sm">{clienteSeleccionado.correo}</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 mb-6">
              {[
                { label: "UID",       value: clienteSeleccionado.uid || clienteSeleccionado.id },
                { label: "Rol",       value: clienteSeleccionado.rol || "cliente" },
                { label: "Estado",    value: clienteSeleccionado.activo !== false ? "Activo" : "Inactivo" },
                { label: "Teléfono",  value: clienteSeleccionado.telefono || "—" },
                { label: "Dirección", value: clienteSeleccionado.direccion || "—" },
                { label: "Registro",  value: clienteSeleccionado.fechaRegistro?.toDate?.()
                    ?.toLocaleDateString("es-MX") || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="text-slate-700 font-semibold text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleEstado(clienteSeleccionado.id, clienteSeleccionado.activo !== false)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  clienteSeleccionado.activo !== false
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {clienteSeleccionado.activo !== false
                  ? <><FaToggleOff /> Desactivar</>
                  : <><FaToggleOn /> Activar</>
                }
              </button>
              <button
                onClick={() => cambiarRol(clienteSeleccionado.id, clienteSeleccionado.rol)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center justify-center gap-2 transition-all"
              >
                <FaUserShield />
                {clienteSeleccionado.rol === "admin" ? "→ Cliente" : "→ Admin"}
              </button>
              <button
                onClick={() => {
                  setIdEliminar(clienteSeleccionado.id);
                  setClienteSeleccionado(null);
                  setMostrarEliminar(true);
                }}
                className="py-2.5 px-4 rounded-xl font-bold text-sm bg-red-100 text-red-600 hover:bg-red-200 flex items-center gap-2 transition-all"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR */}
      {mostrarEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <FaExclamationTriangle className="text-red-500" />
              Eliminar usuario
            </h3>
            <p className="text-slate-500 mb-6">
              ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMostrarEliminar(false)}
                className="bg-slate-200 hover:bg-slate-300 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1 transition-colors"
              >
                <FaTimes /> Cancelar
              </button>
              <button
                onClick={async () => {
                  await eliminarCliente(idEliminar);
                  setMostrarEliminar(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1 transition-colors"
              >
                <FaTrashAlt /> Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Clientes;