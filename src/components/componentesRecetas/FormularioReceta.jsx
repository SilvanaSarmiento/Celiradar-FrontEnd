import React, { useState } from "react";
<<<<<<< HEAD
import styles from "./FormularioReceta.module.css";
import PropTypes from "prop-types";

const CATEGORIAS_POR_DEFECTO = [
  "Panes",
  "Pastas",
  "Tortas y dulces",
  "Masas",
];

export default function FormularioReceta({ onRecetaAgregada }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categoriaOtra, setCategoriaOtra] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [pasos, setPasos] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const BACKEND_BASES = ["http://localhost:3000", "http://127.0.0.1:3000"];
  const endpoints = ["/recetas", "/api/recetas", "/recipes"];

  function categoriaSeleccionada() {
    return categoria === "Otra" ? categoriaOtra.trim() : (categoria || "").trim();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    // validaciones simples
    const tituloTrim = titulo.trim();
    const ingTrim = ingredientes.trim();
    const pasosTrim = pasos.trim();
    const cat = categoriaSeleccionada();

    if (!tituloTrim) {
      setError("El título es obligatorio.");
      return;
    }
    if (!cat) {
      setError("Elegí o escribí una categoría.");
      return;
    }
    if (!ingTrim) {
      setError("Indicá al menos un ingrediente.");
      return;
    }
    if (!pasosTrim) {
      setError("Indicá los pasos de preparación.");
      return;
    }

    setLoading(true);

    const payload = {
      titulo: tituloTrim,
      categoria: cat,
      ingredientes: ingTrim,
      pasos: pasosTrim,
    };

    let created = null;
    for (const base of BACKEND_BASES) {
      for (const ep of endpoints) {
        try {
          const url = base.replace(/\/$/, "") + ep;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          const data = await res.json();
          created = data;
          break;
        } catch (err) {
          // intento siguiente endpoint
        }
      }
      if (created) break;
    }

    if (created) {
      setMsg("Receta enviada correctamente.");
      setTitulo("");
      setCategoria("");
      setCategoriaOtra("");
      setIngredientes("");
      setPasos("");
      if (onRecetaAgregada) onRecetaAgregada(created);
    } else {
      setError("No se pudo enviar la receta. Revisá que el backend esté corriendo y acepte CORS.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.recipeForm} noValidate>
      <h2 className={styles.heading}>Agregar receta</h2>

      {error && <div className={styles.error}>{error}</div>}
      {msg && <div className={styles.msg}>{msg}</div>}

      <label className={styles.field}>
        <span className={styles.labelText}>Título *</span>
        <input
          className={styles.input}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          placeholder="Ej: Pan casero sin gluten"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.labelText}>Categoría *</span>
        <select
          className={styles.select}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">-- Seleccionar categoría --</option>
          {CATEGORIAS_POR_DEFECTO.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {categoria === "Otra" && (
        <label className={styles.field}>
          <span className={styles.labelText}>Especificá la categoría</span>
          <input
            className={styles.input}
            value={categoriaOtra}
            onChange={(e) => setCategoriaOtra(e.target.value)}
            placeholder="Ej: Galletitas saladas"
          />
        </label>
      )}

      <label className={styles.field}>
        <span className={styles.labelText}>Ingredientes *</span>
        <textarea
          className={styles.textarea}
          value={ingredientes}
          onChange={(e) => setIngredientes(e.target.value)}
          placeholder="Listá los ingredientes (uno por línea o separados por comas)"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.labelText}>Pasos / Preparación *</span>
        <textarea
          className={styles.textarea}
          value={pasos}
          onChange={(e) => setPasos(e.target.value)}
          placeholder="Describí los pasos"
        />
      </label>

      <div className={styles.actions}>
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Agregar receta"}
        </button>
      </div>
=======
import Swal from "sweetalert2";
import styles from "./FormularioReceta.module.css";

export default function RecipeForm({ setRecetas }) {
  const [form, setForm] = useState({
    nombre: "",
    categoria: "panes",
    ingredientes: "",
    pasos: "",
    autor: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación
    if (!form.nombre.trim() || !form.ingredientes.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor completá el nombre y los ingredientes de la receta.",
      });
      return;
    }

    // Guardamos la receta
    setRecetas((prev) => [...prev, form]);

    // Mensaje de éxito
    Swal.fire({
      icon: "success",
      title: "¡Receta guardada!",
      text: `La receta "${form.nombre}" se ha agregado correctamente.`,
      timer: 2000,
      showConfirmButton: false,
    });

    // Limpiar formulario
    setForm({
      nombre: "",
      categoria: "panes",
      ingredientes: "",
      pasos: "",
      autor: "",
    });
  };

  return (
    <form className={styles.recipeForm} onSubmit={handleSubmit}>
      <h2>Agregar nueva receta</h2>

      <input
        type="text"
        name="nombre"
        placeholder="Nombre de la receta"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <select name="categoria" value={form.categoria} onChange={handleChange}>
        <option value="panes">Panes</option>
        <option value="pastas">Pastas</option>
        <option value="tortas">Tortas</option>
        <option value="masas">Masas</option>
      </select>

      <textarea
        name="ingredientes"
        placeholder="Ingredientes"
        value={form.ingredientes}
        onChange={handleChange}
        required
      />

      <textarea
        name="pasos"
        placeholder="Pasos"
        value={form.pasos}
        onChange={handleChange}
      />

      <input
        type="text"
        name="autor"
        placeholder="Tu nombre"
        value={form.autor}
        onChange={handleChange}
      />

      <button type="submit">Guardar receta</button>
>>>>>>> yamila-dev
    </form>
  );
}

<<<<<<< HEAD
FormularioReceta.propTypes = {
  onRecetaAgregada: PropTypes.func,
};
=======
>>>>>>> yamila-dev
