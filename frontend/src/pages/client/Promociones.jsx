import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu as MenuIcon,
  X,
  ShoppingCart,
  User,
  Home,
  UtensilsCrossed,
  Clock,
  ChevronRight,
  Gift,
  Percent,
  ArrowRight
} from "lucide-react";
import BottomNav from "../../components/client/BottomNav";
import { obtenerPromociones } from "../../firebase/promociones";
import { agregarAlCarrito } from "../../firebase/AgregarCarrito";
import { auth } from "../../firebase/firebaseConfig";

function Promociones() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agregandoId, setAgregandoId] = useState(null);

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        const data = await obtenerPromociones();
        const activas = data.filter((p) => p.activa !== false);
        setPromociones(activas);
      } catch (error) {
        console.error("Error al obtener promociones:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarPromociones();
  }, []);

  const handleAgregarAlCarrito = async (promo) => {
    if (!auth.currentUser) {
      alert("Debes iniciar sesión");
      return;
    }

    // Promo con producto vinculado (ej. 3x2)
    // NOTA: el campo en Firestore se llama "id_producto" (snake_case),
    // tal como lo guarda el panel de administración de promociones.
    if (promo.id_producto && promo.cantidadLleva && promo.cantidadPaga) {
      try {
        setAgregandoId(promo.id);
        await agregarAlCarrito({
          idCliente: auth.currentUser.uid,
          idItem: promo.id_producto,
          tipo: "producto",
          cantidad: promo.cantidadLleva,
          extra: {
            cantidadPagar: promo.cantidadPaga,
            idPromocion: promo.id,
            nombrePromo: promo.titulo,
            esPromo: true
          }
        });
        alert(
          `${promo.titulo} agregada al carrito 🛒 (llevas ${promo.cantidadLleva}, pagas ${promo.cantidadPaga})`
        );
        window.dispatchEvent(new Event("carritoActualizado"));
      } catch (error) {
        console.error(error);
        alert("Error al agregar al carrito");
      } finally {
        setAgregandoId(null);
      }
      return;
    }

    // Promo sin producto vinculado todavía: no se puede agregar al
    // carrito porque no hay un producto real al que cobrarle. Se avisa
    // en vez de mandar el id de la promoción como si fuera un producto
    // (eso generaba items "fantasma" que nunca aparecían en el carrito).
    alert(
      `"${promo.titulo}" todavía no tiene un producto vinculado en el panel de administración. Avisa al equipo para que la configuren.`
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 relative overflow-hidden pb-28">

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-slate-200 backdrop-blur-md bg-white/70 top-0">
        <div className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tight">
          🍔 Order<span className="text-orange-500">Sphere</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Inicio", path: "/inicio", icon: <Home size={14} /> },
            { label: "Menú", path: "/menu", icon: <UtensilsCrossed size={14} /> },
            { label: "Mis Pedidos", path: "/pedidoscliente", icon: <Clock size={14} /> },
            { label: "Carrito", path: "/carrito", icon: <ShoppingCart size={14} /> },
            { label: "Perfil", path: "/perfil", icon: <User size={14} /> },
          ].map(({ label, path, icon }) => (
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
          {menuAbierto ? <X size={20} /> : <MenuIcon size={20} />}
        </button>
      </nav>

      {/* MENÚ MOBILE */}
      {menuAbierto && (
        <div className="md:hidden fixed inset-0 z-40 bg-gradient-to-br from-slate-100 via-orange-50 to-red-50 backdrop-blur-xl flex flex-col pt-24 px-8">
          <div className="flex flex-col gap-2">
            {[
              { icon: <Home size={20} />, label: "Inicio", path: "/inicio" },
              { icon: <UtensilsCrossed size={20} />, label: "Menú", path: "/menu" },
              { icon: <Clock size={20} />, label: "Mis Pedidos", path: "/pedidoscliente" },
              { icon: <ShoppingCart size={20} />, label: "Carrito", path: "/carrito" },
              { icon: <User size={20} />, label: "Mi Perfil", path: "/perfil" },
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
            <p className="text-slate-900 font-black text-lg">👋 Hola, Cliente</p>
            <p className="text-slate-500 text-sm mt-1">admin@ordersphere.com</p>
          </div>
        </div>
      )}

      {/* CONTENIDO */}
      <div className="relative z-10 p-6 md:p-8 space-y-8">

        {/* Encabezado */}
        <div className="relative rounded-3xl p-8 border border-orange-200 bg-white/60 backdrop-blur-sm overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center text-[120px] opacity-[0.08] pointer-events-none select-none">
            🎁
          </div>
          <div className="relative z-10 max-w-md">
            <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">
              ✦ Para ti
            </p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              🎉 Promociones
            </h2>
            <p className="mt-2 text-slate-500 text-lg">
              Aprovecha nuestras ofertas especiales antes de que se acaben.
            </p>
          </div>
        </div>

        {/* Lista de promociones */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white/70 border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-6">
                  <div className="h-5 bg-slate-200 rounded mb-3 w-2/3" />
                  <div className="h-4 bg-slate-200 rounded mb-2 w-full" />
                  <div className="h-4 bg-slate-200 rounded mb-4 w-3/4" />
                  <div className="h-9 bg-slate-200 rounded-xl w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : promociones.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {promociones.map((promo) => {
              const tieneProducto = !!(promo.id_producto && promo.cantidadLleva && promo.cantidadPaga);
              return (
                <div
                  key={promo.id}
                  className="
                    group
                    relative
                    bg-white/80
                    backdrop-blur-sm
                    border
                    border-orange-200
                    rounded-2xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  {/* Imagen de la promoción */}
                  {promo.imagen ? (
                    <div className="relative h-44 w-full overflow-hidden bg-orange-50">
                      <img
                        src={promo.imagen}
                        alt={promo.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add("hidden");
                        }}
                      />
                      {promo.descuento > 0 && (
                        <span className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
                          <Percent size={13} />
                          {promo.descuento}% OFF
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-44 w-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                      <Gift className="text-orange-300" size={56} />
                      {promo.descuento > 0 && (
                        <span className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500 text-white text-sm font-black px-3 py-1.5 rounded-full shadow-lg">
                          <Percent size={13} />
                          {promo.descuento}% OFF
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="font-black text-slate-900 text-xl tracking-tight">
                      {promo.titulo}
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed line-clamp-2">
                      {promo.descripcion}
                    </p>
                    {tieneProducto && (
                      <p className="text-orange-500 text-xs font-bold mt-2">
                        Llevas {promo.cantidadLleva}, pagas {promo.cantidadPaga}
                      </p>
                    )}
                    {!tieneProducto && (
                      <p className="text-red-400 text-xs font-semibold mt-2">
                        ⚠ Promoción no disponible para agregar todavía
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-5 flex-wrap">
                      <button
                        onClick={() => navigate("/menu")}
                        className="
                          flex
                          items-center
                          gap-2
                          bg-white
                          border
                          border-orange-300
                          text-orange-600
                          hover:bg-orange-50
                          px-5
                          py-2.5
                          rounded-xl
                          font-bold
                          text-sm
                          transition-all
                          duration-200
                        "
                      >
                        Ver Menú
                        <ArrowRight size={15} />
                      </button>

                      <button
                        onClick={() => handleAgregarAlCarrito(promo)}
                        disabled={agregandoId === promo.id}
                        className={`
                          flex
                          items-center
                          gap-2
                          px-5
                          py-2.5
                          rounded-xl
                          font-bold
                          text-sm
                          transition-all
                          duration-200
                          ${
                            agregandoId === promo.id
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-400 text-white hover:scale-105"
                          }
                        `}
                      >
                        <ShoppingCart size={15} />
                        {agregandoId === promo.id ? "Agregando..." : "Añadir al carrito"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Gift className="text-orange-500" size={32} />
            </div>
            <p className="text-slate-500 text-lg font-semibold">
              No hay promociones disponibles por ahora.
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Vuelve más tarde para ver nuevas ofertas.
            </p>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}

export default Promociones;