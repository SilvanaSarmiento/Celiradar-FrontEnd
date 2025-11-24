import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./CarruselCategorias.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_AUTOPLAY_MS = 4000;
const CATS_ENDPOINTS = ["/categorias", "/api/categorias", "/categories", "/api/categories"];

const IMAGE_MAP = {
  "Panes": "/assets/Panes.jpg",
  "Pastas": "/assets/PASTAS.jpg",
  "Tortasydulces": "/assets/dulces.jpg",
  "Masas": "/assets/Masas.jpg",
};

function pickImageFor(name) {
  if (!name) return "/assets/default-cat.jpg";
  if (IMAGE_MAP[name]) return IMAGE_MAP[name];
  const key = Object.keys(IMAGE_MAP).find((k) => k.toLowerCase() === name.toString().toLowerCase());
  return key ? IMAGE_MAP[key] : `/assets/${String(name).replace(/\s+/g, "")}.jpg`;
}

export default function CarruselCategorias({
  categorias: categoriasProp = null,
  categoriaSeleccionada = null,
  onSelect = null,
  setCategoria = null,
  apiBase = "http://localhost:3000",
  autoplayMs = DEFAULT_AUTOPLAY_MS,
}) {
  const [categorias, setCategorias] = useState(Array.isArray(categoriasProp) ? categoriasProp : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const fetchedRef = useRef(false);
  const autoplayRef = useRef(null);

  function normalizeList(list) {
    return (list || []).map((c) => {
      if (!c) return null;
      if (typeof c === "string") return { nombre: c, imagen: pickImageFor(c) };
      if (typeof c === "object") {
        const nombre = c.nombre ?? c.name ?? c;
        const imagen = c.imagen ?? c.image ?? pickImageFor(nombre);
        return { nombre: String(nombre), imagen };
      }
      return null;
    }).filter(Boolean);
  }

  // filtro para remover "Todas" y "Sin categoría" y entradas vacías
  function filterValid(list) {
    return (list || []).filter((c) => {
      const n = (c?.nombre ?? "").toString().trim().toLowerCase();
      if (!n) return false;
      if (n === "todas" || n === "todas las categorias" || n === "sin categoria" || n === "sin categoría") return false;
      return true;
    });
  }

  useEffect(() => {
    if (Array.isArray(categoriasProp)) {
      setCategorias(filterValid(normalizeList(categoriasProp)));
      return;
    }
    let mounted = true;
    const controller = new AbortController();
    async function loadCats() {
      if (fetchedRef.current) return;
      setLoading(true);
      setError(null);
      try {
        const base = apiBase.replace(/\/$/, "");
        let resp = null;
        for (const p of CATS_ENDPOINTS) {
          try {
            const r = await fetch(`${base}${p}`, { signal: controller.signal });
            if (!r || !r.ok) continue;
            const data = await r.json();
            resp = data;
            break;
          } catch (err) {
            if (err.name === "AbortError") throw err;
            continue;
          }
        }
        if (!mounted) return;
        if (!resp) {
          setCategorias([]);
        } else {
          let list = [];
          if (Array.isArray(resp)) list = resp;
          else if (Array.isArray(resp.categorias)) list = resp.categorias;
          else if (Array.isArray(resp.data)) list = resp.data;
          const cleaned = list.map((c) => (typeof c === "object" ? (c.nombre ?? c.name ?? c) : c)).filter(Boolean);
          setCategorias(filterValid(normalizeList(cleaned)));
        }
        fetchedRef.current = true;
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error cargando categorías:", err);
        setError("No se pudieron cargar categorías");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCats();
    return () => {
      mounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriasProp, apiBase]);

  useEffect(() => {
    if (paused) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = null;
      return;
    }
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setIndex((prev) => {
        if (!categorias || categorias.length <= 1) return 0;
        return (prev + 1) % categorias.length;
      });
    }, autoplayMs);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    };
  }, [paused, categorias, autoplayMs]);

  const prev = () => {
    setIndex((i) => {
      if (!categorias || categorias.length === 0) return 0;
      return (i - 1 + categorias.length) % categorias.length;
    });
  };
  const next = () => {
    setIndex((i) => {
      if (!categorias || categorias.length === 0) return 0;
      return (i + 1) % categorias.length;
    });
  };

  const handleClick = (cat) => {
    if (typeof onSelect === "function") return onSelect(cat);
    if (typeof setCategoria === "function") return setCategoria(cat);
    console.warn("Carrusel: no hay onSelect ni setCategoria pasados");
  };

  const visibleCount = categorias.length >= 2 ? 2 : 1;
  const visible = [];
  for (let i = 0; i < visibleCount; i++) {
    const idx = (index + i) % Math.max(1, categorias.length);
    visible.push(categorias[idx]);
  }

  const isSelected = (catName) => {
    if (!categoriaSeleccionada) return false;
    return categoriaSeleccionada.toString().trim().toLowerCase() === (catName || "").toString().trim().toLowerCase();
  };

  if (loading) return <p className={styles.loading}>Cargando categorías...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!Array.isArray(categorias) || categorias.length === 0) return <p className={styles.empty}>Sin categorías</p>;

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Anterior">
        <ChevronLeft size={28} />
      </button>

      <div className={styles.carouselInner}>
        {visible.map((cat, i) => {
          const nombre = cat?.nombre ?? String(cat);
          const imagen = cat?.imagen ?? pickImageFor(nombre);
          const key = `${nombre}-${i}`;
          return (
            <div className={styles.cardWrapper} key={key}>
              <button
                className={`${styles.card} ${isSelected(nombre) ? styles.selectedCard : ""}`}
                onClick={() => handleClick(nombre)}
                title={nombre}
                aria-pressed={isSelected(nombre)}
              >
                <div className={styles.cardImageWrap}>
                  <img
                    src={imagen}
                    alt={nombre}
                    className={styles.image}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
                <div className={styles.cardLabel}>{nombre}</div>
              </button>
            </div>
          );
        })}
      </div>

      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Siguiente">
        <ChevronRight size={28} />
      </button>
    </div>
  );
}

CarruselCategorias.propTypes = {
  categorias: PropTypes.array,
  categoriaSeleccionada: PropTypes.string,
  onSelect: PropTypes.func,
  setCategoria: PropTypes.func,
  apiBase: PropTypes.string,
  autoplayMs: PropTypes.number,
};




