import { useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

import {
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  MapPin,
  Home,
  Building2,
  CreditCard,
  FileText,
  Banknote,
  ArrowLeft,
  ArrowRight,
  Wallet,
  Landmark
} from "lucide-react";

import {
  db,
  auth
} from "../../firebase/firebase";

function GenerarOrden() {

  const navigate = useNavigate();
  const location = useLocation();
  const { idCarrito } = location.state;

  const [form, setForm] = useState({
    calle: "",
    municipio: "",
    estado: "",
    numeroExterior: "",
    numeroInterior: "",
    referencias: "",
    pago: ""
  });

  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const seleccionarPago = (metodo) => {
    setForm({ ...form, pago: metodo });
  };

  const guardarPedido = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      await addDoc(
        collection(db, "pedidos"),
        {
          direccion: {
            calle: form.calle,
            municio: form.municipio,
            estado: form.estado,
            "numero exterior": form.numeroExterior,
            "numero interior": form.numeroInterior,
            referencias: form.referencias
          },
          estado: "proceso",
          fechadecreacion: serverTimestamp(),
          id_carrito: idCarrito,
          id_cliente: auth.currentUser.uid,
          pago: form.pago,
          total: 0,
          productos: ""
        }
      );

      navigate("/pedidoscliente");
    } catch (error) {
      console.error("Error al guardar pedido:", error);
      setEnviando(false);
    }
  };

  const metodosPago = [
    { id: "Efectivo", label: "Efectivo", icon: <Banknote size={20} />, desc: "Paga al recibir" },
    { id: "Tarjeta", label: "Tarjeta", icon: <CreditCard size={20} />, desc: "Débito o crédito" },
    { id: "Transferencia", label: "Transferencia", icon: <Landmark size={20} />, desc: "SPEI o banco" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-red-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors mb-6 text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Volver al carrito
        </button>

        <div className="mb-8">
          <p className="text-orange-500 text-sm font-bold tracking-widest uppercase mb-2">
            ✦ Último paso
          </p>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Finalizar pedido
          </h1>
          <p className="text-slate-500 mt-2">
            Ingresa tu dirección de envío y elige cómo quieres pagar.
          </p>
        </div>

        <form onSubmit={guardarPedido} className="space-y-6">

          {/* DIRECCIÓN */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                <MapPin className="text-orange-500" size={18} />
              </div>
              <h2 className="font-black text-slate-900 text-lg">
                Dirección de envío
              </h2>
            </div>

            <div className="space-y-4">
              <Input
                icon={<Home size={18} />}
                name="calle"
                placeholder="Calle"
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  icon={<Building2 size={18} />}
                  name="numeroExterior"
                  placeholder="Número exterior"
                  onChange={handleChange}
                />
                <Input
                  icon={<Building2 size={18} />}
                  name="numeroInterior"
                  placeholder="Número interior"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  icon={<MapPin size={18} />}
                  name="municipio"
                  placeholder="Municipio"
                  onChange={handleChange}
                />
                <Input
                  icon={<MapPin size={18} />}
                  name="estado"
                  placeholder="Estado"
                  onChange={handleChange}
                />
              </div>

              <Input
                icon={<FileText size={18} />}
                name="referencias"
                placeholder="Referencias (opcional)"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* MÉTODO DE PAGO */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
                <Wallet className="text-orange-500" size={18} />
              </div>
              <h2 className="font-black text-slate-900 text-lg">
                Método de pago
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {metodosPago.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => seleccionarPago(m.id)}
                  className={`
                    flex flex-col items-center gap-2 py-5 px-3 rounded-xl border-2 transition-all
                    ${
                      form.pago === m.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }
                  `}
                >
                  <span className={form.pago === m.id ? "text-orange-500" : "text-slate-400"}>
                    {m.icon}
                  </span>
                  <span className={`text-sm font-bold ${form.pago === m.id ? "text-orange-600" : "text-slate-600"}`}>
                    {m.label}
                  </span>
                  <span className="text-[11px] text-slate-400 text-center leading-tight">
                    {m.desc}
                  </span>
                </button>
              ))}
            </div>

            {!form.pago && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                Selecciona un método de pago para continuar
              </p>
            )}
          </div>

          {/* BOTÓN CONFIRMAR */}
          <button
            type="submit"
            disabled={!form.pago || enviando}
            className="
              w-full
              flex items-center justify-center gap-2
              bg-orange-500
              hover:bg-orange-600
              disabled:bg-slate-300
              disabled:cursor-not-allowed
              text-white
              py-4
              rounded-2xl
              font-bold
              text-base
              transition-all
              hover:shadow-lg
              hover:-translate-y-0.5
              disabled:hover:translate-y-0
              disabled:hover:shadow-none
            "
          >
            {enviando ? "Confirmando..." : "Confirmar pedido"}
            {!enviando && <ArrowRight size={18} />}
          </button>

        </form>
      </div>
    </div>
  );
}

function Input({ icon, ...props }) {
  return (
    <div className="
      flex
      items-center
      gap-3
      border
      border-slate-200
      rounded-xl
      px-4
      py-3.5
      focus-within:border-orange-400
      focus-within:ring-2
      focus-within:ring-orange-100
      transition-all
    ">
      <span className="text-slate-400">{icon}</span>
      <input
        className="w-full outline-none text-slate-700 placeholder:text-slate-400 text-sm bg-transparent"
        {...props}
      />
    </div>
  );
}

export default GenerarOrden;