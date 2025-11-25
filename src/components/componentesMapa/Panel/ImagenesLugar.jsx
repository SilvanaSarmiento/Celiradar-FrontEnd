import React, { useEffect, useState } from 'react';

export default function ImagenesLugar({ lugarId }) {
  const [imagenes, setImagenes] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/lugares/${lugarId}/imagenes`)
      .then(res => res.json())
      .then(data => setImagenes(data))
      .catch(err => console.error(err));
  }, [lugarId]);

  return (
    <div>
      {imagenes.map((img, index) => (
        <img key={index} src={img.imagen} alt="Lugar" width="150" style={{ margin: '5px' }} />
      ))}
    </div>
  );
}
