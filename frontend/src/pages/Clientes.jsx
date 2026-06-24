import Layout from "../components/Layout";
import { useEffect, useState } from "react";

import {
  obtenerCategorias
} from "../firebase/categorias";

function Categorias() {

  // =====================================
  // ESTADOS
  // =====================================

  const [categorias, setCategorias] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [busqueda, setBusqueda] =
    useState("");

  // =====================================
  // CARGAR CATEGORÍAS
  // =====================================

  useEffect(() => {

    cargarCategorias();

  }, []);

  const cargarCategorias = async () => {

    try {

      const data =
        await obtenerCategorias();

      console.log(
        "Categorías:",
        data
      );

      setCategorias(data);

    } catch (error) {

      console.error(
        "Error cargando categorías",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  // =====================================
  // FILTRAR CATEGORÍAS
  // =====================================

  const categoriasFiltradas =
    categorias.filter((categoria) =>

      (categoria.nombre || "")
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )

    );

  return (

    <Layout>

      <div className="min-h-screen bg-slate-50 p-8">

        {/* =====================================
            HERO
        ===================================== */}

        <div
          className="
            bg-gradient-to-r
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
            🗂️ Gestión de Categorías
          </h2>

          <p className="mt-3 text-orange-100 text-lg">
            Organiza tus productos por categorías.
          </p>

        </div>

        {/* =====================================
            ESTADÍSTICAS
        ===================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            mb-8
          "
        >

          {/* TOTAL */}

          <div className="bg-white rounded-3xl p-6 shadow">

            <h3 className="text-slate-500">
              Total Categorías
            </h3>

            <p className="text-4xl font-bold text-orange-500 mt-2">

              {categorias.length}

            </p>

          </div>

          {/* ACTIVAS */}

          <div className="bg-white rounded-3xl p-6 shadow">

            <h3 className="text-slate-500">
              Activas
            </h3>

            <p className="text-4xl font-bold text-green-500 mt-2">

              {
                categorias.filter(
                  (c) =>
                    c.estado === true
                ).length
              }

            </p>

          </div>

          {/* OCULTAS */}

          <div className="bg-white rounded-3xl p-6 shadow">

            <h3 className="text-slate-500">
              Ocultas
            </h3>

            <p className="text-4xl font-bold text-yellow-500 mt-2">

              {
                categorias.filter(
                  (c) =>
                    c.estado === false
                ).length
              }

            </p>

          </div>

        </div>

        {/* =====================================
            TABLA
        ===================================== */}

        <div className="bg-white rounded-3xl p-6 shadow">

          <div
            className="
              flex
              justify-between
              items-center
              mb-6
            "
          >

            <h3 className="text-2xl font-bold">
              📋 Lista de Categorías
            </h3>

            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(
                  e.target.value
                )
              }
              className="
                border
                rounded-xl
                px-4
                py-2
              "
            />

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-3">
                    Nombre
                  </th>

                  <th className="text-left py-3">
                    Productos
                  </th>

                  <th className="text-left py-3">
                    Estado
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="3"
                      className="
                        text-center
                        py-8
                      "
                    >
                      Cargando categorías...
                    </td>

                  </tr>

                ) : (

                  categoriasFiltradas.map(
                    (categoria) => (

                      <tr
                        key={categoria.id}
                        className="
                          border-b
                          hover:bg-slate-50
                        "
                      >

                        {/* NOMBRE */}

                        <td className="py-4 font-semibold">

                          {categoria.nombre}

                        </td>

                        {/* PRODUCTOS */}

                        <td>

                          {
                            categoria.productos || 0
                          }

                        </td>

                        {/* ESTADO */}

                        <td>

                          <span
                            className={
                              categoria.estado

                                ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"

                                : "bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                            }
                          >

                            {
                              categoria.estado
                                ? "Activa"
                                : "Oculta"
                            }

                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </Layout>

  );

}

export default Categorias;