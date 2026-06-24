import { ArrowRight, UserPlus, Zap, BarChart2, Users, Package, Smartphone, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    { icon: <Zap size={22} />, title: "Pedidos en tiempo real", desc: "Recibe y gestiona pedidos al instante desde cualquier dispositivo, sin retrasos." },
    { icon: <BarChart2 size={22} />, title: "Reportes avanzados", desc: "Analiza ventas, tendencias y rendimiento con dashboards visuales e intuitivos." },
    { icon: <Users size={22} />, title: "Gestión de equipos", desc: "Administra roles, permisos y turnos de tu personal desde un solo panel." },
    { icon: <Package size={22} />, title: "Control de inventario", desc: "Monitorea stock, recibe alertas de bajo inventario y reduce el desperdicio." },
    { icon: <Smartphone size={22} />, title: "App multiplataforma", desc: "Disponible en web, tablet y móvil. Trabaja desde donde estés." },
    { icon: <ShieldCheck size={22} />, title: "Seguridad garantizada", desc: "Datos cifrados, accesos por roles y backups automáticos en la nube." },
  ];

  const stats = [
    { num: "+2,400", label: "Restaurantes activos" },
    { num: "98%", label: "Uptime garantizado" },
    { num: "4.9 ★", label: "Valoración promedio" },
    { num: "<1s", label: "Tiempo de respuesta" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* Glows */}
      <div className="absolute w-[700px] h-[700px] bg-orange-500/20 rounded-full blur-[160px] -left-48 -bottom-24 animate-pulse" />
      <div className="absolute w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[160px] -right-36 -top-24 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(45)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-orange-400 animate-pulse"
            style={{
              width: `${Math.random() * 7 + 2}px`,
              height: `${Math.random() * 7 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.15 + 0.05,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-10 py-6 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 text-2xl font-black tracking-tight">
          🍔 Order<span className="text-orange-500">Sphere</span>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 rounded-full border border-orange-500/40 bg-orange-500/8 text-orange-400 text-sm font-semibold hover:bg-orange-500/18 hover:border-orange-500 transition-all"
        >
          Iniciar sesión →
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/8 border border-orange-500/25 text-orange-400 text-xs font-bold tracking-widest uppercase mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Plataforma activa · +2,400 restaurantes
        </div>

        <div className="text-8xl mb-4 animate-bounce">🍔</div>

        <h1 className="text-7xl font-black tracking-tight leading-none mb-3">
          Order<span className="text-orange-500 relative">
            Sphere
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-transparent rounded" />
          </span>
        </h1>

        <p className="text-slate-500 text-lg max-w-md leading-relaxed mb-11">
          Gestión inteligente de restaurantes.<br />
          <strong className="text-slate-400">Pedidos, inventario y equipos</strong> en un solo lugar.
        </p>

        <div className="flex gap-4 mb-14 flex-wrap justify-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base hover:scale-105 hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] transition-all duration-300"
          >
            Iniciar sesión <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/4 border border-white/10 text-slate-400 font-semibold text-base hover:bg-white/8 hover:text-white hover:border-white/20 transition-all duration-300"
          >
            <UserPlus size={16} /> Crear cuenta gratis
          </button>
        </div>

        {/* Stats */}
        <div className="flex border border-white/7 rounded-2xl overflow-hidden bg-white/2">
          {stats.map((s, i) => (
            <div key={i} className={`px-9 py-5 text-center ${i < stats.length - 1 ? "border-r border-white/7" : ""}`}>
              <div className="text-3xl font-black">{s.num}</div>
              <div className="text-xs text-slate-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-10 pb-20">
        <p className="text-center text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">¿Por qué OrderSphere?</p>
        <h2 className="text-center text-4xl font-black tracking-tight mb-12">
          Todo lo que necesita <span className="text-slate-600">tu restaurante</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {features.map(({ icon, title, desc }) => (
            <div key={title}
              className="p-7 rounded-2xl bg-white/3 border border-white/7 hover:bg-white/6 hover:border-orange-500/25 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/12 border border-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                {icon}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Galería de comida */}
<section className="relative z-10 px-10 pb-20">
  <p className="text-center text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">
    Para todo tipo de negocio
  </p>
  <h2 className="text-center text-4xl font-black tracking-tight mb-10">
    Gestiona tu <span className="text-slate-600">menú completo</span>
  </h2>
  <div className="grid grid-cols-3 gap-4 max-w-5xl mx-auto">
    {[
      { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", label: "Hamburguesas" },
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", label: "Pizzas" },
      { url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80", label: "Papas fritas" },
      { url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80", label: "Wraps" },
      { url: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80", label: "Sushi" },
      { url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", label: "Pastas" },
    ].map(({ url, label }) => (
      <div key={label} className="relative rounded-2xl overflow-hidden group aspect-square">
        <img
          src={url}
          alt={label}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 text-white font-bold text-sm">
          {label}
        </span>
      </div>
    ))}
  </div>
</section>

      {/* CTA Band */}
      <div className="relative z-10 mx-10 mb-16 p-12 rounded-3xl bg-orange-500/6 border border-orange-500/15 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(249,115,22,0.12),transparent_60%)] pointer-events-none" />
        <h2 className="text-4xl font-black tracking-tight mb-3">¿Listo para transformar tu restaurante?</h2>
        <p className="text-slate-500 text-base mb-7">Únete a miles de negocios que ya gestionan todo con OrderSphere.</p>
        <button
          onClick={() => navigate("/login")}
          className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base hover:scale-105 hover:shadow-[0_0_50px_rgba(249,115,22,0.5)] transition-all duration-300"
        >
          Comenzar ahora <ArrowRight size={18} />
        </button>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5 text-slate-800 text-sm">
        ¿No tienes cuenta?{" "}
        <span onClick={() => navigate("/register")} className="text-orange-500 cursor-pointer hover:text-orange-400">
          Regístrate gratis
        </span>{" "}
        · © 2025 OrderSphere
      </footer>
    </div>
  );
}

export default LandingPage;