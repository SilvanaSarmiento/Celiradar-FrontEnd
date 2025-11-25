<<<<<<< HEAD

// CardReceta.jsx
=======
import React, { useState } from "react";
import styles from "./CardRecetas.module.css";
import { recetas } from "../data/recipes.js";
import { FaHeart } from "react-icons/fa";

export default function CardRecetas({ categoria }) {
  const [favoritos, setFavoritos] = useState([]); // Estado visual de favoritos

  // Filtra las recetas según la categoría elegida
  const recetasFiltradas = recetas.filter(
    (receta) => receta.categoria === categoria
  );

  if (!categoria) {
    return (
      <div className={styles.mensaje}>
        <p>Seleccioná una categoría para ver las recetas 🍞</p>
      </div>
    );
  }

  const toggleFavorite = (id) => {
    // Solo cambia visualmente por ahora
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>{categoria}</h2>
      <div className={styles.grid}>
        {recetasFiltradas.map((receta) => {
          const isFavorited = favoritos.includes(receta.id);
          return (
            <div key={receta.id} className={styles.card}>
              <img
                src={receta.imagen}
                alt={receta.nombre}
                className={styles.imagen}
              />
              <h3>{receta.nombre}</h3>
              <p>{receta.descripcion}</p>
              <button
                className={`${styles.favoriteBtn} ${
                  isFavorited ? styles.favorited : ""
                }`}
                onClick={() => toggleFavorite(receta.id)}
              >
                <FaHeart />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
>>>>>>> yamila-dev

