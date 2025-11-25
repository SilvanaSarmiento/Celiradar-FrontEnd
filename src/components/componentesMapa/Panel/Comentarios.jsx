import React, { useEffect, useState } from "react";
import styles from "./Comentarios.module.css";

export default function Comentarios({ lugarId }) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/lugares/${lugarId}/comentarios`)
      .then((res) => res.json())
      .then((data) => setComentarios(data))
      .catch(console.error);
  }, [lugarId]);

  return (
    <div className={styles.comentarios}>
      <h3>Comentarios</h3>
      <ul>
        {comentarios.map((c) => (
          <li key={c.id}>
            <strong>{c.usuario}</strong> ({c.calificacion}/5): {c.comentario}
          </li>
        ))}
      </ul>
    </div>
  );
}
