import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Home,
  UtensilsCrossed,
  Clock,
  User,
  Menu as MenuIcon,
  X,
  ChevronRight,
  Receipt,
  Check,
  Banknote,
  CreditCard
} from "lucide-react";
import BottomNav from "../../components/client/BottomNav";
import ModalPago from "../../components/client/ModalPago";

function Carrito() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carrito, setCarrito] = useState(null);
  const [productos, setProductos] = useState([]);
  const [modalPagoAbierto, setModalPagoAbierto] = useState(false);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pedidoCompletado, setPedidoCompletado] = useState(null);

  useEffect(() => {
    obtenerCarrito();
  }, []);

  const obtenerCarrito = async () => {
    try {
      setCargando(true);
      setError(null);

      if (!auth.currentUser) {
        setCargando(false);
        return;
      }

      const q = query(
        collection(db, "carritos"),
        where("id_cliente", "==", auth.currentUser.uid),
        where("estado", "==", "proceso")
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setCarrito(null);
        setProductos([]);
        setCargando(false);
        return;
      }

      const carritoData = {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };

      setCarrito(carritoData);

      const items = carritoData.items || [];

      if (items.length === 0) {
        setProductos([]);
        setCargando(false);
        return;
      }

      const productosCompletos = await Promise.all(
        items.map(async (item) => {
          try {
            const ref = doc(db, "productos", item.id_item);
            const snap = await getDoc(ref);
            if (!snap.exists()) return null;
            return {
              id: item.id_item,
              cantidad: item.cantidad,
              cantidadPagar: item.cantidadPagar ?? item.cantidad,
              esPromo: item.esPromo || false,
              idPromocion: item.idPromocion || null,
              nombrePromo: item.nombrePromo || null,
              tipo: item.tipo || "producto",
              ...snap.data()
            };
          } catch (err) {
            console.error("Error obteniendo producto:", err);
            return null;
          }
        })
      );

      setProductos(productosCompletos.filter(Boolean));
    } catch (err) {
      console.error("Error obteniendo carrito:", err);
      setError("Error al cargar el carrito. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const nuevosProductos = productos.filter((p) => p.id !== id);
      setProductos(nuevosProductos);

      const nuevoItems = nuevosProductos.map((p) => ({
        id_item: p.id,
        cantidad: p.cantidad,
        tipo: p.tipo || "producto",
        ...(p.esPromo
          ? {
              cantidadPagar: p.cantidadPagar,
              esPromo: true,
              idPromocion: p.idPromocion,
              nombrePromo: p.nombrePromo
            }
          : {})
      }));

      await updateDoc(doc(db, "carritos", carrito.id), { items: nuevoItems });

      if (nuevosProductos.length === 0) {
        await updateDoc(doc(db, "carritos", carrito.id), { estado: "vacio" });
        setCarrito(null);
      }
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("Error al eliminar el producto. Por favor, intenta de nuevo.");
    }
  };

  const actualizarCantidad = async (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    try {
      const productosActualizados = productos.map((p) =>
        p.id === id && !p.esPromo ? { ...p, cantidad: nuevaCantidad } : p
      );
      setProductos(productosActualizados);

      const nuevoItems = productosActualizados.map((p) => ({
        id_item: p.id,
        cantidad: p.cantidad,
        tipo: p.tipo || "producto",
        ...(p.esPromo
          ? {
              cantidadPagar: p.cantidadPagar,
              esPromo: true,
              idPromocion: p.idPromocion,
              nombrePromo: p.nombrePromo
            }
          : {})
      }));

      await updateDoc(doc(db, "carritos", carrito.id), { items: nuevoItems });
    } catch (err) {
      console.error("Error actualizando cantidad:", err);
      alert("Error al actualizar la cantidad. Por favor, intenta de nuevo.");
    }
  };

  const subtotal = productos.reduce(
    (t, p) => t + p.precio * (p.esPromo ? p.cantidadPagar : p.cantidad),
    0
  );
  const envio = productos.length > 0 ? 30 : 0;
  const total = subtotal + envio;

  const handlePagoCompletado = (pedidoId) => {
    setPedidoCompletado(pedidoId);
    setModalPagoAbierto(false);
    setCarrito(null);
    setProductos([]);
  };

  // ========================
  // NAVBAR compartido
  // ========================
  const Navbar = () => (
    <>
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

      {menuAbierto && (
        <div className="md:hidden fixed inset-0 z-40 bg-linear-to-br from-slate-100 via-orange-50 to-red-50 backdrop-blur-xl flex flex-col pt-24 px-8">
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
            <p className="text-slate-500 text-sm mt-1">{auth.currentUser?.email || ""}</p>
          </div>
        </div>
      )}
    </>
  );

  if (cargando) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">
        <Navbar />
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-600">{error}</p>
            <button
              onClick={obtenerCarrito}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!carrito || productos.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">
        <Navbar />
        <div className="p-6">
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={48} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-500 mb-6">
              ¡Explora nuestros productos y encuentra lo que necesitas!
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
            >
              Ver productos
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">

      <Navbar />

      {/* HEADER */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-6">
          <h1 className="text-2xl font-black flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            Mi Carrito
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({productos.length} {productos.length === 1 ? "producto" : "productos"})
            </span>
          </h1>
        </div>
      </div>

      {/* PRODUCTOS */}
      <div className="p-4 space-y-3">
        {productos.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4">
              <img
                src={p.imagen || "/placeholder-image.jpg"}
                alt={p.nombre}
                className="w-20 h-20 rounded-lg object-cover"
                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{p.nombre}</h3>
                    {p.esPromo && (
                      <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full mt-1">
                        🎉 {p.nombrePromo}
                      </span>
                    )}
                    <p className="text-orange-500 font-semibold mt-1">
                      ${p.precio.toFixed(2)}{" "}
                      {p.esPromo && (
                        <span className="text-xs text-slate-400 font-normal">
                          c/u (precio normal)
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarProducto(p.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {p.esPromo ? (
                    <span className="text-sm font-semibold text-slate-600">
                      Llevas {p.cantidad}, pagas {p.cantidadPagar}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => actualizarCantidad(p.id, p.cantidad - 1)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{p.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(p.id, p.cantidad + 1)}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center font-bold transition-colors"
                      >
                        +
                      </button>
                    </>
                  )}
                  <span className="text-sm text-gray-500 ml-2">
                    Subtotal: ${(p.precio * (p.esPromo ? p.cantidadPagar : p.cantidad)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MÉTODO DE PAGO */}
      <div className="px-4 mb-2">
        <div className="bg-white rounded-2xl shadow-sm p-5 max-w-md mx-auto">
          <h3 className="font-black text-slate-900 text-base mb-3">
            Método de pago
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMetodoPago("efectivo")}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                metodoPago === "efectivo"
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Banknote
                size={24}
                className={metodoPago === "efectivo" ? "text-orange-500" : "text-slate-400"}
              />
              <span className={`text-sm font-bold ${
                metodoPago === "efectivo" ? "text-orange-600" : "text-slate-600"
              }`}>
                Efectivo
              </span>
            </button>

            <button
              onClick={() => setMetodoPago("tarjeta")}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-all ${
                metodoPago === "tarjeta"
                  ? "border-orange-500 bg-orange-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <CreditCard
                size={24}
                className={metodoPago === "tarjeta" ? "text-orange-500" : "text-slate-400"}
              />
              <span className={`text-sm font-bold ${
                metodoPago === "tarjeta" ? "text-orange-600" : "text-slate-600"
              }`}>
                Tarjeta
              </span>
            </button>
          </div>

          {metodoPago === "efectivo" && (
            <p className="text-xs text-slate-400 mt-3 text-center">
              💵 Pagarás en efectivo al recibir tu pedido.
            </p>
          )}
        </div>
      </div>

      {/* RESUMEN / TICKET */}
      <div className="p-4">
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden max-w-md mx-auto">

          <div className="h-2 bg-linear-to-r from-orange-400 via-orange-500 to-amber-500" />

          <div className="px-6 pt-6 pb-2 text-center border-b border-dashed border-slate-200">
            <div className="w-12 h-12 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-2">
              <Receipt className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="font-black text-slate-900 text-lg tracking-tight">
              Resumen de tu pedido
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              OrderSphere · {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>

          <div className="px-6 py-4 space-y-2">
            {productos.map((p) => (
              <div key={p.id} className="flex justify-between items-start text-sm">
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-slate-700 font-medium truncate">
                    {p.cantidad}x {p.nombre} {p.esPromo && "🎉"}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {p.esPromo
                      ? `Pagas ${p.cantidadPagar} de ${p.cantidad} · $${p.precio.toFixed(2)} c/u`
                      : `$${p.precio.toFixed(2)} c/u`}
                  </p>
                </div>
                <span className="text-slate-700 font-semibold whitespace-nowrap">
                  ${(p.precio * (p.esPromo ? p.cantidadPagar : p.cantidad)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="px-6">
            <div className="border-t border-dashed border-slate-200" />
          </div>

          <div className="px-6 py-4 space-y-2">
            <div className="flex justify-between text-sm text-slate-500">
              <span>Subtotal ({productos.length} {productos.length === 1 ? "producto" : "productos"})</span>
              <span className="font-medium text-slate-700">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Envío</span>
              <span className="font-medium text-slate-700">
                {envio > 0 ? `$${envio.toFixed(2)}` : "Gratis"}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Método de pago</span>
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                {metodoPago === "efectivo" ? (
                  <>
                    <Banknote size={14} className="text-orange-500" /> Efectivo
                  </>
                ) : (
                  <>
                    <CreditCard size={14} className="text-orange-500" /> Tarjeta
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="px-6 py-4 bg-orange-50/70 border-t border-dashed border-orange-200">
            <div className="flex justify-between items-center">
              <span className="font-black text-slate-900 text-lg tracking-tight">Total</span>
              <span className="font-black text-2xl text-orange-500 tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-4">
            <button
              onClick={() => setModalPagoAbierto(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>{metodoPago === "efectivo" ? "Confirmar pedido" : "Proceder al pago"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1.5">
              {metodoPago === "efectivo"
                ? "💵 Pago contra entrega."
                : "🔒 Transacción segura. Tus datos están protegidos."}
            </p>
          </div>

          <div
            className="h-3 w-full"
            style={{
              backgroundImage:
                "linear-gradient(135deg, white 50%, transparent 50%), linear-gradient(45deg, white 50%, transparent 50%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0, 0 0",
              backgroundColor: "transparent",
            }}
          />
        </div>
      </div>

      {modalPagoAbierto && (
        <ModalPago
          total={total}
          carrito={carrito}
          productos={productos}
          metodoPago={metodoPago}
          onClose={() => setModalPagoAbierto(false)}
          onFinish={handlePagoCompletado}
        />
      )}

      {pedidoCompletado && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-2xl max-w-md w-full text-center shadow-2xl overflow-hidden">

            <div className="h-2 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500" />

            <div className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-500" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                ¡Pedido confirmado!
              </h2>

              <div className="my-5 px-5 py-3 rounded-xl bg-slate-50 border border-dashed border-slate-200 inline-block">
                <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  No. de pedido
                </p>
                <p className="text-orange-500 font-black text-xl tracking-tight">
                  #{pedidoCompletado}
                </p>
              </div>

              <p className="text-slate-500 text-sm">
                {metodoPago === "efectivo"
                  ? "Tu pedido está confirmado. Paga en efectivo al recibirlo."
                  : "Tu pedido ha sido procesado exitosamente."}
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Recibirás un correo con los detalles de tu compra.
              </p>
              <button
                onClick={() => { setPedidoCompletado(null); navigate("/menu"); }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default Carrito;