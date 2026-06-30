import {
  House,
  UtensilsCrossed,
  ShoppingCart,
  Package,
  User
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase/firebaseConfig";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cantidadCarrito, setCantidadCarrito] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "carritos"),
      where("id_cliente", "==", auth.currentUser.uid),
      where("estado", "==", "proceso")
    );

    // Escucha en tiempo real los cambios del carrito
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setCantidadCarrito(0);
        return;
      }
      const items = snapshot.docs[0].data().items || [];
      const total = items.reduce((acc, item) => acc + (item.cantidad || 1), 0);
      setCantidadCarrito(total);
    });

    return () => unsubscribe();
  }, []);

  const menu = [
    { icon: <House size={24} />, name: "Inicio", path: "/inicio" },
    { icon: <UtensilsCrossed size={24} />, name: "Menú", path: "/menu" },
    { icon: <ShoppingCart size={24} />, name: "Carrito", path: "/carrito", badge: cantidadCarrito },
    { icon: <Package size={24} />, name: "Pedidos", path: "/pedidoscliente" },
    { icon: <User size={24} />, name: "Perfil", path: "/perfil" },
  ];

  return (
    <>
      {/* Footer solo desktop */}
      <footer className="hidden md:block bg-white/70 backdrop-blur-md border-t border-slate-200 px-10 py-10">
        <div className="max-w-6xl mx-auto">

          <div>
            <div className="text-2xl font-black text-slate-900 mb-2">
              🍔 Order<span className="text-orange-500">Sphere</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
              La plataforma más completa para gestionar tu restaurante. Pedidos, inventario y equipos en un solo lugar.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-bold text-sm mb-4">Mi Cuenta</h4>
            <ul className="space-y-2">
              {[{ label: "Mi Perfil", path: "/perfil" }].map(({ label, path }) => (
                <li key={label}>
                  <span
                    onClick={() => navigate(path)}
                    className="text-slate-500 text-sm cursor-pointer hover:text-orange-500 transition-colors"
                  >
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-400 text-xs">
              © 2025 OrderSphere · Todos los derechos reservados
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-400 text-xs">Todos los sistemas operativos</span>
            </div>
          </div>

        </div>
      </footer>

      {/* BottomNav solo mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 border-t border-slate-200 backdrop-blur-xl shadow-lg flex justify-around py-3 z-50">
        {menu.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            title={item.name}
            className={`relative flex flex-col items-center justify-center transition-all duration-300 ${
              location.pathname === item.path
                ? "text-orange-500"
                : "text-slate-400 hover:text-orange-400"
            }`}
          >
            {item.icon}
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
            <span className="text-[10px] mt-1">{item.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

export default BottomNav;