<<<<<<< HEAD
// ListaReceta.jsx
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./ListaReceta.module.css";

const RECETAS_PATHS = ["/recetas", "/api/recetas", "/recipes"];

function safeId(obj = {}) {
  return (
    obj?.id_receta ??
    obj?.id ??
    obj?._id ??
    (obj?.receta && (obj.receta.id_receta ?? obj.receta.id ?? obj.receta._id)) ??
    null
  );
}
function normalizeOne(r = {}) {
  const rec = r.receta ?? r;
  return {
    id: String(safeId(rec) ?? Math.random().toString(36).slice(2)),
    titulo: rec.titulo ?? rec.title ?? rec.nombre ?? "Receta sin título",
    categoria: (rec.categoria ?? rec.category ?? "")?.toString() ?? "",
    ingredientes: rec.ingredientes ?? rec.ingredients ?? rec.ingredientesText ?? "",
    pasos: rec.pasos ?? rec.steps ?? rec.instrucciones ?? "",
    raw: rec,
  };
}
function normalizeArray(arr = []) {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeOne);
}

export default function ListaReceta({
  recetas: recetasProp = null,
  usuarioId = null,
  apiBase = "http://localhost:3000",
}) {
  const [recetasInternas, setRecetasInternas] = useState(() => normalizeArray(recetasProp ?? []));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [favoritos, setFavoritos] = useState([]);
  const [busyIds, setBusyIds] = useState({});

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const usingProp = Array.isArray(recetasProp);

  useEffect(() => {
    if (usingProp) {
      setRecetasInternas(normalizeArray(recetasProp));
    }
  }, [recetasProp, usingProp]);

  useEffect(() => {
    if (usingProp) return;
    let controller = new AbortController();
    let did = false;
    (async () => {
      setLoading(true);
      setError(null);
      const base = apiBase.replace(/\/$/, "");
      const tries = RECETAS_PATHS.map((p) => `${base}${p}`);
      for (const url of tries) {
        try {
          const res = await fetch(url, { signal: controller.signal });
          if (!res || !res.ok) continue;
          const data = await res.json();
          const arr = Array.isArray(data)
            ? data
            : Array.isArray(data.recetas)
            ? data.recetas
            : Array.isArray(data.data)
            ? data.data
            : [];
          if (!mountedRef.current) return;
          setRecetasInternas(normalizeArray(arr));
          did = true;
          break;
        } catch (err) {
          if (err.name === "AbortError") return;
          continue;
        }
      }
      if (!did && mountedRef.current) {
        setRecetasInternas([]);
        setError("No se pudieron cargar recetas desde la API.");
      }
      if (mountedRef.current) setLoading(false);
    })();
    return () => controller.abort();
  }, [apiBase, usingProp]);

  useEffect(() => {
    if (!usuarioId) {
      setFavoritos([]);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${apiBase.replace(/\/$/, "")}/favoritos/${usuarioId}`, { signal: controller.signal });
        if (!res.ok) {
          setFavoritos([]);
          return;
        }
        const data = await res.json();
        const ids = Array.isArray(data)
          ? data
              .map((x) => {
                if (typeof x === "string" || typeof x === "number") return String(x);
                if (x.receta) return String(safeId(x.receta));
                return String(x.recetaId ?? x.id_receta ?? x.id ?? x._id ?? "");
              })
              .filter(Boolean)
          : [];
        if (mountedRef.current) setFavoritos(ids);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error cargando favoritos:", err);
        if (mountedRef.current) setFavoritos([]);
      }
    })();
    return () => controller.abort();
  }, [usuarioId, apiBase]);

  const isFavorited = (id) => favoritos.includes(String(id));

  async function toggleFavorite(recetaId) {
    if (!recetaId) return;
    if (!usuarioId) {
      alert("Iniciá sesión para marcar favoritos.");
      return;
    }
    const id = String(recetaId);
    if (busyIds[id]) return;
    const already = isFavorited(id);
    setFavoritos((prev) => (already ? prev.filter((x) => x !== id) : [...prev, id]));
    setBusyIds((b) => ({ ...b, [id]: true }));
    try {
      if (already) {
        const res = await fetch(`${apiBase.replace(/\/$/, "")}/favoritos/${usuarioId}/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("DELETE favorito falló");
      } else {
        const res = await fetch(`${apiBase.replace(/\/$/, "")}/favoritos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuarioId, recetaId: id }),
        });
        if (!res.ok) throw new Error("POST favorito falló");
      }
    } catch (err) {
      console.error("No se pudo actualizar favorito:", err);
      setFavoritos((prev) => (already ? [...prev, id] : prev.filter((x) => x !== id)));
      alert("No se pudo actualizar favorito en el servidor.");
    } finally {
      setBusyIds((b) => {
        const copy = { ...b };
        delete copy[id];
        return copy;
      });
    }
  }

  const valid = Array.isArray(recetasInternas)
    ? recetasInternas.filter(
        (r) =>
          r &&
          ((typeof r.titulo === "string" && r.titulo.trim() !== "") ||
            (r.ingredientes && (Array.isArray(r.ingredientes) ? r.ingredientes.length > 0 : String(r.ingredientes).trim() !== "")) ||
            (r.pasos && (Array.isArray(r.pasos) ? r.pasos.length > 0 : String(r.pasos).trim() !== "")))
      )
    : [];

  if (loading) return <div className={styles.mensaje}>Cargando recetas...</div>;
  if (error) return <div className={styles.mensajeError}>{error}</div>;
  if (!valid.length) return <div className={styles.mensaje}>No hay recetas para mostrar.</div>;

  return (
    <div className={styles.recipeList}>
      {valid.map((r, i) => {
        const id = r.id ?? `no-id-${i}`;
        return (
          <article key={id} className={styles.recipeCard} aria-labelledby={`titulo-${id}`}>
            <div className={styles.cardBody}>
              <div className={styles.cardMain}>
                <h3 id={`titulo-${id}`} className={styles.title}>
                  {r.titulo}
                </h3>
                {r.categoria ? <p className={styles.category}>{r.categoria}</p> : null}

                {Array.isArray(r.ingredientes) ? (
                  <div className={styles.section}>
                    <strong>Ingredientes:</strong>
                    <ul className={styles.list}>{r.ingredientes.map((ing, idx) => <li key={idx}>{String(ing)}</li>)}</ul>
                  </div>
                ) : r.ingredientes ? (
                  <div className={styles.section}>
                    <strong>Ingredientes:</strong>
                    <p className={styles.pre}>{String(r.ingredientes)}</p>
                  </div>
                ) : null}

                {Array.isArray(r.pasos) ? (
                  <div className={styles.section}>
                    <strong>Pasos:</strong>
                    <ol className={styles.list}>{r.pasos.map((p, idx) => <li key={idx}>{String(p)}</li>)}</ol>
                  </div>
                ) : r.pasos ? (
                  <div className={styles.section}>
                    <strong>Pasos:</strong>
                    <p className={styles.pre}>{String(r.pasos)}</p>
                  </div>
                ) : null}
              </div>

              <div className={styles.cardActions}>
                <button
                  className={`${styles.favButton} ${isFavorited(id) ? styles.favOn : ""}`}
                  onClick={() => toggleFavorite(id)}
                  disabled={Boolean(busyIds[id])}
                  aria-pressed={isFavorited(id)}
                  title={isFavorited(id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <span aria-hidden>{isFavorited(id) ? "❤️" : "🤍"}</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

ListaReceta.propTypes = {
  recetas: PropTypes.array,
  usuarioId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  apiBase: PropTypes.string,
};

=======
import React from "react";
import styles from "./ListaReceta.module.css";

export default function RecipeList({ recetas }) {
  if (recetas.length === 0) {
    return <p className={styles.mensaje}>No hay recetas en esta categoría.</p>;
  }

  return (
    <div className={styles.recipeList}>
      {recetas.map((r, i) => (
        <div key={i} className={styles.recipeCard}>
          <h3>{r.nombre}</h3>
          <p>
            <strong>Categoría:</strong> {r.categoria}
          </p>
          <p>
            <strong>Ingredientes:</strong> {r.ingredientes}
          </p>
          <p>
            <strong>Pasos:</strong> {r.pasos}
          </p>
          <p className={styles.autor}>👩‍🍳 Subido por: {r.autor || "Anónimo"}</p>
        </div>
      ))}
    </div>
  );
}
>>>>>>> yamila-dev
