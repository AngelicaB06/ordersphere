import { Minus, Plus } from "lucide-react";
import { useState } from "react";

function ProductoCard({
  nombre,
  precio,
  imagen
}) {

  const [cantidad, setCantidad] = useState(1);

  const agregarAlCarrito = () => {

    const carritoActual =
      JSON.parse(
        localStorage.getItem("carrito")
      ) || [];

    carritoActual.push({
      id: Date.now(),
      nombre,
      precio,
      imagen,
      cantidad
    });

    localStorage.setItem(
      "carrito",
      JSON.stringify(carritoActual)
    );

    window.dispatchEvent(
      new Event("carritoActualizado")
    );

    alert(
      `${cantidad} ${nombre} agregado(s) al carrito 🛒`
    );

    setCantidad(1);
  };


  return (

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

      <img
        src={imagen}
        alt={nombre}
        className="
          h-40
          w-full
          object-cover
        "
      />


      <div className="p-5">


        <h3 className="font-bold text-slate-900 text-base">
          {nombre}
        </h3>


        <p className="text-slate-500 text-sm mt-1">
          Delicioso producto preparado al momento.
        </p>


        <div className="flex justify-between items-center mt-4">

          <span className="text-xl font-black text-orange-500">
            ${precio}
          </span>

        </div>


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
              font-bold
              flex
              items-center
              justify-center
            "
          >
            <Minus size={14}/>
          </button>


          <span
            className="
              font-bold
              w-6
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
              font-bold
              flex
              items-center
              justify-center
            "
          >
            <Plus size={14}/>
          </button>


        </div>


        <button
          onClick={agregarAlCarrito}
          className="
            w-full
            mt-4
            bg-orange-500
            hover:bg-orange-400
            text-white
            py-2.5
            rounded-xl
            font-bold
          "
        >
          Agregar al carrito
        </button>


      </div>


    </div>

  );

}


export default ProductoCard;