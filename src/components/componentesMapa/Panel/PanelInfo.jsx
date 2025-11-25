import React, { useState } from "react";
import styles from "./PanelInfo.module.css";
import AccionesLugar from "./AccionesLugar";
import AgregarComentario from "./AgregarComentario";
import Comentarios from "./Comentarios";
import Favoritos from "./Favoritos";

export default function PanelInfo({ lugarSeleccionado, onAgregarFavorito }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [comentarios, setComentarios] = useState([]);

  if (!lugarSeleccionado) return <div></div>;

  const agregarComentario = (nuevo) =>
    setComentarios((prev) => [...prev, nuevo]);

  const agregarFavorito = () =>
    onAgregarFavorito && onAgregarFavorito(lugarSeleccionado);

  return (
    <aside className={styles.panel}>
      <h3>{lugarSeleccionado.nombre}</h3>
      <p>{lugarSeleccionado.direccion}</p>

      {/* 🔹 GALERÍA DE IMÁGENES */}
      {lugarSeleccionado.imagenes?.length > 0 && (
        <div className={styles.galeria}>
          {lugarSeleccionado.imagenes.map((img) => (
            <img
              key={img.id}
              src={img.ruta_imagen}
              alt="Foto del lugar"
              className={styles.galeriaImg}
            />
          ))}
        </div>
      )}

      <AccionesLugar
        onFavorito={agregarFavorito}
        onComentar={() => setMostrarFormulario(!mostrarFormulario)}
        labels={{
          favorito: "❤️ Agregar a favoritos",
          comentar: mostrarFormulario ? "❌ Cerrar comentario" : "💬 Comentar",
        }}
      />

      {mostrarFormulario && (
        <AgregarComentario
          lugarId={lugarSeleccionado.id}
          onEnviar={agregarComentario}
        />
      )}

      <Comentarios lugarId={lugarSeleccionado.id} />

      <Favoritos usuarioId={1} />
    </aside>
  );
}
