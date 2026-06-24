import { useEffect, useState } from "react";

import HeaderCliente from "../../components/client/HeaderCliente";
import HeroCliente from "../../components/client/HeroCliente";
import CategoriasCliente from "../../components/client/CategoriasCliente";
import ProductoCard from "../../components/client/ProductoCard";
import BottomNav from "../../components/client/BottomNav";

import { obtenerProductos } from "../../firebase/productos";

function Menu() {

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const cargarProductos = async () => {

      try {

        const data = await obtenerProductos();

        setProductos(data);

      } catch (error) {

        console.error(
          "Error al obtener productos:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    cargarProductos();

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-xl font-semibold">
          Cargando productos...
        </p>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">

      <HeaderCliente />

      <div className="p-8 space-y-8">

        <HeroCliente />

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Categorías
          </h2>

          <CategoriasCliente />

        </div>

        <div>

          <h2 className="text-2xl font-bold mb-4">
            Productos Populares
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {productos.length > 0 ? (

              productos.map((producto) => (

                <ProductoCard
                  key={producto.id}
                  nombre={producto.nombre}
                  precio={producto.precio}
                  imagen={producto.imagen}
                />

              ))

            ) : (

              <div className="col-span-full text-center">

                <p className="text-slate-500">
                  No hay productos registrados.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      <BottomNav />

    </div>

  );

}

export default Menu;