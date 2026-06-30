import {
    doc,
    runTransaction
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ====================================================================
// NOTA IMPORTANTE SOBRE EL FIX
// ====================================================================
// El bug original: si se llamaba agregarAlCarrito() dos veces casi al
// mismo tiempo (doble clic, dos productos seguidos muy rápido, etc.),
// ambas llamadas hacían getDocs(query) ANTES de que la primera terminara
// de crear el carrito. Las dos veían "no existe carrito" y cada una
// creaba su propio documento en "carritos" con estado "proceso".
// Resultado: dos carritos en proceso para el mismo cliente, y
// Carrito.jsx solo lee el primero que encuentra el query, así que el
// producto del "segundo" carrito nunca aparecía en pantalla aunque sí
// se había guardado en Firestore.
//
// La solución: en vez de buscar el carrito "en proceso" con un query
// (que no se puede usar dentro de una transacción de Firestore), se usa
// un ID de documento DETERMINÍSTICO basado en el id del cliente
// (`carrito_${idCliente}`). Así, todas las llamadas concurrentes apuntan
// SIEMPRE al mismo documento, y runTransaction garantiza que la lectura
// + escritura sea atómica: no puede haber dos transacciones creando el
// carrito al mismo tiempo, Firestore reintenta automáticamente si detecta
// conflicto.
//
// Esto es compatible con Carrito.jsx tal cual está, porque ese componente
// sigue buscando por id_cliente + estado "proceso" con un query normal
// (fuera de una transacción eso sí funciona), y ese campo se sigue
// guardando igual. El ID del documento es lo único que cambia.
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

    // ID determinístico: siempre el mismo documento para el carrito
    // "en proceso" de este cliente, sin importar cuántas llamadas
    // concurrentes se disparen.
    const carritoRef = doc(db, "carritos", `carrito_${idCliente}`);

    try {
        await runTransaction(db, async (transaction) => {
            const carritoSnap = await transaction.get(carritoRef);

            let carritoData;

            if (!carritoSnap.exists() || carritoSnap.data().estado !== "proceso") {
                // No existe el carrito, o existe pero ya no está "en proceso"
                // (por ejemplo quedó en "vacio" o "pendiente" de un pedido
                // anterior) -> se reinicia/crea limpio.
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