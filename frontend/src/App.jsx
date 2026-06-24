import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Categorias";
import Productos from "./pages/Productos";
import Pedidos from "./pages/Pedidos";
import Clientes from "./pages/Clientes";
import Promociones from "./pages/Promociones";
import Settings from "./pages/Settings";

import LandingPage from "./pages/LandingPage";

import Inicio from "./pages/client/Inicio";
import Menu from "./pages/client/Menu";
import Carrito from "./pages/client/Carrito";
import PedidosCliente from "./pages/client/PedidosCliente";
import Perfil from "./pages/client/Perfil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/promociones" element={<Promociones />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="/menu" element={<Menu />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/pedidoscliente" element={<PedidosCliente />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;