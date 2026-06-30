import {
    doc,
    runTransaction
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ====================================================================
// SERVICIO: agregarAlCarrito
// Este archivo NO debe contener JSX ni componentes de React.
// El botón que llama a esta función vive en:
//   src/components/client/BotonAgregarCarrito.jsx
// ====================================================================
//
// Usa un ID de documento DETERMINÍSTICO basado en el id del cliente
// (`carrito_${idCliente}`) en vez de buscar el carrito con un query.
// Esto evita que dos llamadas concurrentes (doble clic, dos productos
// agregados muy rápido) creen dos carritos "en proceso" para el mismo
// cliente. runTransaction garantiza que la lectura + escritura sea
// atómica: Firestore reintenta automáticamente si detecta conflicto.
// ====================================================================

export const agregarAlCarrito = async ({
    idCliente,
    idItem,
    tipo,
    cantidad = 1,
    extra = {} // { cantidadPagar, idPromocion, nombrePromo, esPromo }
}) => {
    if (!idCliente) {
        return { success: false, message: "Falta idCliente" };
    }
    if (!idItem) {
        return { success: false, message: "Falta idItem" };
    }

    const carritoRef = doc(db, "carritos", `carrito_${idCliente}`);

    try {
        await runTransaction(db, async (transaction) => {
            const carritoSnap = await transaction.get(carritoRef);

            let carritoData;

            if (!carritoSnap.exists() || carritoSnap.data().estado !== "proceso") {
                // No existe el carrito, o existe pero ya no está "en proceso"
                // (quedó en "vacio" o "pendiente" de un pedido anterior)
                // -> se reinicia/crea limpio.
                carritoData = {
                    estado: "proceso",
                    id_cliente: idCliente,
                    items: []
                };
            } else {
                carritoData = carritoSnap.data();
            }

            const items = carritoData.items || [];

            // Buscar si el item ya existe.
            // Para promociones, también se compara idPromocion, para que un
            // producto suelto y el mismo producto dentro de una promo
            // no se mezclen en la misma fila del carrito.
            const index = items.findIndex(
                item =>
                    item.id_item === idItem &&
                    item.tipo === tipo &&
                    (item.idPromocion || null) === (extra.idPromocion || null)
            );

            let nuevoItems;

            if (index !== -1) {
                // Si ya existe solo aumentar cantidad (y cantidadPagar si aplica)
                nuevoItems = items.map((item, i) => {
                    if (i !== index) return item;
                    return {
                        ...item,
                        cantidad: item.cantidad + cantidad,
                        ...(extra.cantidadPagar
                            ? { cantidadPagar: (item.cantidadPagar || 0) + extra.cantidadPagar }
                            : {})
                    };
                });
            } else {
                // Si no existe agregar nuevo item
                nuevoItems = [
                    ...items,
                    {
                        id_item: idItem,
                        tipo: tipo,
                        cantidad: cantidad,
                        ...extra
                    }
                ];
            }

            transaction.set(carritoRef, {
                ...carritoData,
                estado: "proceso",
                id_cliente: idCliente,
                items: nuevoItems
            });
        });

        return {
            success: true,
            message: "Producto agregado al carrito"
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        };
    }
};