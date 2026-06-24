// pages/Dashboard.jsx
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { useEffect, useState } from "react";
import { obtenerPedidos } from "../firebase/pedidos";
import {
  obtenerTotalProductos,
  obtenerTotalClientes,
  obtenerTotalPromociones
} from "../firebase/dashboard";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function Dashboard() {
  // ==========================
  // ESTADOS
  // ==========================
  const [pedidos, setPedidos] = useState([]);
  const [ventasSemana, setVentasSemana] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  
  // Contadores dinámicos
  const [productos, setProductos] = useState(0);
  const [clientes, setClientes] = useState(0);
  const [promociones, setPromociones] = useState(0);

  // ==========================
  // CARGAR DATOS
  // ==========================
  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      // Obtener pedidos
      const data = await obtenerPedidos();
      setPedidos(data);

      // Contadores
      const totalProductos = await obtenerTotalProductos();
      setProductos(totalProductos);

      const totalClientes = await obtenerTotalClientes();
      setClientes(totalClientes);

      const totalPromociones = await obtenerTotalPromociones();
      setPromociones(totalPromociones);

      // Filtrar solo entregados
      const entregados = data.filter(pedido => pedido.estado === "Entregado");

      // Total de ventas
      const total = entregados.reduce((acum, pedido) => acum + Number(pedido.total || 0), 0);
      setTotalVentas(total);

      // Agrupar por fecha
      const agrupadas = {};
      entregados.forEach(pedido => {
        const fecha = pedido.fecha;
        if (!agrupadas[fecha]) {
          agrupadas[fecha] = 0;
        }
        agrupadas[fecha] += Number(pedido.total || 0);
      });

      const datosGrafica = Object.keys(agrupadas).map(fecha => ({
        fecha,
        ventas: agrupadas[fecha]
      }));
      setVentasSemana(datosGrafica);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    }
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white mb-8 shadow-lg">
          <h2 className="text-4xl font-bold">🍔 Bienvenido Administrador</h2>
          <p className="mt-3 text-orange-100 text-lg">
            Gestiona productos, pedidos y promociones desde un solo lugar.
          </p>
          <button className="mt-6 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300">
            Ver Pedidos
          </button>
        </div>

        {/* Tarjetas estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📦"
            title="Productos"
            value={productos}
            subtitle="Registrados"
          />
          <StatCard
            icon="🛒"
            title="Pedidos"
            value={pedidos.length}
            subtitle="Registrados"
          />
          <StatCard
            icon="👥"
            title="Clientes"
            value={clientes}
            subtitle="Registrados"
          />
          <StatCard
            icon="💰"
            title="Ventas"
            value={`$${totalVentas}`}
            subtitle="Pedidos entregados"
          />
        </div>

        {/* Sección inferior */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Gráfica de ventas */}
          <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              📈 Ventas Semanales
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ventasSemana}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="ventas" stroke="#f97316" strokeWidth={4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Actividad reciente (dinámica con pedidos reales) */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
              🔥 Actividad Reciente
            </h3>
            <div className="space-y-4">
              {pedidos.slice(-5).reverse().map((pedido) => (
                <div key={pedido.id} className="border-b pb-4">
                  <p className="font-semibold">
                    Pedido de {pedido.cliente || "Cliente"}
                  </p>
                  <p className="text-slate-500 text-sm">
                    {pedido.estado || "Pendiente"} • ${pedido.total || 0}
                  </p>
                </div>
              ))}
              {pedidos.length === 0 && (
                <p className="text-slate-500 text-center py-4">No hay pedidos recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;