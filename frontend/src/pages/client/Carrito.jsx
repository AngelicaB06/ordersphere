import { useEffect, useState } from "react";

import HeaderCliente from "../../components/client/HeaderCliente";
import BottomNav from "../../components/client/BottomNav";

function Carrito() {

  const [productos, setProductos] = useState([]);

  useEffect(() => {

    const carritoGuardado =
      JSON.parse(
        localStorage.getItem("carrito")
      ) || [];

    setProductos(carritoGuardado);

  }, []);

  const eliminarProducto = (id) => {

    const nuevoCarrito =
      productos.filter(
        (producto) => producto.id !== id
      );

    setProductos(nuevoCarrito);

    localStorage.setItem(
      "carrito",
      JSON.stringify(nuevoCarrito)
    );

  };

  const subtotal = productos.reduce(
    (total, producto) =>
      total + (producto.precio * producto.cantidad),
    0
  );

  const envio = productos.length > 0 ? 30 : 0;

  const total = subtotal + envio;

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 pb-28">

      <HeaderCliente />

      <div className="max-w-7xl mx-auto p-8 space-y-8">

        {/* ENCABEZADO */}

        <div
          className="
            bg-gradient-to-r
            from-orange-500
            via-orange-600
            to-red-500
            rounded-[32px]
            p-10
            text-white
            shadow-2xl
          "
        >

          <h2 className="text-5xl font-black">
            🛒 Mi Carrito
          </h2>

          <p className="mt-3 text-orange-100 text-lg">
            Revisa tus productos antes de confirmar tu pedido.
          </p>

        </div>

        {/* CONTENIDO */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* PRODUCTOS */}

          <div
            className="
              xl:col-span-2
              bg-white
              rounded-3xl
              p-8
              shadow-xl
            "
          >

            <div className="flex items-center justify-between mb-8">

              <h3
                className="
                  text-3xl
                  font-bold
                  text-slate-800
                "
              >
                📦 Productos
              </h3>

              <div
                className="
                  bg-orange-100
                  text-orange-600
                  px-4
                  py-2
                  rounded-full
                  font-semibold
                "
              >
                {productos.length} productos
              </div>

            </div>

            {productos.length === 0 && (

              <div className="text-center py-20">

                <div className="text-7xl mb-4">
                  🛒
                </div>

                <p className="text-slate-500 text-xl">
                  Tu carrito está vacío
                </p>

              </div>

            )}

            <div className="space-y-6">

              {productos.map((producto) => (

                <div
                  key={producto.id}
                  className="
                    bg-white
                    border
                    border-slate-100
                    rounded-3xl
                    p-6
                    shadow-lg
                    hover:shadow-2xl
                    transition-all
                    duration-300
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div className="flex items-center gap-5">

                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="
                        w-24
                        h-24
                        object-cover
                        rounded-2xl
                        shadow-md
                      "
                    />

                    <div>

                      <h4
                        className="
                          font-bold
                          text-xl
                          text-slate-800
                        "
                      >
                        {producto.nombre}
                      </h4>

                      <p className="text-slate-500 mt-1">
                        Cantidad: {producto.cantidad}
                      </p>

                      <p className="text-slate-500">
                        ${producto.precio} x {producto.cantidad}
                      </p>

                      <p
                        className="
                          text-orange-500
                          font-black
                          text-xl
                          mt-2
                        "
                      >
                        $
                        {producto.precio *
                          producto.cantidad}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      eliminarProducto(producto.id)
                    }
                    className="
                      bg-red-100
                      text-red-600
                      px-4
                      py-2
                      rounded-xl
                      font-semibold
                      hover:bg-red-500
                      hover:text-white
                      transition
                    "
                  >
                    Eliminar
                  </button>

                </div>

              ))}

            </div>

          </div>

          {/* RESUMEN */}

          <div
            className="
              bg-white
              rounded-3xl
              p-8
              shadow-xl
              border
              border-slate-100
              h-fit
              sticky
              top-24
            "
          >

            <h3
              className="
                text-3xl
                font-bold
                text-slate-800
                mb-8
              "
            >
              🧾 Resumen
            </h3>

            <div className="space-y-5">

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Subtotal
                </span>

                <span className="font-bold">
                  ${subtotal}
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-slate-600">
                  Envío
                </span>

                <span className="font-bold">
                  ${envio}
                </span>

              </div>

              <hr className="my-4" />

              <div
                className="
                  flex
                  justify-between
                  items-center
                "
              >

                <span
                  className="
                    text-2xl
                    font-bold
                  "
                >
                  Total
                </span>

                <span
                  className="
                    text-3xl
                    font-black
                    text-orange-500
                  "
                >
                  ${total}
                </span>

              </div>

              <button
                className="
                  w-full
                  mt-6
                  bg-gradient-to-r
                  from-orange-500
                  to-red-500
                  text-white
                  py-4
                  rounded-2xl
                  font-bold
                  text-lg
                  shadow-lg
                  hover:shadow-2xl
                  hover:scale-105
                  transition-all
                  duration-300
                "
              >
                🚀 Confirmar Pedido
              </button>

            </div>

          </div>

        </div>

      </div>

      <BottomNav />

    </div>

  );

}

export default Carrito;