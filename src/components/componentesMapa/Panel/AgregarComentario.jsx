import React, { useState } from "react";
import styles from "./AgregarComentario.module.css";

export default function AgregarComentario({ lugarId, usuarioId = 1, onEnviar }) {
  const [texto, setTexto] = useState("");
  const [calificacion, setCalificacion] = useState(5);

  const handleSubmit = () => {
    fetch(`http://localhost:5000/api/lugares/${lugarId}/comentarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: usuarioId, comentario: texto, calificacion }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Comentario agregado:", data);
        setTexto("");
        onEnviar && onEnviar(data);
      })
      .catch(console.error);
  };

  return (
    <div className={styles.formulario}>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Tu comentario"
      />
      <input
        type="number"
        min="1"
        max="5"
        value={calificacion}
        onChange={(e) => setCalificacion(e.target.value)}
      />
      <button onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
