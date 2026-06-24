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

alert(
  `${cantidad} ${nombre} agregado(s) al carrito 🛒`
);

setCantidad(1);

};

return (


<div
  className="
    bg-white
    rounded-3xl
    overflow-hidden
    shadow-lg
    hover:shadow-2xl
    hover:scale-105
    transition-all
    duration-300
  "
>

  <img
    src={imagen}
    alt={nombre}
    className="
      h-56
      w-full
      object-cover
    "
  />

  <div className="p-5">

    <h3 className="font-bold text-2xl">
      {nombre}
    </h3>

    <p className="text-slate-500 mt-2">
      Delicioso producto preparado al momento.
    </p>

    <div className="flex justify-between items-center mt-5">

      <span className="text-2xl font-black text-orange-500">
        ${precio}
      </span>

    </div>

    <div className="flex items-center justify-center gap-4 mt-5">

      <button
        onClick={() =>
          setCantidad(
            cantidad > 1
              ? cantidad - 1
              : 1
          )
        }
        className="
          w-10
          h-10
          rounded-xl
          bg-slate-200
          font-bold
          text-lg
        "
      >
        -
      </button>

      <span className="text-xl font-bold w-8 text-center">
        {cantidad}
      </span>

      <button
        onClick={() =>
          setCantidad(cantidad + 1)
        }
        className="
          w-10
          h-10
          rounded-xl
          bg-orange-500
          text-white
          font-bold
          text-lg
        "
      >
        +
      </button>

    </div>

    <button
      onClick={agregarAlCarrito}
      className="
        w-full
        mt-5
        bg-orange-500
        hover:bg-orange-600
        text-white
        py-3
        rounded-xl
        font-semibold
      "
    >
      Agregar al carrito
    </button>

  </div>

</div>


);

}

export default ProductoCard;
