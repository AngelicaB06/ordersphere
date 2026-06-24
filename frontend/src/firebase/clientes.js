// firebase/clientes.js
import {
  collection,
  getDocs,
  doc,
  updateDoc // 👈 IMPORTANTE: añade esta importación
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// ==========================
// OBTENER CLIENTES
// ==========================
export const obtenerClientes = async () => {
  const querySnapshot = await getDocs(collection(db, "Usuarios"));
  const clientes = [];
  querySnapshot.forEach((doc) => {
    clientes.push({
      id: doc.id,
      ...doc.data()
    });
  });
  return clientes;
};

// ==========================
// ACTUALIZAR CLIENTE (NUEVO)
// ==========================
export const actualizarCliente = async (id, datos) => {
  const ref = doc(db, "Usuarios", id); // Usa "Usuarios" con mayúscula
  await updateDoc(ref, datos);
};