import { useState } from "react";
import { X, CreditCard, MapPin, User, Home, Building, Hash, Banknote } from "lucide-react";
import { jsPDF } from "jspdf";
import { db, auth } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

// ====================================
// FUNCIÓN AUXILIAR: línea punteada
// ====================================
const drawDashedLine = (docPdf, x1, y, x2, y2) => {
  docPdf.setLineDashPattern([1, 1], 0);
  docPdf.setDrawColor(200, 200, 200);
  docPdf.line(x1, y, x2, y2);
  docPdf.setLineDashPattern([], 0);
};

function ModalPago({ total, carrito, productos, metodoPago = "tarjeta", onClose, onFinish }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: dirección, 2: pago (solo tarjeta)

  const [form, setForm] = useState({
    calle: "",
    estado: "",
    municipio: "",
    numero_exterior: "",
    numero_interior: "",
    referencias: "",
    codigo_postal: "",
    nombre_receptor: "",
    telefono: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentStatus, setPaymentStatus] = useState(null);

  // ====================================
  // HELPER: cantidad que realmente se cobra por producto
  // (si es promo, se cobra cantidadPagar; si no, se cobra cantidad completa)
  // ====================================
  const cantidadCobrada = (p) => (p.esPromo ? p.cantidadPagar : p.cantidad);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    if (name === "cardExpiry") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    if (name === "cardCvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setForm({ ...form, [name]: formattedValue });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validarDireccion = () => {
    const newErrors = {};
    const camposRequeridos = [
      "calle", "estado", "municipio", "numero_exterior",
      "codigo_postal", "nombre_receptor", "telefono",
    ];

    camposRequeridos.forEach((campo) => {
      if (!form[campo] || form[campo].trim() === "") {
        newErrors[campo] = "Este campo es obligatorio";
      }
    });

    if (form.codigo_postal && !/^\d{5}$/.test(form.codigo_postal)) {
      newErrors.codigo_postal = "Código postal inválido (5 dígitos)";
    }

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

  // ====================================
  // SUBMIT DIRECCIÓN: rama según método
  // ====================================
  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (!validarDireccion()) return;

    if (metodoPago === "efectivo") {
      confirmarPedidoEfectivo();
    } else {
      setStep(2);
    }
  };

  // ====================================
  // CONFIRMAR PEDIDO EN EFECTIVO
  // ====================================
  const confirmarPedidoEfectivo = async () => {
    setLoading(true);
    setPaymentStatus("procesando");

    try {
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
          metodo: "efectivo",
          estado: "pendiente_entrega",
          fecha_pago: null,
        },
        productos: productos.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          cantidad: p.cantidad,
          cantidadPagar: cantidadCobrada(p),
          esPromo: p.esPromo || false,
          ...(p.esPromo
            ? { idPromocion: p.idPromocion || null, nombrePromo: p.nombrePromo || null }
            : {}),
        })),
        total,
        fechadecreacion: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, "pedidos"), pedido);

      await updateDoc(doc(db, "carritos", carrito.id), {
        estado: "pendiente",
        pago: "pendiente_entrega",
      });

      setPaymentStatus("exitoso");
      generarPDF(ref.id, null);

      setTimeout(() => {
        setLoading(false);
        onFinish(ref.id);
      }, 1200);
    } catch (error) {
      console.error("Error al confirmar pedido en efectivo:", error);
      setPaymentStatus("fallido");
      setLoading(false);
    }
  };

  // ====================================
  // PAGO CON TARJETA
  // ====================================
  const handlePagoConTarjeta = async (e) => {
    e.preventDefault();
    if (!validarTarjeta()) return;

    setLoading(true);
    setPaymentStatus("procesando");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const paymentResponse = {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        cardType: getCardType(form.cardNumber.replace(/\s/g, "")),
        lastFour: form.cardNumber.replace(/\s/g, "").slice(-4),
      };

      if (Math.random() < 0.1) {
        throw new Error("Pago rechazado por el banco emisor");
      }

      setPaymentStatus("exitoso");

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
          cantidadPagar: cantidadCobrada(p),
          esPromo: p.esPromo || false,
          ...(p.esPromo
            ? { idPromocion: p.idPromocion || null, nombrePromo: p.nombrePromo || null }
            : {}),
        })),
        total,
        fechadecreacion: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, "pedidos"), pedido);

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

  // ====================================
  // GENERAR PDF ESTILO TICKET
  // ====================================
  const generarPDF = (pedidoId, paymentInfo) => {
    const docPdf = new jsPDF({ unit: "mm", format: [80, 250] });
    const pageWidth = 80;
    const margin = 6;
    let y = 10;

    const naranja = [249, 115, 22];
    const grisOscuro = [30, 41, 59];
    const grisClaro = [148, 163, 184];

    // ===== ENCABEZADO =====
    docPdf.setFillColor(...naranja);
    docPdf.rect(0, 0, pageWidth, 22, "F");

    docPdf.setTextColor(255, 255, 255);
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(16);
    docPdf.text("OrderSphere", pageWidth / 2, 11, { align: "center" });

    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(8);
    y = 28;

    // ===== TÍTULO TICKET =====
    docPdf.setTextColor(...grisOscuro);
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(11);
    docPdf.text("TICKET DE COMPRA", pageWidth / 2, y, { align: "center" });
    y += 6;

    drawDashedLine(docPdf, margin, y, pageWidth - margin, y);
    y += 6;

    // ===== DATOS DEL PEDIDO =====
    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(8);
    docPdf.setTextColor(...grisClaro);
    docPdf.text("Pedido", margin, y);
    docPdf.setTextColor(...grisOscuro);
    docPdf.setFont("helvetica", "bold");
    docPdf.text(`#${pedidoId.slice(0, 10)}`, pageWidth - margin, y, { align: "right" });
    y += 5;

    docPdf.setFont("helvetica", "normal");
    docPdf.setTextColor(...grisClaro);
    docPdf.text("Fecha", margin, y);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text(
      new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }),
      pageWidth - margin,
      y,
      { align: "right" }
    );
    y += 5;

    docPdf.setTextColor(...grisClaro);
    docPdf.text("Método de pago", margin, y);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text(paymentInfo ? "Tarjeta" : "Efectivo", pageWidth - margin, y, { align: "right" });
    y += 7;

    if (paymentInfo) {
      docPdf.setFontSize(7.5);
      docPdf.setTextColor(...grisClaro);
      docPdf.text("Transacción", margin, y);
      docPdf.setTextColor(...grisOscuro);
      docPdf.text(paymentInfo.transactionId, pageWidth - margin, y, { align: "right" });
      y += 4.5;

      docPdf.setTextColor(...grisClaro);
      docPdf.text("Tarjeta", margin, y);
      docPdf.setTextColor(...grisOscuro);
      docPdf.text(`${paymentInfo.cardType.toUpperCase()} ****${paymentInfo.lastFour}`, pageWidth - margin, y, { align: "right" });
      y += 6;
      docPdf.setFontSize(8);
    } else {
      docPdf.setFillColor(255, 247, 237);
      docPdf.roundedRect(margin, y - 3.5, pageWidth - margin * 2, 6, 1, 1, "F");
      docPdf.setTextColor(...naranja);
      docPdf.setFontSize(7);
      docPdf.text("Pago contra entrega", pageWidth / 2, y, { align: "center" });
      y += 7;
      docPdf.setFontSize(8);
    }

    drawDashedLine(docPdf, margin, y, pageWidth - margin, y);
    y += 6;

    // ===== PRODUCTOS =====
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(8.5);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text("PRODUCTOS", margin, y);
    y += 5;

    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(8);

    productos.forEach((p) => {
      const nombreCorto = p.nombre.length > 22 ? p.nombre.slice(0, 22) + "…" : p.nombre;
      const cCobrada = cantidadCobrada(p);

      docPdf.setTextColor(...grisOscuro);
      docPdf.text(
        p.esPromo ? `${p.cantidad}x ${nombreCorto} (paga ${cCobrada})` : `${p.cantidad}x ${nombreCorto}`,
        margin,
        y
      );
      docPdf.setFont("helvetica", "bold");
      docPdf.text(`$${(p.precio * cCobrada).toFixed(2)}`, pageWidth - margin, y, { align: "right" });
      docPdf.setFont("helvetica", "normal");
      y += 4;

      docPdf.setFontSize(6.5);
      docPdf.setTextColor(...grisClaro);
      docPdf.text(`$${p.precio.toFixed(2)} c/u`, margin, y);
      docPdf.setFontSize(8);
      y += 5;
    });

    drawDashedLine(docPdf, margin, y, pageWidth - margin, y);
    y += 6;

    // ===== TOTALES =====
    const subtotal = productos.reduce((t, p) => t + p.precio * cantidadCobrada(p), 0);
    const envio = total - subtotal;

    docPdf.setTextColor(...grisClaro);
    docPdf.setFontSize(8);
    docPdf.text("Subtotal", margin, y);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text(`$${subtotal.toFixed(2)}`, pageWidth - margin, y, { align: "right" });
    y += 4.5;

    docPdf.setTextColor(...grisClaro);
    docPdf.text("Envío", margin, y);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text(envio > 0 ? `$${envio.toFixed(2)}` : "Gratis", pageWidth - margin, y, { align: "right" });
    y += 7;

    docPdf.setFillColor(255, 247, 237);
    docPdf.roundedRect(margin, y - 5, pageWidth - margin * 2, 10, 1.5, 1.5, "F");
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(10);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text("TOTAL", margin + 3, y + 1.5);
    docPdf.setTextColor(...naranja);
    docPdf.setFontSize(12);
    docPdf.text(`$${total.toFixed(2)}`, pageWidth - margin - 3, y + 1.5, { align: "right" });
    y += 12;

    drawDashedLine(docPdf, margin, y, pageWidth - margin, y);
    y += 6;

    // ===== DIRECCIÓN DE ENVÍO =====
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(8.5);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text("ENVIAR A", margin, y);
    y += 5;

    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(7.5);
    docPdf.setTextColor(...grisOscuro);
    docPdf.text(form.nombre_receptor, margin, y);
    y += 4;

    docPdf.setTextColor(...grisClaro);
    const direccionLinea1 = `${form.calle} ${form.numero_exterior}${form.numero_interior ? `, Int. ${form.numero_interior}` : ""}`;
    const lineasDireccion = docPdf.splitTextToSize(direccionLinea1, pageWidth - margin * 2);
    docPdf.text(lineasDireccion, margin, y);
    y += lineasDireccion.length * 3.6;

    docPdf.text(`${form.municipio}, ${form.estado}`, margin, y);
    y += 3.6;
    docPdf.text(`CP ${form.codigo_postal}`, margin, y);
    y += 3.6;
    docPdf.text(`Tel: ${form.telefono}`, margin, y);
    y += 4;

    if (form.referencias) {
      const refLineas = docPdf.splitTextToSize(`Ref: ${form.referencias}`, pageWidth - margin * 2);
      docPdf.text(refLineas, margin, y);
      y += refLineas.length * 3.6;
    }

    y += 4;
    drawDashedLine(docPdf, margin, y, pageWidth - margin, y);
    y += 8;

    // ===== PIE DE PÁGINA =====
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(9);
    docPdf.setTextColor(...naranja);
    docPdf.text("¡Gracias por tu compra!", pageWidth / 2, y, { align: "center" });
    y += 5;

    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(6.5);
    docPdf.setTextColor(...grisClaro);
    docPdf.text("OrderSphere", pageWidth / 2, y, { align: "center" });

    docPdf.save(`ticket-${pedidoId}.pdf`);
  };

  const esEfectivo = metodoPago === "efectivo";

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
              {esEfectivo ? "Paso único · Pago en efectivo" : `Paso ${step} de 2`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X />
          </button>
        </div>

        {/* PASOS VISUALES (solo si es tarjeta) */}
        {!esEfectivo && (
          <div className="flex items-center gap-2 py-2">
            <div className={`flex-1 h-2 rounded-full transition-colors ${step >= 1 ? "bg-orange-500" : "bg-gray-200"}`} />
            <div className={`flex-1 h-2 rounded-full transition-colors ${step >= 2 ? "bg-orange-500" : "bg-gray-200"}`} />
          </div>
        )}

        {/* STEP 1: DIRECCIÓN */}
        {step === 1 && (
          <form onSubmit={handleSubmitDireccion} className="space-y-4">

            {esEfectivo && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
                <Banknote className="text-orange-500 shrink-0" size={24} />
                <p className="text-sm text-orange-700">
                  Pagarás <strong>${total.toFixed(2)}</strong> en efectivo al recibir tu pedido.
                </p>
              </div>
            )}

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
                {errors.nombre_receptor && <p className="text-red-500 text-sm mt-1">{errors.nombre_receptor}</p>}
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
                {errors.calle && <p className="text-red-500 text-sm mt-1">{errors.calle}</p>}
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
                {errors.numero_exterior && <p className="text-red-500 text-sm mt-1">{errors.numero_exterior}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                <input
                  name="estado"
                  placeholder="Estado"
                  className={`w-full border ${errors.estado ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.estado}
                  onChange={handleChange}
                />
                {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipio *</label>
                <input
                  name="municipio"
                  placeholder="Municipio"
                  className={`w-full border ${errors.municipio ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.municipio}
                  onChange={handleChange}
                />
                {errors.municipio && <p className="text-red-500 text-sm mt-1">{errors.municipio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                <input
                  name="codigo_postal"
                  placeholder="CP"
                  className={`w-full border ${errors.codigo_postal ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.codigo_postal}
                  onChange={handleChange}
                />
                {errors.codigo_postal && <p className="text-red-500 text-sm mt-1">{errors.codigo_postal}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                <input
                  name="telefono"
                  placeholder="10 dígitos"
                  className={`w-full border ${errors.telefono ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.telefono}
                  onChange={handleChange}
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referencias</label>
                <input
                  name="referencias"
                  placeholder="Puntos de referencia (opcional)"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  value={form.referencias}
                  onChange={handleChange}
                />
              </div>
            </div>

            {esEfectivo && paymentStatus === "procesando" && (
              <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full"></div>
                Confirmando pedido...
              </div>
            )}
            {esEfectivo && paymentStatus === "fallido" && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                ❌ Ocurrió un error al confirmar tu pedido. Intenta de nuevo.
              </div>
            )}
            {esEfectivo && paymentStatus === "exitoso" && (
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                ✅ ¡Pedido confirmado! Redirigiendo...
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-lg font-bold text-orange-500">
                Total: ${total.toFixed(2)}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Procesando..."
                  : esEfectivo
                  ? `Confirmar pedido $${total.toFixed(2)}`
                  : "Continuar con pago"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: PAGO CON TARJETA (solo si NO es efectivo) */}
        {step === 2 && !esEfectivo && (
          <form onSubmit={handlePagoConTarjeta} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumen del pedido</h3>
              <p className="text-sm text-gray-600">
                Envío a: {form.nombre_receptor} - {form.calle} {form.numero_exterior}, {form.municipio}, {form.estado}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {productos.length} productos • Total: <span className="font-bold text-orange-500">${total.toFixed(2)}</span>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta *</label>
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
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta *</label>
                <input
                  name="cardName"
                  placeholder="Como aparece en la tarjeta"
                  className={`w-full border ${errors.cardName ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  value={form.cardName}
                  onChange={handleChange}
                />
                {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha expiración *</label>
                  <input
                    name="cardExpiry"
                    placeholder="MM/AA"
                    className={`w-full border ${errors.cardExpiry ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    value={form.cardExpiry}
                    onChange={handleChange}
                    maxLength={5}
                  />
                  {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                  <input
                    name="cardCvv"
                    type="password"
                    placeholder="***"
                    className={`w-full border ${errors.cardCvv ? "border-red-500" : "border-gray-300"} p-3 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    value={form.cardCvv}
                    onChange={handleChange}
                    maxLength={4}
                  />
                  {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
                </div>
              </div>
            </div>

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
                className={`bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${loading ? "animate-pulse" : ""}`}
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