
import React, { useState } from "react";


export default function MenuHorizontal() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <header className="menu-horizontal">
      <div
        className={`menu-toggle ${menuAbierto ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <nav className={`nav-links ${menuAbierto ? "active" : ""}`}>
        <a href="#" className="activo">Inicio</a>
        <a href="#">Mapa</a>
        <a href="#">Recetas</a>
      </nav>

      <div className="logo-contenedor">
        <img src="../IMAGENES/Logo.png" alt="Logo CeliRadar" className="logo-img" />
        <span className="logo-texto">CeliRadar</span>
      </div>

    </header>
  );
}
