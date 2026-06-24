
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Moon,
  User
} from "lucide-react";

import { logoutUser } from "../firebase/auth";

function Header() {

  // ==========================
  // NAVEGACIÓN
  // ==========================

  const navigate = useNavigate();

  // ==========================
  // ESTADOS
  // ==========================

  const [mostrarPerfil, setMostrarPerfil] =
    useState(false);

  // ==========================
  // CERRAR SESIÓN
  // ==========================

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

      {/* ==========================
          NOTIFICACIONES
      ========================== */}

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

      {/* ==========================
          MODO OSCURO
      ========================== */}

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

      {/* ==========================
          PERFIL ADMINISTRADOR
      ========================== */}

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

          {/* Información */}

          <div>

            <h3
              className="
                text-xl
                font-bold
              "
            >
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

        {/* ==========================
            MENÚ DESPLEGABLE
        ========================== */}

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

                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >
                  Administrador
                </h3>

                <p
                  className="
                    text-slate-500
                    text-sm
                  "
                >
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

            {/* Cerrar sesión */}

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

export default Header;