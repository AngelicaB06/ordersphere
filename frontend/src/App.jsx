import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Promociones from "./pages/Promociones";
import Settings from "./pages/Settings";
import PedidosCliente from "./pages/PedidosCliente";
import Inicio from "./pages/Inicio";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import LandingPage from "./pages/LandingPage";




function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<LandingPage />} />   {/* ← Landing como inicio */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/menu" element={<Menu />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/categorias" element={<Categorias />} />
  <Route path="/productos" element={<Productos />} />
  <Route path="/pedidos" element={<Pedidos />} />
  <Route path="/clientes" element={<Clientes />} />
  <Route path="/promociones" element={<Promociones />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/pedidoscliente" element={<PedidosCliente />} />
  <Route path="/inicio" element={<Inicio />} />
  <Route path="/carrito" element={<Carrito />} />
  <Route path="/perfil" element={<Perfil />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;