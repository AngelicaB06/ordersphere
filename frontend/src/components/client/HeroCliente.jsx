import { ArrowRight, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerPromociones } from "../../firebase/promociones";

function HeroCliente() {
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPromocion = async () => {
      try {
        const data = await obtenerPromociones();
        const activas = data.filter((p) => p.activa !== false);
        setPromo(activas[0] || null);
      } catch (error) {
        console.error("Error al obtener promociones:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarPromocion();
  }, []);

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-orange-200
        bg-white/60
        backdrop-blur-sm
        shadow-sm
      "
    >
      {/* Imagen de fondo si la promoción tiene una */}
      {promo?.imagen ? (
        <>
          <img
            src={promo.imagen}
            alt={promo.titulo}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30" />
        </>
      ) : (
        <div className="absolute right-4 top-2 text-[140px] opacity-10 pointer-events-none">
          🍔
        </div>
      )}

      <div className="relative z-10 p-8">
        <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">
          ✦ Oferta especial
        </p>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-9 bg-orange-100 rounded w-1/2" />
            <div className="h-5 bg-orange-100 rounded w-3/4" />
          </div>
        ) : promo ? (
          <>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              {promo.descuento > 0 && (
                <span className="flex items-center gap-1 text-orange-500">
                  <Percent size={28} />
                  {promo.descuento}% OFF
                </span>
              )}
            </h2>
            <p className="mt-2 text-slate-600 text-lg font-medium">
              {promo.titulo}
              {promo.descripcion ? ` — ${promo.descripcion}` : ""}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              🎉 Promociones
            </h2>
            <p className="mt-2 text-slate-500 text-lg">
              Descubre nuestras ofertas especiales
            </p>
          </>
        )}

        <button
          onClick={() => navigate("/promociones-cliente")}
          className="
            mt-6
            flex
            items-center
            gap-2
            bg-orange-500
            hover:bg-orange-400
            text-white
            px-7
            py-3
            rounded-2xl
            font-bold
            hover:scale-105
            transition-all
            duration-300
          "
        >
          Ver Promociones
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default HeroCliente;