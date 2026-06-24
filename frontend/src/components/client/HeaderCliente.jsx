import {
  Bell,
  ShoppingCart,
  User
} from "lucide-react";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

function HeaderCliente() {

  const navigate = useNavigate();

  const [usuario, setUsuario] =
    useState(null);

  const [cantidadCarrito,
    setCantidadCarrito] =
    useState(0);

  useEffect(() => {

    const usuarioGuardado =
      JSON.parse(
        localStorage.getItem("usuario")
      );

    if (usuarioGuardado) {

      setUsuario(usuarioGuardado);

    }

    const actualizarCarrito = () => {

      const carrito =
        JSON.parse(
          localStorage.getItem("carrito")
        ) || [];

      const total =
        carrito.reduce(
          (acc, producto) =>
            acc + (producto.cantidad || 1),
          0
        );

      setCantidadCarrito(total);

    };

    actualizarCarrito();

    window.addEventListener(
      "carritoActualizado",
      actualizarCarrito
    );

    return () => {

      window.removeEventListener(
        "carritoActualizado",
        actualizarCarrito
      );

    };

  }, []);

  return (

    <header
      className="
        bg-white
        shadow-md
        sticky
        top-0
        z-50
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          justify-between
          items-center
        "
      >

        <div>

          <h1 className="text-4xl font-black">

            🍔

            <span className="text-orange-500 ml-2">
              OrderSphere
            </span>

          </h1>

          <p className="text-slate-500">

            Hola 👋{" "}

            {usuario?.nombre || "Cliente"}

          </p>

        </div>

        <div className="flex items-center gap-6">

          {/* Notificaciones */}

          <button className="relative">

            <Bell size={24} />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-3
                h-3
                bg-red-500
                rounded-full
              "
            />

          </button>

          {/* Carrito */}

          <button
            className="relative"
            onClick={() =>
              navigate("/carrito")
            }
          >

            <ShoppingCart size={26} />

            {cantidadCarrito > 0 && (

              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-orange-500
                  text-white
                  text-xs
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
              >

                {cantidadCarrito}

              </span>

            )}

          </button>

          {/* Usuario */}

          <button
  onClick={() => navigate("/perfil")}
  className="
    w-12
    h-12
    rounded-full
    bg-gradient-to-r
    from-orange-500
    to-red-500
    flex
    items-center
    justify-center
    text-white
    font-bold
    text-lg
    hover:scale-110
    transition-all
    duration-300
    shadow-lg
  "
>
  {usuario?.nombre
    ? usuario.nombre.charAt(0).toUpperCase()
    : "U"}
</button>

        </div>

      </div>

    </header>

  );

}

export default HeaderCliente;