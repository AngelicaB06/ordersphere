import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export const agregarAlCarrito = async ({
    idCliente,
    idItem,
    tipo,
    cantidad = 1,
    extra = {} // { cantidadPagar, idPromocion, nombrePromo, esPromo }
}) => {
    try {
        // Buscar carrito en proceso del cliente
        const q = query(
            collection(db, "carritos"),
            where("id_cliente", "==", idCliente),
            where("estado", "==", "proceso")
        );
        const resultado = await getDocs(q);
        let carritoRef;
        let carritoData;

        // Si no existe carrito se crea automáticamente
        if (resultado.empty) {
            const nuevoCarrito = await addDoc(
                collection(db, "carritos"),
                {
                    estado: "proceso",
                    id_cliente: idCliente,
                    items: []
                }
            );
            carritoRef = doc(
                db,
                "carritos",
                nuevoCarrito.id
            );
            carritoData = {
                items: []
            };
        } else {
            carritoRef = resultado.docs[0].ref;
            carritoData = resultado.docs[0].data();
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

        if (index !== -1) {
            // Si ya existe solo aumentar cantidad (y cantidadPagar si aplica)
            items[index].cantidad += cantidad;
            if (extra.cantidadPagar) {
                items[index].cantidadPagar =
                    (items[index].cantidadPagar || 0) + extra.cantidadPagar;
            }
        } else {
            // Si no existe agregar nuevo item
            items.push({
                id_item: idItem,
                tipo: tipo,
                cantidad: cantidad,
                ...extra
            });
        }

        await updateDoc(
            carritoRef,
            {
                items: items
            }
        );

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