import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { agregarAlCarrito } from "../../firebase/AgregarCarrito";
import { auth } from "../../firebase/firebaseConfig";

function ProductoCard({
  id,
  nombre,
  precio,
  imagen,
  descripcion
}) {
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const handleAgregarAlCarrito = async () => {
    if (!auth.currentUser) {
      alert("Debes iniciar sesión");
      return;
    }
    try {
      setLoading(true);
      await agregarAlCarrito({
        idCliente: auth.currentUser.uid,
        idItem: id,
        tipo: "producto",
        cantidad
      });
      alert(
        `${cantidad} ${nombre} agregado(s) al carrito 🛒`
      );
      setCantidad(1);
      setModalAbierto(false);
      window.dispatchEvent(
        new Event("carritoActualizado")
      );
    } catch (error) {
      console.error(error);
      alert(
        "Error al agregar al carrito"
      );
    } finally {
      setLoading(false);
    }
  };

  const descripcionFinal = descripcion || "Delicioso producto preparado al momento.";

  return (
    <>
      <div
        className="
          bg-white/70
          backdrop-blur-sm
          rounded-2xl
          overflow-hidden
          border
          border-slate-200
          shadow-sm
          hover:shadow-md
          hover:border-orange-300
          hover:-translate-y-1
          transition-all
          duration-300
        "
      >
        {/* Zona clicable: abre el modal de detalle */}
        <button
          onClick={() => setModalAbierto(true)}
          className="w-full text-left cursor-pointer"
        >
          <img
            src={imagen}
            alt={nombre}
            className="
              h-40
              w-full
              object-cover
            "
          />
          <div className="px-5 pt-5">
            <h3 className="font-bold text-slate-900 text-base">
              {nombre}
            </h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">
              {descripcionFinal}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-black text-orange-500">
                ${precio}
              </span>
            </div>
          </div>
        </button>

        <div className="px-5 pb-5">
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() =>
                setCantidad(
                  cantidad > 1
                    ? cantidad - 1
                    : 1
                )
              }
              className="
                w-9
                h-9
                rounded-xl
                bg-slate-100
                border
                border-slate-200
                text-slate-600
                flex
                items-center
                justify-center
                hover:bg-slate-200
                transition
              "
            >
              <Minus size={14}/>
            </button>
            <span
              className="
                font-bold
                text-lg
                w-8
                text-center
              "
            >
              {cantidad}
            </span>
            <button
              onClick={() =>
                setCantidad(cantidad + 1)
              }
              className="
                w-9
                h-9
                rounded-xl
                bg-orange-500
                text-white
                flex
                items-center
                justify-center
                hover:bg-orange-400
                transition
              "
            >
              <Plus size={14}/>
            </button>
          </div>
          <button
            onClick={handleAgregarAlCarrito}
            disabled={loading}
            className={`
              w-full
              mt-4
              py-3
              rounded-xl
              font-bold
              flex
              items-center
              justify-center
              gap-2
              transition-all
              ${
                loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-400 text-white"
              }
            `}
          >
            <ShoppingCart size={18} />
            {
              loading
              ? "Agregando..."
              : "Agregar Producto"
            }
          </button>
        </div>
      </div>

      {/* MODAL DE DETALLE */}
      {modalAbierto && (
        <div
          className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModalAbierto(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-slate-600 transition-colors z-10"
            >
              <X size={18} />
            </button>

            <img
              src={imagen}
              alt={nombre}
              className="w-full h-56 sm:h-64 object-cover"
            />

            <div className="p-6">
              <h3 className="font-black text-slate-900 text-2xl tracking-tight">
                {nombre}
              </h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                {descripcionFinal}
              </p>

              <div className="flex items-center justify-between mt-5">
                <span className="text-2xl font-black text-orange-500 tracking-tight">
                  ${precio}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setCantidad(
                        cantidad > 1
                          ? cantidad - 1
                          : 1
                      )
                    }
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-slate-100
                      border
                      border-slate-200
                      text-slate-600
                      flex
                      items-center
                      justify-center
                      hover:bg-slate-200
                      transition
                    "
                  >
                    <Minus size={14}/>
                  </button>
                  <span className="font-bold text-lg w-8 text-center">
                    {cantidad}
                  </span>
                  <button
                    onClick={() =>
                      setCantidad(cantidad + 1)
                    }
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-orange-500
                      text-white
                      flex
                      items-center
                      justify-center
                      hover:bg-orange-400
                      transition
                    "
                  >
                    <Plus size={14}/>
                  </button>
                </div>
              </div>

              <button
                onClick={handleAgregarAlCarrito}
                disabled={loading}
                className={`
                  w-full
                  mt-6
                  py-3.5
                  rounded-xl
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                  transition-all
                  ${
                    loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-400 text-white hover:scale-[1.02]"
                  }
                `}
              >
                <ShoppingCart size={18} />
                {
                  loading
                  ? "Agregando..."
                  : "Agregar Producto"
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductoCard;