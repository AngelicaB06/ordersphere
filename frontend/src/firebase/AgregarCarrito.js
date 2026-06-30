import { agregarAlCarrito } from "../../firebase/AgregarCarrito";

// ====================================================================
// PROPS NUEVAS para promociones:
// - idItem: AHORA debe ser el id del PRODUCTO real vinculado a la promo
//   (promo.id_producto), no el id de la promoción.
// - cantidadPagar: cuántas unidades se cobran realmente (ej. 3x2 -> 2)
// - idPromocion: id de la promoción (promo.id), para referencia/trazabilidad
// - nombrePromo: título de la promoción, para mostrarlo en el carrito
// Para productos normales (tipo === "producto") estas props nuevas se
// pueden omitir, no afectan el comportamiento existente.
// ====================================================================
const AgregarCarrito = ({
  tipo,
  idItem,
  cantidad = 1,
  idCliente,
  cantidadPagar,
  idPromocion,
  nombrePromo
}) => {
  const handleAgregar = async () => {
    if (!idItem) {
      alert("Esta promoción no tiene un producto vinculado todavía.");
      return;
    }

    const esPromo = tipo === "promocion";

    const respuesta = await agregarAlCarrito({
      idCliente,
      idItem,
      tipo,
      cantidad,
      extra: esPromo
        ? {
            esPromo: true,
            cantidadPagar: cantidadPagar ?? cantidad,
            idPromocion: idPromocion || null,
            nombrePromo: nombrePromo || null
          }
        : {}
    });
    if (respuesta.success) {
      alert(
        `${cantidad} ${
          tipo === "producto"
            ? "producto(s)"
            : "promoción(es)"
        } agregado(s) al carrito 🛒`
      );
    } else {
      alert("Error al agregar al carrito");
    }
  };
  const estilosBoton = {
    width: "100%",
    padding: "14px 20px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#fff",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    background:
      tipo === "producto"
        ? "linear-gradient(135deg, #ff6b35, #ff8c42)"
        : "linear-gradient(135deg, #6c63ff, #867dff)"
  };
  const estilosIcono = {
    fontSize: "18px"
  };
  return (
    <button
      style={estilosBoton}
      onClick={handleAgregar}
      onMouseOver={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow =
          "0 8px 20px rgba(0,0,0,0.25)";
      }}
      onMouseOut={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseDown={(e) => {
        e.target.style.transform = "scale(0.97)";
      }}
      onMouseUp={(e) => {
        e.target.style.transform = "translateY(-2px)";
      }}
    >
      <span style={estilosIcono}>🛒</span>
      {
        tipo === "producto"
          ? "Agregar Producto"
          : "Agregar Promoción"
      }
    </button>
  );
};
export default AgregarCarrito;