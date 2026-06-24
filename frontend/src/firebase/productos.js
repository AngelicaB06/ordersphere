
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// ========================
// CREAR PRODUCTO
// ========================

export const crearProducto = async (producto) => {

  const docRef = await addDoc(
    collection(db, "productos"),
    producto
  );

  return docRef.id;

};

// ========================
// OBTENER PRODUCTOS
// ========================

export const obtenerProductos = async () => {

  const querySnapshot =
    await getDocs(
      collection(db, "productos")
    );

  const productos = [];

  querySnapshot.forEach((docu) => {

    productos.push({
      id: docu.id,
      ...docu.data()
    });

  });

  return productos;

};

// ========================
// ACTUALIZAR PRODUCTO
// ========================

export const actualizarProducto = async (
  id,
  datos
) => {

  const productoRef =
    doc(
      db,
      "productos",
      id
    );

  await updateDoc(
    productoRef,
    datos
  );

};

// ========================
// ELIMINAR PRODUCTO
// ========================

export const eliminarProducto = async (
  id
) => {

  await deleteDoc(
    doc(
      db,
      "productos",
      id
    )
  );

};

