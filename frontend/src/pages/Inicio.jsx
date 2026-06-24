import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Home, UtensilsCrossed, Clock, ArrowRight, Plus, ChevronRight } from "lucide-react";
import BottomNav from "../components/client/BottomNav";

function Inicio() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden">

      {/* Glows */}
      <div className="fixed w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[140px] -left-32 -bottom-32 pointer-events-none z-0" />
      <div className="fixed w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[140px] -right-20 -top-20 pointer-events-none z-0" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/8 backdrop-blur-md bg-[#050816]/80 sticky top-0">

        <div className="flex items-center gap-2 text-xl font-black text-white tracking-tight">
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
              className="flex items-center gap-1.5 text-slate-400 text-sm font-medium cursor-pointer hover:text-orange-400 transition-colors duration-200"
            >
              {icon} {label}
            </span>
          ))}
        </div>

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>

      </nav>

      {/* MENÚ MOBILE */}
      {menuAbierto && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#050816]/95 backdrop-blur-xl flex flex-col pt-24 px-8">
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
                className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-300 hover:bg-white/5 hover:text-orange-400 transition-all text-left text-lg font-semibold"
              >
                <span className="text-orange-500">{icon}</span>
                {label}
                <ChevronRight size={16} className="ml-auto text-slate-600" />
              </button>
            ))}
          </div>

          <div className="mt-auto mb-12 p-5 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <p className="text-white font-black text-lg">👋 Hola, Cliente</p>
            <p className="text-slate-500 text-sm mt-1">admin@ordersphere.com</p>
          </div>
        </div>
      )}

      {/* CONTENIDO */}
      <div className="relative z-10 p-6 pb-28">

        {/* Bienvenida */}
        <div className="relative rounded-3xl p-8 mb-8 border border-orange-500/20 bg-gradient-to-br from-orange-500/20 to-orange-600/5 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(249,115,22,0.15),transparent_70%)] pointer-events-none" />
          <p className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-2">
            ✦ Bienvenido de vuelta
          </p>
          <h2 className="text-4xl font-black text-white tracking-tight">
            👋 Hola, Cliente
          </h2>
          <p className="mt-2 text-slate-400 text-lg">
            ¿Qué se te antoja pedir hoy?
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="mt-6 flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-7 py-3 rounded-2xl font-bold hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
          >
            <UtensilsCrossed size={18} />
            Ver Menú
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Categorías */}
        <div className="mb-8">
          <h3 className="text-xl font-black text-white mb-4 tracking-tight">
            🍽 Categorías
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80", label: "Hamburguesas" },
              { img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&q=80", label: "Combos" },
              { img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&q=80", label: "Bebidas" },
              { img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80", label: "Postres" },
            ].map(({ img, label }) => (
              <div
                key={label}
                className="relative rounded-2xl overflow-hidden h-24 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <img src={img} alt={label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Más vendidos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black text-white tracking-tight">
              🔥 Más vendidos
            </h3>
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-1 text-orange-400 text-sm font-semibold cursor-pointer hover:text-orange-300 transition-colors"
            >
              Ver todos <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
                name: "Hamburguesa Especial",
                desc: "Carne, queso y papas",
                price: "$120",
              },
              {
                img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
                name: "Combo Familiar",
                desc: "Hamburguesas y papas",
                price: "$250",
              },
              {
                img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
                name: "Refresco",
                desc: "Bebida fría",
                price: "$35",
              },
            ].map(({ img, name, desc, price }) => (
              <div
                key={name}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-orange-500/25 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="rounded-xl overflow-hidden mb-4 h-40">
                  <img
                    src={img}
                    alt={name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-white text-base mb-1">{name}</h4>
                <p className="text-slate-500 text-sm mb-4">{desc}</p>
                <div className="flex justify-between items-center">
                  <span className="text-orange-400 font-black text-xl">{price}</span>
                  <button className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-110 transition-all duration-200 hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                    <Plus size={16} /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}

export default Inicio;