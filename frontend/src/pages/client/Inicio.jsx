import HeaderCliente from "../../components/client/HeaderCliente";
import BottomNav from "../../components/client/BottomNav";

function InicioCliente() {

  return (

    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">

      <HeaderCliente />

      <div className="p-8 space-y-8">

        {/* Bienvenida */}
        <div
          className="
            bg-linear-to-r
            from-orange-500
            to-orange-600
            rounded-3xl
            p-8
            text-white
            shadow-lg
          "
        >

          <h2 className="text-4xl font-bold">
            👋 Hola Cliente
          </h2>

          <p className="mt-3 text-orange-100 text-lg">
            ¿Qué se te antoja pedir hoy?
          </p>

          <button
            className="
              mt-6
              bg-white
              text-orange-600
              px-6
              py-3
              rounded-xl
              font-semibold
              hover:scale-105
              transition
            "
          >
            Ver Menú 🍔
          </button>

        </div>

        {/* Categorías */}
        <div>

          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            🍽 Categorías
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

            <div className="bg-white rounded-3xl p-5 shadow-sm text-center hover:scale-105 transition">
              <div className="text-4xl">🍔</div>
              <p className="font-semibold mt-2">
                Hamburguesas
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm text-center hover:scale-105 transition">
              <div className="text-4xl">🍟</div>
              <p className="font-semibold mt-2">
                Combos
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm text-center hover:scale-105 transition">
              <div className="text-4xl">🥤</div>
              <p className="font-semibold mt-2">
                Bebidas
              </p>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-sm text-center hover:scale-105 transition">
              <div className="text-4xl">🍰</div>
              <p className="font-semibold mt-2">
                Postres
              </p>
            </div>

          </div>

        </div>

        {/* Productos destacados */}
        <div
          className="
            bg-white
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            🔥 Más vendidos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="border rounded-2xl p-5 hover:shadow-md transition">

              <div className="text-6xl text-center">
                🍔
              </div>

              <h4 className="font-bold text-lg mt-4">
                Hamburguesa Especial
              </h4>

              <p className="text-slate-500">
                Carne, queso y papas
              </p>

              <div className="flex justify-between items-center mt-4">

                <span className="text-orange-500 font-bold text-xl">
                  $120
                </span>

                <button
                  className="
                    bg-orange-500
                    text-white
                    px-4
                    py-2
                    rounded-xl
                  "
                >
                  +
                </button>

              </div>

            </div>

            <div className="border rounded-2xl p-5 hover:shadow-md transition">

              <div className="text-6xl text-center">
                🍟
              </div>

              <h4 className="font-bold text-lg mt-4">
                Combo Familiar
              </h4>

              <p className="text-slate-500">
                Hamburguesas y papas
              </p>

              <div className="flex justify-between items-center mt-4">

                <span className="text-orange-500 font-bold text-xl">
                  $250
                </span>

                <button
                  className="
                    bg-orange-500
                    text-white
                    px-4
                    py-2
                    rounded-xl
                  "
                >
                  +
                </button>

              </div>

            </div>

            <div className="border rounded-2xl p-5 hover:shadow-md transition">

              <div className="text-6xl text-center">
                🥤
              </div>

              <h4 className="font-bold text-lg mt-4">
                Refresco
              </h4>

              <p className="text-slate-500">
                Bebida fría
              </p>

              <div className="flex justify-between items-center mt-4">

                <span className="text-orange-500 font-bold text-xl">
                  $35
                </span>

                <button
                  className="
                    bg-orange-500
                    text-white
                    px-4
                    py-2
                    rounded-xl
                  "
                >
                  +
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      <BottomNav />

    </div>

  );

}

export default InicioCliente;