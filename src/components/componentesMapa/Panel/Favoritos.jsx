import React, { useEffect, useState } from "react";
import styles from "./Favoritos.module.css";

export default function Favoritos({ usuarioId = 1 }) {
  const [favoritos, setFavoritos] = useState([]);

  const cargarFavoritos = () => {
    fetch(`http://localhost:5000/api/usuarios/${usuarioId}/favoritos`)
      .then((res) => res.json())
      .then((data) => setFavoritos(data))
      .catch(console.error);
  };

  const agregarFavorito = (lugarId) => {
    fetch(`http://localhost:5000/api/usuarios/${usuarioId}/favoritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lugar_id: lugarId }),
    })
      .then(() => cargarFavoritos())
      .catch(console.error);
  };

  useEffect(() => {
    cargarFavoritos();
  }, [usuarioId]);

  return (
    <div className={styles.favoritos}>
      <h3>Favoritos</h3>
      <ul>
        {favoritos.map((f) => (
          <li key={f.id}>{f.nombre}</li>
        ))}
      </ul>
      <button onClick={() => agregarFavorito(1)}>Agregar lugar 1 a favoritos</button>
    </div>
  );
}
