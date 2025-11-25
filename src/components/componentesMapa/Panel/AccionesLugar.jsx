import React from "react";
import styles from "./AccionesLugar.module.css";

export default function AccionesLugar({ onFavorito, onComentar, labels }) {
  return (
    <div className={styles.acciones}>
      <button onClick={onFavorito}>{labels.favorito}</button>
      <button onClick={onComentar}>{labels.comentar}</button>
    </div>
  );
}
