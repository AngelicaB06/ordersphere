import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu, X, ShoppingCart, User, Home, UtensilsCrossed,
  Clock, ChevronRight, Search, Package, AlertCircle
} from "lucide-react";
import { db } from "../../firebase/firebaseConfig";
import {
  collection, query, where, onSnapshot, orderBy
} from "firebase/firestore";
import BottomNav from "../../components/client/BottomNav";

const ESTADO_CONFIG = {
  pendiente:  { label: "Pendiente",  bg: "bg-gray-100",   text: "text-gray-700"   },
  preparando: { label: "Preparando", bg: "bg-yellow-100", text: "text-yellow-700" },
  en_camino:  { label: "En Camino",  bg: "bg-blue-100",   text: "text-blue-700"   },
  entregado:  { label: "Entregado",  bg: "bg-green-100",  text: "text-green-700"  },
  cancelado:  { label: "Cancelado",  bg: "bg-red-100",    text: "text-red-700"    },
};

const EMOJIS_ESTADO = {
  pendiente:  "⏳",
  preparando: "👨‍🍳",
  en_camino:  "🛵",
  entregado:  "✅",
  cancelado:  "❌",
};

function formatFecha(ts) {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
  }) + " - " + date.toLocaleTimeString("es-MX", {
    hour: "2-digit", minute: "2-digit",
  });
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-slate-200 bg-white rounded-2xl p-5">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
          <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

function PedidosCliente() {
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [pedidos, setPedidos]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [busqueda, setBusqueda]       = useState("");

  // ── Leer usuario desde localStorage ──
  const uid    = localStorage.getItem("uid")    || "";
  const nombre = localStorage.getItem("nombre") || "Cliente";
  const correo = localStorage.getItem("correo") || "";

  /* ── Listener en tiempo real filtrado por uid ── */

useEffect(() => {
  // Verificar que exista una sesión activa
  if (!uid) {
    setError("No hay sesión activa. Inicia sesión nuevamente.");
    setLoading(false);
    return;
  }

  setLoading(true);

  const pedidosRef = collection(db, "pedidos");

  const q = query(
    pedidosRef,
    where("id_cliente", "==", uid),
    orderBy("fechadecreacion", "desc")
  );

  const unsubscribe = onSnapshot(
    
    q,
    (snapshot) => {
      const pedidosObtenidos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPedidos(pedidosObtenidos);
      setLoading(false);
      setError(null);
    },
    (error) => {
      console.error("Error al obtener pedidos:", error);

      // Error común cuando falta el índice compuesto
      if (error.code === "failed-precondition") {
        setError(
          "Firebase requiere crear un índice para esta consulta. Revisa la consola del navegador y abre el enlace que proporciona Firebase."
        );
      } else {
        setError("No fue posible cargar los pedidos.");
      }

      setLoading(false);
    }
  );

  // Limpiar listener al salir del componente
  return () => unsubscribe();

}, [uid]);


  /* ── Contadores dinámicos ── */
  const total      = pedidos.length;
  const enProceso  = pedidos.filter((p) =>
    ["pendiente", "preparando", "en_camino"].includes(p.estado)
  ).length;
  const entregados = pedidos.filter((p) => p.estado === "entregado").length;

  /* ── Filtro búsqueda ── */
  const pedidosFiltrados = pedidos.filter((p) => {
    const texto = busqueda.toLowerCase();
    return (
      Array.isArray(p.productos) &&
p.productos.some((prod) =>
  prod.nombre?.toLowerCase().includes(texto)
)
    );
  });

  const NAV_ITEMS = [
    { label: "Inicio",      path: "/inicio",        icon: <Home size={14} /> },
    { label: "Menú",        path: "/menu",           icon: <UtensilsCrossed size={14} /> },
    { label: "Mis Pedidos", path: "/pedidoscliente", icon: <Clock size={14} /> },
    { label: "Carrito",     path: "/carrito",        icon: <ShoppingCart size={14} /> },
    { label: "Perfil",      path: "/perfil",         icon: <User size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 relative overflow-hidden pb-28">

      {/* ── NAVBAR ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-slate-200 backdrop-blur-md bg-white/70 sticky top-0">
        <div className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tight">
          🍔 Order<span className="text-orange-500">Sphere</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, path, icon }) => (
            <span
              key={label}
              onClick={() => navigate(path)}
              className="flex items-center gap-1.5 text-slate-500 text-sm font-medium cursor-pointer hover:text-orange-500 transition-colors duration-200"
            >
              {icon} {label}
            </span>
          ))}
        </div>
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700"
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ── MENÚ MOBILE ── */}
      {menuAbierto && (
        <div className="md:hidden fixed inset-0 z-40 bg-linear-to-br from-slate-100 via-orange-50 to-red-50 backdrop-blur-xl flex flex-col pt-24 px-8">
          <div className="flex flex-col gap-2">
            {[
              { icon: <Home size={20} />,            label: "Inicio",      path: "/inicio" },
              { icon: <UtensilsCrossed size={20} />, label: "Menú",        path: "/menu" },
              { icon: <Clock size={20} />,           label: "Mis Pedidos", path: "/pedidoscliente" },
              { icon: <ShoppingCart size={20} />,    label: "Carrito",     path: "/carrito" },
              { icon: <User size={20} />,            label: "Mi Perfil",   path: "/perfil" },
            ].map(({ icon, label, path }) => (
              <button
                key={label}
                onClick={() => { navigate(path); setMenuAbierto(false); }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-700 hover:bg-white/60 hover:text-orange-500 transition-all text-left text-lg font-semibold"
              >
                <span className="text-orange-500">{icon}</span>
                {label}
                <ChevronRight size={16} className="ml-auto text-slate-400" />
              </button>
            ))}
          </div>
          <div className="mt-auto mb-12 p-5 rounded-2xl bg-white/70 border border-orange-200">
            <p className="text-slate-900 font-black text-lg">👋 Hola, {nombre}</p>
            <p className="text-slate-500 text-sm mt-1">{correo}</p>
          </div>
        </div>
      )}

      {/* ── CONTENIDO ── */}
      <div className="relative z-10 p-6 md:p-8 space-y-8">

        {/* Hero */}
        <div className="relative rounded-3xl p-8 border border-orange-200 bg-white/60 backdrop-blur-sm overflow-hidden">
          <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">✦ Tu actividad</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">🛒 Mis Pedidos</h2>
          <p className="mt-2 text-slate-500 text-lg">Consulta el estado de tus pedidos y el historial de compras.</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5">
            <AlertCircle size={20} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Resumen */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium">Pedidos Totales</h3>
              <p className="text-4xl font-black text-orange-500 mt-2 tracking-tight">{loading ? "—" : total}</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium">En Proceso</h3>
              <p className="text-4xl font-black text-yellow-500 mt-2 tracking-tight">{loading ? "—" : enProceso}</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-slate-500 text-sm font-medium">Entregados</h3>
              <p className="text-4xl font-black text-green-500 mt-2 tracking-tight">{loading ? "—" : entregados}</p>
            </div>
          </div>
        )}

        {/* Historial */}
        {!error && (
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">📦 Historial de Pedidos</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar pedido o producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {loading && <Skeleton />}

            {!loading && pedidosFiltrados.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-500 font-semibold text-lg">
                  {busqueda ? "Sin resultados para tu búsqueda" : "Aún no tienes pedidos"}
                </p>
                {!busqueda && (
                  <button
                    onClick={() => navigate("/menu")}
                    className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    Ver el Menú
                  </button>
                )}
              </div>
            )}

            {!loading && pedidosFiltrados.length > 0 && (
              <div className="space-y-3">
                {pedidosFiltrados.map((pedido) => {
                  const cfg   = ESTADO_CONFIG[pedido.estado] ?? ESTADO_CONFIG.pendiente;
                  const emoji = EMOJIS_ESTADO[pedido.estado] ?? "📦";
                  return (
                    <div
                      key={pedido.id}
                      className="border border-slate-200 bg-white rounded-2xl p-5 hover:shadow-md hover:border-orange-300 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 text-base">
                            Pedido #{pedido.id.slice(-6).toUpperCase()}
                          </h4>
                          <p className="text-slate-400 text-xs mt-0.5">{formatFecha(pedido.fechadecreacion)}</p>
                          <ul className="mt-3 space-y-0.5">
                          {Array.isArray(pedido.productos) &&
  pedido.productos.map((prod, i) => (
    <li key={i} className="text-slate-700 text-sm">
      🍽 {prod.nombre} x{prod.cantidad}
    </li>
  ))
}
                          </ul>
                          {pedido.direccion?.calle && (
                            <p className="mt-2 text-slate-400 text-xs">
                              📍 {pedido.direccion.calle} {pedido.direccion.numero_exterior},{" "}
                              {pedido.direccion.municipio}, {pedido.direccion.estado}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-2 shrink-0">
                          <span className={`${cfg.bg} ${cfg.text} px-4 py-1.5 rounded-full text-xs font-bold`}>
                            {emoji} {cfg.label}
                          </span>
                          <p className="text-xl font-black text-orange-500 tracking-tight">
                            ${Number(pedido.total).toFixed(2)}
                          </p>
                          {pedido.pago?.metodo === "tarjeta" && (
                            <p className="text-xs text-slate-400">💳 ****{pedido.pago.ultimos_4}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}

export default PedidosCliente;
