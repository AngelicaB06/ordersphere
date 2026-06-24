import Layout from "../components/Layout";

function Clientes() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">

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
            👥 Gestión de Clientes
          </h2>

          <p className="mt-3 text-orange-100 text-lg">
            Administra la información, actividad y estadísticas de tus clientes.
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
              transition-all
              duration-300
            "
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 text-sm font-medium">
              Clientes Totales
            </h3>
            <p className="text-4xl font-bold text-orange-500 mt-2">
              1,245
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 text-sm font-medium">
              Nuevos Este Mes
            </h3>
            <p className="text-4xl font-bold text-green-500 mt-2">
              98
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 text-sm font-medium">
              Clientes Frecuentes
            </h3>
            <p className="text-4xl font-bold text-blue-500 mt-2">
              326
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-slate-500 text-sm font-medium">
              Satisfacción
            </h3>
            <p className="text-4xl font-bold text-emerald-500 mt-2">
              96%
            </p>
          </div>

        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Tabla de clientes */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                📋 Lista de Clientes
              </h3>

              <input
                type="text"
                placeholder="Buscar cliente..."
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

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Cliente</th>
                    <th className="text-left py-3">Correo</th>
                    <th className="text-left py-3">Compras</th>
                    <th className="text-left py-3">Estado</th>
                  </tr>
                </thead>

                <tbody>

                  <tr className="border-b hover:bg-slate-50">
                    <td className="py-4 font-medium">
                      Juan Pérez
                    </td>
                    <td></td>
                    <td>24</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Activo
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-slate-50">
                    <td className="py-4 font-medium">
                      María López
                    </td>
                    <td>maria@email.com</td>
                    <td>18</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Activo
                      </span>
                    </td>
                  </tr>

                  <tr className="border-b hover:bg-slate-50">
                    <td className="py-4 font-medium">
                      Carlos Ramírez
                    </td>
                    <td>carlos@email.com</td>
                    <td>4</td>
                    <td>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Inactivo
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="py-4 font-medium">
                      Ana Torres
                    </td>
                    <td>ana@email.com</td>
                    <td>31</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Activo
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* Panel lateral */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              ⭐ Clientes Destacados
            </h3>

            <div className="space-y-5">

              <div className="border-b pb-4">
                <p className="font-semibold">
                  Juan Pérez
                </p>
                <p className="text-slate-500 text-sm">
                  24 compras realizadas
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="font-semibold">
                  Ana Torres
                </p>
                <p className="text-slate-500 text-sm">
                  Cliente VIP
                </p>
              </div>

              <div className="border-b pb-4">
                <p className="font-semibold">
                  María López
                </p>
                <p className="text-slate-500 text-sm">
                  Compra semanal
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  Cliente más reciente
                </p>
                <p className="text-slate-500 text-sm">
                  Roberto Gómez
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Clientes;