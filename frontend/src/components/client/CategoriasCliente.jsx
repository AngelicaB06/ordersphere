import { useEffect, useState } from "react";
import { obtenerCategorias } from "../../firebase/categorias";

function CategoriasCliente({ onSeleccionar, categoriaActiva }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        const activas = data.filter((c) => c.Activa !== false);
        setCategorias(activas);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCategorias();
  }, []);

  const handleClick = (categoria) => {
    if (!onSeleccionar) return;

    // Si ya estaba activa, la deselecciona (muestra todos los productos otra vez)
    if (categoriaActiva === categoria.nombre) {
      onSeleccionar(null);
    } else {
      onSeleccionar(categoria.nombre);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl h-20 bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <p className="text-slate-400 text-sm">
        No hay categorías registradas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {categorias.map((categoria) => {
        const activa = categoriaActiva === categoria.nombre;
        return (
          <button
            key={categoria.id}
            onClick={() => handleClick(categoria)}
            className={`
              relative
              rounded-2xl
              h-20
              flex
              flex-col
              items-center
              justify-center
              gap-1
              border
              transition-all
              duration-300
              ${
                activa
                  ? "bg-orange-500 border-orange-500 text-white shadow-md scale-105"
                  : "bg-white/70 border-slate-200 text-slate-700 hover:border-orange-300 hover:scale-105 hover:shadow-md"
              }
            `}
          >
            <span className="text-2xl">🍽</span>
            <p className="font-bold text-xs px-2 text-center truncate w-full">
              {categoria.nombre}
            </p>
          </button>
        );
      })}
    </div>
  );
}

export default CategoriasCliente;