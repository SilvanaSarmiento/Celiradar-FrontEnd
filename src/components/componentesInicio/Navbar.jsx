import React from "react";
function Navbar({ onLoginClick,onSuscribirClick}){
  return(
      <nav className="navbar">
        <div className="nav-links">
          <a href="/inicio.html">Inicio</a>
          <a href="/mapa.html">Mapa</a>
          <a href="/recetas.html" id="link-recetas">Recetas</a>
        </div>
        <div className="botones-login">
          <button id="btn-login"onClick={onLoginClick}>Iniciar sesión</button>
          <button id="btn-suscribirse"onClick={onSuscribirClick}>Suscribite!</button>
        </div>
      </nav>
  );
}