import React, { useState, useEffect } from "react";
import MenuHorizontal from "../components/MenuHorizontal";
import BarraSuperior from "../components/BarraSuperior";
import Mapa from "../components/componentesMapa/Mapa/Mapa";
import PanelInfo from "../components/componentesMapa/Panel/PanelInfo";
import Footer from "../components/Footer";
import "../styles/mapa.css";

export default function MapaPage() {
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [lugares, setLugares] = useState([]);

  // Cargar lugares desde backend
useEffect(() => {
  fetch("http://localhost:3001/lugares")
    .then(res => res.json())
    .then(data => {
      console.log("LUGARES DESDE BACKEND:", data);
      setLugares(data);
    })
    .catch(console.error);
}, []);

  // Aplicar filtros + búsqueda
  const lugaresFiltrados = lugares.filter((l) => {
    const coincideFiltro = filtro === "todos" || l.tipo === filtro;
    const coincideBusqueda =
      l.nombre.toLowerCase().includes(busqueda.toLowerCase());

    return coincideFiltro && coincideBusqueda;
  });

  return (
    <div className="mapa-contenedor">

      <MenuHorizontal />

      {/* 🔹 Barra superior pegada al menú */}
      <BarraSuperior 
        setFiltro={setFiltro}
        setBusqueda={setBusqueda}
      />

      <div className="contenido-principal">
        <Mapa lugares={lugaresFiltrados} onSelectLugar={(l) => setLugarSeleccionado(l)} />

        <PanelInfo
          lugarSeleccionado={lugarSeleccionado}
          onAgregarFavorito={() => console.log("Favorito!")}
        />
      </div>

      <Footer />
    </div>
  );
}
