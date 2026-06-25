import { useState } from "react";
import { X, CreditCard, MapPin, User, Home, Building, Hash } from "lucide-react";
import { jsPDF } from "jspdf";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

function ModalPago({ total, carrito, productos, onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: dirección, 2: pago
  const [showCardForm, setShowCardForm] = useState(false);

  const [form, setForm] = useState({
    // Datos de envío
    calle: "",
    estado: "",
    municipio: "",
    numero_exterior: "",
    numero_interior: "",
    referencias: "",
    codigo_postal: "",
    nombre_receptor: "",
    telefono: "",

    // Datos de tarjeta
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatear número de tarjeta
    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    // Formatear fecha de expiración
    if (name === "cardExpiry") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    // Formatear CVV
    if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm({
      ...form,
      [name]: formattedValue,
    });

    // Limpiar error del campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validarDireccion = () => {
    const newErrors = {};
    const camposRequeridos = [
      "calle",
      "estado",
      "municipio",
      "numero_exterior",
      "codigo_postal",
      "nombre_receptor",
      "telefono",
    ];

    camposRequeridos.forEach((campo) => {
      if (!form[campo] || form[campo].trim() === "") {
        newErrors[campo] = "Este campo es obligatorio";
      }
    });

    // Validar código postal
    if (form.codigo_postal && !/^\d{5}$/.test(form.codigo_postal)) {
      newErrors.codigo_postal = "Código postal inválido (5 dígitos)";
    }

    // Validar teléfono
    if (form.telefono && !/^\d{10}$/.test(form.telefono.replace(/\D/g, ""))) {
      newErrors.telefono = "Teléfono inválido (10 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validarTarjeta = () => {
    const newErrors = {};
    const cardNumberClean = form.cardNumber.replace(/\s/g, "");

    if (!form.cardNumber || cardNumberClean.length < 16) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }

    if (!form.cardName || form.cardName.trim() === "") {
      newErrors.cardName = "Nombre en la tarjeta requerido";
    }

    if (!form.cardExpiry || !/^\d{2}\/\d{2}$/.test(form.cardExpiry)) {
      newErrors.cardExpiry = "Fecha de expiración inválida (MM/AA)";
    } else {
      const [month, year] = form.cardExpiry.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.cardExpiry = "Tarjeta expirada";
      }
    }

    if (!form.cardCvv || form.cardCvv.length < 3) {
      newErrors.cardCvv = "CVV inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (validarDireccion()) {
      setStep(2);
      setShowCardForm(true);
    }
  };

  const handlePagoConTarjeta = async (e) => {
    e.preventDefault();
    if (!validarTarjeta()) return;

    setLoading(true);
    setPaymentStatus("procesando");

    try {
      // Simulación de API de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular respuesta de la API
      const paymentResponse = {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        cardType: getCardType(form.cardNumber.replace(/\s/g, "")),
        lastFour: form.cardNumber.replace(/\s/g, "").slice(-4),
      };

      // Simular error aleatorio (10% de probabilidad para demostración)
      if (Math.random() < 0.1) {
        throw new Error("Pago rechazado por el banco emisor");
      }

      setPaymentStatus("exitoso");

      // Crear pedido en Firestore
      const pedido = {
        id_cliente: auth.currentUser?.uid || "usuario-anonimo",
        id_carrito: carrito.id,
        direccion: {
          calle: form.calle,
          estado: form.estado,
          municipio: form.municipio,
          numero_exterior: form.numero_exterior,
          numero_interior: form.numero_interior,
          referencias: form.referencias,
          codigo_postal: form.codigo_postal,
          nombre_receptor: form.nombre_receptor,
          telefono: form.telefono,
        },
        estado: "pendiente",
        pago: {
          metodo: "tarjeta",
          estado: "completado",
          transaccion_id: paymentResponse.transactionId,
          tipo_tarjeta: paymentResponse.cardType,
          ultimos_4: paymentResponse.lastFour,
          fecha_pago: serverTimestamp(),
        },
        productos: productos.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad,
        })),
        total,
        fechadecreacion: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, "pedidos"), pedido);

      // Actualizar carrito
      await updateDoc(doc(db, "carritos", carrito.id), {
        estado: "pendiente",
        pago: "completado",
      });

      generarPDF(ref.id, paymentResponse);

      setTimeout(() => {
        setLoading(false);
        onFinish(ref.id);
      }, 1500);
    } catch (error) {
      console.error("Error en el pago:", error);
      setPaymentStatus("fallido");
      setLoading(false);
    }
  };

  const getCardType = (number) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) return type;
    }
    return "desconocida";
  };

  const generarPDF = (pedidoId, paymentInfo) => {
    const docPdf = new jsPDF();

    docPdf.setFontSize(16);
    docPdf.text("TICKET DE COMPRA", 20, 20);

    docPdf.setFontSize(12);
    docPdf.text(`Pedido: ${pedidoId}`, 20, 30);
    docPdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 37);
    docPdf.text(`Total: $${total.toFixed(2)}`, 20, 44);

    if (paymentInfo) {
      docPdf.text(`Transacción: ${paymentInfo.transactionId}`, 20, 51);
      docPdf.text(
        `Tarjeta: ${paymentInfo.cardType} ****${paymentInfo.lastFour}`,
        20,
        58
      );
    }

    docPdf.text("--- Productos ---", 20, 68);
    productos.forEach((p, i) => {
      docPdf.text(
        `${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toFixed(2)}`,
        20,
        78 + i * 10
      );
    });

    docPdf.text("--- Dirección de envío ---", 20, 78 + productos.length * 10 + 10);
    docPdf.text(`${form.nombre_receptor}`, 20, 78 + productos.length * 10 + 17);
    docPdf.text(
      `${form.calle} ${form.numero_exterior}${form.numero_interior ? `, Int. ${form.numero_interior}` : ""}`,
      20,
      78 + productos.length * 10 + 24
    );
    docPdf.text(
      `${form.municipio}, ${form.estado}, CP ${form.codigo_postal}`,
      20,
      78 + productos.length * 10 + 31
    );
    if (form.referencias) {
      docPdf.text(`Ref: ${form.referencias}`, 20, 78 + productos.length * 10 + 38);
    }

    docPdf.save(`ticket-${pedidoId}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center sticky top-0 bg-white pb-4 border-b">
          <div>
            <h2 className="font-black text-xl flex items-center gap-2">
              {step === 1 ? (
                <>
                  <MapPin className="w-5 h-5" />
                  Dirección de envío
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Datos de pago
                </>
              )}
            </h2>
            <p className="text-sm text-gray-500">
              Paso {step} de 2
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X />
          </button>
        </div>

        {/* PASOS VISUALES */}
        <div className="flex items-center gap-2 py-2">
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= 1 ? "bg-orange-500" : "bg-gray-200"
            }`}
          />
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              step >= 2 ? "bg-orange-500" : "bg-gray-200"
            }`}
          />
        </div>

        {/* STEP 1: DIRECCIÓN */}
        {step === 1 && (
          <form onSubmit={handleSubmitDireccion} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Nombre del receptor *
                </label>
                <input
                  name="nombre_receptor"
                  placeholder="Nombre completo"
                  className={`w-full border ${errors.nombre_receptor ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.nombre_receptor}
                  onChange={handleChange}
                />
                {errors.nombre_receptor && (
                  <p className="text-red-500 text-sm mt-1">{errors.nombre_receptor}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="w-4 h-4 inline mr-1" />
                  Calle *
                </label>
                <input
                  name="calle"
                  placeholder="Calle y número"
                  className={`w-full border ${errors.calle ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.calle}
                  onChange={handleChange}
                />
                {errors.calle && (
                  <p className="text-red-500 text-sm mt-1">{errors.calle}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Número exterior *
                </label>
                <input
                  name="numero_exterior"
                  placeholder="Ext."
                  className={`w-full border ${errors.numero_exterior ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.numero_exterior}
                  onChange={handleChange}
                />
                {errors.numero_exterior && (
                  <p className="text-red-500 text-sm mt-1">{errors.numero_exterior}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="w-4 h-4 inline mr-1" />
                  Número interior
                </label>
                <input
                  name="numero_interior"
                  placeholder="Int."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={form.numero_interior}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  name="estado"
                  placeholder="Estado"
                  className={`w-full border ${errors.estado ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.estado}
                  onChange={handleChange}
                />
                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">{errors.estado}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio *
                </label>
                <input
                  name="municipio"
                  placeholder="Municipio"
                  className={`w-full border ${errors.municipio ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.municipio}
                  onChange={handleChange}
                />
                {errors.municipio && (
                  <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Código Postal *
                </label>
                <input
                  name="codigo_postal"
                  placeholder="CP"
                  className={`w-full border ${errors.codigo_postal ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.codigo_postal}
                  onChange={handleChange}
                />
                {errors.codigo_postal && (
                  <p className="text-red-500 text-sm mt-1">{errors.codigo_postal}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  name="telefono"
                  placeholder="10 dígitos"
                  className={`w-full border ${errors.telefono ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referencias
                </label>
                <input
                  name="referencias"
                  placeholder="Puntos de referencia (opcional)"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={form.referencias}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-lg font-bold text-orange-500">
                Total: ${total.toFixed(2)}
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Continuar con pago
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAGO CON TARJETA */}
        {step === 2 && (
          <form onSubmit={handlePagoConTarjeta} className="space-y-4">
            {/* Resumen del pedido */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumen del pedido</h3>
              <p className="text-sm text-gray-600">
                Envío a: {form.nombre_receptor} - {form.calle} {form.numero_exterior}, {form.municipio}, {form.estado}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {productos.length} productos • Total: <span className="font-bold text-orange-500">${total.toFixed(2)}</span>
              </p>
            </div>

            {/* Formulario de tarjeta */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de tarjeta *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className={`w-full border ${errors.cardNumber ? "border-red-500" : "border-gray-300"} p-3 pl-10 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    value={form.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                  />
                </div>
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre en la tarjeta *
                </label>
                <input
                  name="cardName"
                  placeholder="Como aparece en la tarjeta"
                  className={`w-full border ${errors.cardName ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.cardName}
                  onChange={handleChange}
                />
                {errors.cardName && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha expiración *
                  </label>
                  <input
                    name="cardExpiry"
                    placeholder="MM/AA"
                    className={`w-full border ${errors.cardExpiry ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    value={form.cardExpiry}
                    onChange={handleChange}
                    maxLength={5}
                  />
                  {errors.cardExpiry && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    name="cardCvv"
                    type="password"
                    placeholder="***"
                    className={`w-full border ${errors.cardCvv ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    value={form.cardCvv}
                    onChange={handleChange}
                    maxLength={4}
                  />
                  {errors.cardCvv && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Estados del pago */}
            {paymentStatus === "procesando" && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full"></div>
                Procesando pago...
              </div>
            )}

            {paymentStatus === "fallido" && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                ❌ Error al procesar el pago. Por favor, intenta de nuevo.
              </div>
            )}

            {paymentStatus === "exitoso" && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                ✅ ¡Pago completado con éxito! Redirigiendo...
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                ← Volver
              </button>

              <button
                type="submit"
                disabled={loading || paymentStatus === "exitoso"}
                className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading ? "animate-pulse" : ""
                }`}
              >
                {loading ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalPago;