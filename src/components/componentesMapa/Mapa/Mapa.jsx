import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Mapa.module.css";

// FIX íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url),
});

export default function Mapa({ lugares, onSelectLugar }) {
  return (
    <div className={styles.mapaWrapper}>
      <MapContainer
        center={[-36.892, -60.322]}
        zoom={14}
        scrollWheelZoom={true}
        className={styles.mapa}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {lugares.map((l) => (
          <Marker
            key={l.id}
            position={[l.lat, l.lng]}
            eventHandlers={{ click: () => onSelectLugar(l) }}
          >
            <Popup>
              <strong>{l.nombre}</strong>
              <br />
              {l.direccion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
