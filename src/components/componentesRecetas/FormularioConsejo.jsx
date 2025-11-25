import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "./FormularioConsejo.module.css";

export default function ConsejoForm({ setConsejos }) {
  const [texto, setTexto] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación
    if (!texto.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El consejo no puede estar vacío",
      });
      return;
    }

    // Agregar consejo
    setConsejos((prev) => [...prev, { texto }]);

    // Mostrar mensaje de éxito
    Swal.fire({
      icon: "success",
      title: "¡Consejo publicado!",
      text: "Gracias por compartir tu consejo.",
      timer: 2000,
      showConfirmButton: false,
    });

    // Limpiar textarea
    setTexto("");
  };

  return (
    <form className={styles.consejoForm} onSubmit={handleSubmit}>
      <textarea
        placeholder="Escribí un consejo que quieras compartir..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <button type="submit">Publicar consejo</button>
    </form>
  );
}

