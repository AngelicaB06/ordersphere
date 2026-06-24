import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// ====================================
// OBTENER
// ====================================

export const obtenerCategorias = async () => {

  const snapshot = await getDocs(
    collection(
      db,
      "Categorías"
    )
  );

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));

};

// ====================================
// CREAR
// ====================================

export const crearCategoria = async (
  categoria
) => {

  await addDoc(
    collection(
      db,
      "Categorías"
    ),
    categoria
  );

};

// ====================================
// ACTUALIZAR
// ====================================

export const actualizarCategoria = async (
  id,
  datos
) => {

  await updateDoc(
    doc(
      db,
      "Categorías",
      id
    ),
    datos
  );

};

// ====================================
// ELIMINAR
// ====================================

export const eliminarCategoria = async (
  id
) => {

  await deleteDoc(
    doc(
      db,
      "Categorías",
      id
    )
  );

};