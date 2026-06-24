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

    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">

      <HeaderCliente />

      <div className="p-8 space-y-8">

        {/* Encabezado */}
        <div
          className="
            bg-gradient-to-r
            from-orange-500
            to-orange-600
            rounded-3xl
            p-8
            text-white
            shadow-lg
          "
        >

          <h2 className="text-4xl font-bold">
            🛒 Mi Carrito
          </h2>

          <p className="mt-3 text-orange-100 text-lg">
            Revisa tus productos antes de realizar el pedido.
          </p>

        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Productos */}
          <div
            className="
              xl:col-span-2
              bg-white
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <h3
              className="
                text-2xl
                font-bold
                text-slate-800
                mb-6
              "
            >
              📦 Productos
            </h3>

            {productos.length === 0 && (

              <div className="text-center py-10">

                <p className="text-slate-500 text-lg">
                  Tu carrito está vacío 🛒
                </p>

              </div>

            )}

            <div className="space-y-5">

              {productos.map((producto) => (

                <div
                  key={producto.id}
                  className="
                    border
                    rounded-2xl
                    p-5
                    hover:shadow-md
                    transition
                    flex
                    justify-between
                    items-center
                  "
                >

                  <div>

                    <h4 className="font-bold text-lg">
                      {producto.nombre}
                    </h4>

                    <p className="text-slate-500">
                      Cantidad: {producto.cantidad}
                    </p>

                    <p className="text-orange-500 font-bold mt-2">
                      ${producto.precio}
                    </p>

                  </div>

                  <div className="text-right">

                    <button
                      onClick={() =>
                        eliminarProducto(producto.id)
                      }
                      className="
                        text-red-500
                        text-sm
                        hover:text-red-700
                      "
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Resumen */}
          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-sm
              h-fit
            "
          >

            <h3
              className="
                text-2xl
                font-bold
                text-slate-800
                mb-6
              "
            >
              🧾 Resumen
            </h3>

            <div className="space-y-4">

              <div className="flex justify-between">

                <span>Subtotal</span>

                <span>${subtotal}</span>

              </div>

              <div className="flex justify-between">

                <span>Envío</span>

                <span>${envio}</span>

              </div>

              <hr />

              <div
                className="
                  flex
                  justify-between
                  text-xl
                  font-bold
                "
              >

                <span>Total</span>

                <span className="text-orange-500">
                  ${total}
                </span>

              </div>

              <button
                className="
                  w-full
                  bg-orange-500
                  text-white
                  py-4
                  rounded-2xl
                  font-bold
                  hover:bg-orange-600
                  transition
                "
              >
                Confirmar Pedido
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