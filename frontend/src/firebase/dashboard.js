// firebase/dashboard.js

import { db } from "./firebaseConfig";

import {
  collection,
  getDocs
} from "firebase/firestore";

// ==========================
// PRODUCTOS
// ==========================

export const obtenerTotalProductos =
async () => {

  const snapshot =
    await getDocs(
      collection(
        db,
        "productos"
      )
    );

  return snapshot.size;

};

// ==========================
// CLIENTES
// ==========================

export const obtenerTotalClientes =
async () => {

  const snapshot =
    await getDocs(
      collection(
        db,
        "Usuarios"
      )
    );

  const clientes =
    snapshot.docs.filter(
      doc =>
        doc.data().rol ===
        "cliente"
    );

  return clientes.length;

};

// ==========================
// PROMOCIONES
// ==========================

export const obtenerTotalPromociones =
async () => {

  const snapshot =
    await getDocs(
      collection(
        db,
        "promociones"
      )
    );

  return snapshot.size;

};