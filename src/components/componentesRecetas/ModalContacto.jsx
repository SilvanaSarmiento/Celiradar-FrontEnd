import React, { useState } from "react";
import styles from "./ModalContacto.module.css";
import Swal from "sweetalert2";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nombre || !form.email || !form.mensaje) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completá todos los campos",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "¡Mensaje enviado!",
      text: `Gracias ${form.nombre}, te responderemos pronto.`,
    });

    setForm({ nombre: "", email: "", mensaje: "" });
    setOpen(false);
  };

  return (
    <>
      <button className={styles.contactoBtn} onClick={() => setOpen(true)}>
        📩 Contacto
      </button>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()} // evita que se cierre al hacer click dentro
          >
            <button className={styles.closeBtn} onClick={() => setOpen(false)}>
              ✖
            </button>
            <h2>¡Hablemos!</h2>
            <p className={styles.subtitle}>
              Completá el formulario y te responderemos lo antes posible.
            </p>

            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Tu email"
              value={form.email}
              onChange={handleChange}
            />
            <textarea
              name="mensaje"
              placeholder="Escribí tu mensaje..."
              value={form.mensaje}
              onChange={handleChange}
              rows="5"
            />
            <button className={styles.submitBtn} onClick={handleSubmit}>
              Enviar mensaje
            </button>
          </div>
        </div>
      )}
    </>
  );
}
