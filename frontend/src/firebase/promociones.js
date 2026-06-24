import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "./firebaseConfig";

// ==========================
// OBTENER PROMOCIONES
// ==========================

export const obtenerPromociones =
  async () => {

    const snapshot =
      await getDocs(
        collection(
          db,
          "promociones"
        )
      );

    return snapshot.docs.map(
      (documento) => ({
        id: documento.id,
        ...documento.data()
      })
    );

  };

// ==========================
// CREAR PROMOCIÓN
// ==========================

export const crearPromocion =
  async (promocion) => {

    await addDoc(
      collection(
        db,
        "promociones"
      ),
      promocion
    );

  };

// ==========================
// ACTUALIZAR PROMOCIÓN
// ==========================

export const actualizarPromocion =
  async (
    id,
    datos
  ) => {

    await updateDoc(
      doc(
        db,
        "promociones",
        id
      ),
      datos
    );

  };

// ==========================
// ELIMINAR PROMOCIÓN
// ==========================

export const eliminarPromocion =
  async (id) => {

    await deleteDoc(
      doc(
        db,
        "promociones",
        id
      )
    );

  };