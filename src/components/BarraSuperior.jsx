import React from "react";
import styles from "./BarraSuperior.module.css";
import { Search } from "lucide-react"; // Ícono de lupa

export default function BarraSuperior({ setFiltro, setBusqueda }) {
  return (
    <div className={styles.barraSuperior}>

      {/* Buscador a la izquierda */}
      <div className={styles.buscadorCont}>
        <Search className={styles.icono} />
        <input
          type="text"
          placeholder="Buscar..."
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros derecha */}
      <div className={styles.filtros}>
        <button onClick={() => setFiltro("todos")}>Todos</button>
        <button onClick={() => setFiltro("restaurante")}>Restaurantes</button>
        <button onClick={() => setFiltro("cafe")}>Cafés</button>
        <button onClick={() => setFiltro("dietetica")}>Dietéticas</button>
        <button onClick={() => setFiltro("mercado")}>Mercados</button>
      </div>

    </div>
  );
}
