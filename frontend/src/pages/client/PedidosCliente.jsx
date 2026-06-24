import BottomNav from "../../components/client/BottomNav";
import HeaderCliente from "../../components/client/HeaderCliente";

function PedidosCliente() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-orange-50 to-red-50 pb-28">
      <HeaderCliente />
      <div className="p-8 space-y-8">

      {/* Hero */}
      <div
        className="
          bg-linear-to-r
          from-orange-500
          to-orange-600
          rounded-3xl
          p-8
          text-white
          mb-8
          shadow-lg
        "
      >
        <h2 className="text-4xl font-bold">
          🛒 Mis Pedidos
        </h2>

        <p className="mt-3 text-orange-100 text-lg">
          Consulta el estado de tus pedidos y el historial de compras.
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-500 text-sm">
            Pedidos Totales
          </h3>

          <p className="text-4xl font-bold text-orange-500 mt-2">
            24
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-500 text-sm">
            En Proceso
          </h3>

          <p className="text-4xl font-bold text-yellow-500 mt-2">
            3
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-500 text-sm">
            Entregados
          </h3>

          <p className="text-4xl font-bold text-green-500 mt-2">
            21
          </p>
        </div>

      </div>

      {/* Historial */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
            📦 Historial de Pedidos
          </h3>

          <input
            type="text"
            placeholder="Buscar pedido..."
            className="
              border
              border-slate-300
              rounded-xl
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
            "
          />

        </div>

        <div className="space-y-4">

          {/* Pedido 1 */}
          <div className="border rounded-2xl p-5 hover:shadow-md transition">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">

              <div>
                <h4 className="font-bold text-lg">
                  Pedido #1001
                </h4>

                <p className="text-slate-500">
                  15 Junio 2026 - 6:30 PM
                </p>

                <p className="mt-2">
                  🍔 Hamburguesa Clásica x2
                </p>

                <p>
                  🥤 Refresco x2
                </p>
              </div>

              <div className="mt-4 md:mt-0 text-right">

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Entregado
                </span>

                <p className="text-xl font-bold mt-3 text-orange-500">
                  $320
                </p>

              </div>

            </div>

          </div>

          {/* Pedido 2 */}
          <div className="border rounded-2xl p-5 hover:shadow-md transition">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">

              <div>
                <h4 className="font-bold text-lg">
                  Pedido #1002
                </h4>

                <p className="text-slate-500">
                  18 Junio 2026 - 8:15 PM
                </p>

                <p className="mt-2">
                  🍟 Combo Doble x1
                </p>
              </div>

              <div className="mt-4 md:mt-0 text-right">

                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                  Preparando
                </span>

                <p className="text-xl font-bold mt-3 text-orange-500">
                  $210
                </p>

              </div>

            </div>

          </div>

          {/* Pedido 3 */}
          <div className="border rounded-2xl p-5 hover:shadow-md transition">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center">

              <div>
                <h4 className="font-bold text-lg">
                  Pedido #1003
                </h4>

                <p className="text-slate-500">
                  19 Junio 2026 - 2:10 PM
                </p>

                <p className="mt-2">
                  🌮 Tacos Especiales x3
                </p>
              </div>

              <div className="mt-4 md:mt-0 text-right">

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  En Camino
                </span>

                <p className="text-xl font-bold mt-3 text-orange-500">
                  $280
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Navegación inferior */}
      </div>
      <BottomNav />
    </div>
  );
}

export default PedidosCliente;