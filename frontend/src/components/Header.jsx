jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// =====================================
// ICONOS
// =====================================

import {
  Bell,
  Moon,
  User
} from "lucide-react";

// =====================================
// FIREBASE
// =====================================

import { logoutUser } from "../firebase/auth";

export default function Header() {

  const navigate = useNavigate();

  const [mostrarPerfil, setMostrarPerfil] =
    useState(false);


  const cerrarSesion = async () => {

    try {

      await logoutUser();

      navigate("/");

    } catch (error) {

      console.error(error);

    }

  };


  return (

    <header
      className="
        bg-white
        shadow-sm
        border-b
        border-slate-200
        px-8
        py-4
        flex
        justify-end
        items-center
        gap-5
        relative
      "
    >

      <button
        className="
          w-14
          h-14
          rounded-2xl
          bg-slate-100
          flex
          items-center
          justify-center
          hover:bg-slate-200
          transition-all
        "
      >
        <Bell size={22} />
      </button>


      <button
        className="
          w-14
          h-14
          rounded-2xl
          bg-slate-100
          flex
          items-center
          justify-center
          hover:bg-slate-200
          transition-all
        "
      >
        <Moon size={22} />
      </button>



      <div className="relative">

        <button
          onClick={() =>
            setMostrarPerfil(
              !mostrarPerfil
            )
          }
          className="
            flex
            items-center
            gap-4
          "
        >

          {/* Avatar */}

          <div
            className="
              w-16
              h-16
              rounded-full
              bg-orange-500
              flex
              items-center
              justify-center
              text-white
            "
          >
            <User size={26} />
          </div>


          <div>

            <h3 className="text-xl font-bold">
              Administrador
            </h3>

            <p
              className="
                text-green-500
                text-sm
              "
            >
              ● Online
            </p>

          </div>

        </button>



        {mostrarPerfil && (

          <div
            className="
              absolute
              right-0
              top-20
              w-80
              bg-white
              rounded-3xl
              shadow-xl
              border
              border-slate-200
              p-5
              z-50
            "
          >

            {/* Cabecera */}

            <div
              className="
                flex
                items-center
                gap-4
                mb-4
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-orange-500
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <User size={24} />
              </div>

              <div>

                <h3 className="font-bold text-lg">
                  Administrador
                </h3>

                <p className="text-slate-500 text-sm">
                  admin@ordersphere.com
                </p>

              </div>

            </div>

            <hr />

            {/* Mi Perfil */}

            <button
              onClick={() =>
                navigate("/perfil")
              }
              className="
                w-full
                text-left
                mt-4
                p-3
                rounded-xl
                hover:bg-slate-100
                transition-all
              "
            >
              👤 Mi Perfil
            </button>

            {/* Configuración */}

            <button
              onClick={() =>
                navigate("/settings")
              }
              className="
                w-full
                text-left
                p-3
                rounded-xl
                hover:bg-slate-100
                transition-all
              "
            >
              ⚙️ Configuración
            </button>



            <button
              onClick={cerrarSesion}
              className="
                w-full
                text-left
                p-3
                rounded-xl
                text-red-500
                hover:bg-red-50
                transition-all
              "
            >
              🚪 Cerrar Sesión
            </button>

          </div>

        )}

      </div>

    </header>

  );

}