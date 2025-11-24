import React, { useEffect, useState, useCallback } from "react";

import MenuHorizontal from "../components/MenuHorizontal";
import CarruselCategorias from "../components/componentesRecetas/CarruselCategorias";
import ListaReceta from "../components/componentesRecetas/ListaReceta";
import FormularioReceta from "../components/componentesRecetas/FormularioReceta";
import FormularioConsejo from "../components/componentesRecetas/FormularioConsejo";
import ListaConsejos from "../components/componentesRecetas/ListaConsejos";
import ModalContacto from "../components/Fotter"; 
import Fotter from "../components/Fotter";


const BACKEND_BASES = ["http://localhost:3000", "http://127.0.0.1:3000"];
const ENDPOINT_PATHS = ["/recetas", "/api/recetas", "/recipes"];


function normalize(arr = []) {
  return arr.map((r) => {
    const cat = (r.categoria || r.category || r.categoriaNombre || "").toString();
    const title = r.titulo || r.title || r.nombre || r.name || "";
    return { ...r, titulo: title, categoria: cat };
  });
}

/**
 * fetchFromBackend intenta varias combinaciones de base + endpoint.
 * Acepta un AbortSignal opcional para cancelar la petición.
 */
async function fetchFromBackend({ categoria = null, signal = null } = {}) {
  const tries = [];
  for (const base of BACKEND_BASES) {
    for (const ep of ENDPOINT_PATHS) {
      if (!categoria) {
        tries.push(`${base}${ep}`);
      } else {
        const q = encodeURIComponent(categoria);
        tries.push(`${base}${ep}?categoria=${q}`);
        tries.push(`${base}${ep}?category=${q}`);
        tries.push(`${base}${ep}/categoria/${q}`);
        tries.push(`${base}${ep}/category/${q}`);
      }
    }
  }

  for (const url of tries) {
    try {
      const res = await fetch(url, { signal });
      if (!res || !res.ok) continue;
      const data = await res.json();
      const arr = Array.isArray(data) ? data : (data && data.recetas) ? data.recetas : [];
      if (Array.isArray(arr)) return arr;
    } catch (err) {
      if (err && err.name === "AbortError") throw err;
      // continuar con el siguiente url si falla
    }
  }

  throw new Error("No se pudo conectar con el backend (probadas varias URLs).");
}

export default function RecetasPage({ usuarioId = null }) {
  const [recetas, setRecetas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // loadAll soporta signal para abortar fetches en transiciones/cleanup
  const loadAll = useCallback(
    async (signal = null) => {
      setLoading(true);
      setError(null);
      try {
        const arr = await fetchFromBackend({ categoria: null, signal });
        const normalized = normalize(arr);
        setRecetas(normalized);
        const cats = Array.from(new Set(normalized.map((r) => (r.categoria || "Sin categoría")))).filter(Boolean);
        setCategorias(cats);
      } catch (err) {
        if (err && err.name === "AbortError") {
          console.debug("loadAll abortada");
          return;
        }
        setError("Error al cargar recetas. Revisá el backend.");
        setRecetas([]);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    },
    [] // normalize está fuera; no es dependencia
  );

  // Wrapper sin signal para pasar a componentes hijos (FormularioReceta)
  const reloadAll = useCallback(() => {
    // llamado sin signal; loadAll maneja su propio estado
    loadAll().catch((e) => {
      // ya manejado internamente, pero evitamos warnings de promesas no manejadas
      console.debug("reloadAll error (ya manejado en loadAll):", e?.message ?? e);
    });
  }, [loadAll]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        await loadAll(controller.signal);
      } catch (err) {
        // err AbortError ya manejado en loadAll
      }
    })();

    return () => {
      controller.abort();
    };
  }, [loadAll]);

  const handleCategoriaSelect = async (cat) => {
    const same =
      categoriaSeleccionada &&
      cat &&
      categoriaSeleccionada.toString().trim().toLowerCase() === cat.toString().trim().toLowerCase();
    if (same || !cat) {
      setCategoriaSeleccionada(null);
      // volvemos a cargar todas (sin signal)
      reloadAll();
      return;
    }

    setCategoriaSeleccionada(cat);
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    try {
      const arr = await fetchFromBackend({ categoria: cat, signal: controller.signal });
      const normalized = normalize(arr);
      setRecetas(normalized);
      setCategorias((prev) => {
        const exists = prev.some(
          (p) => (p || "").toString().trim().toLowerCase() === (cat || "").toString().trim().toLowerCase()
        );
        return exists ? prev : [cat, ...prev];
      });
    } catch (err) {
      if (err && err.name === "AbortError") {
        console.debug("handleCategoriaSelect abortada");
        return;
      }
      setRecetas([]);
    } finally {
      setLoading(false);
    }
  };

  function handleRecetaAgregada(nuevaReceta) {
    if (!nuevaReceta) return;
    const cat = nuevaReceta.categoria || nuevaReceta.category || "";
    const normalized = { ...nuevaReceta, titulo: nuevaReceta.titulo || nuevaReceta.title || "", categoria: cat };
    setRecetas((prev) => [normalized, ...prev]);
    if (
      cat &&
      !categorias.map((c) => c.toString().trim().toLowerCase()).includes(cat.toString().trim().toLowerCase())
    ) {
      setCategorias((prev) => [cat, ...prev]);
    }
  }

  return (
    <div className="menu-horizontal">
      <MenuHorizontal />

      <main className="main-content">
        <section className="hero">
          <h1>CeliRadar - Recetas sin TACC</h1>
        </section>

        <section>
          <CarruselCategorias
            categorias={categorias}
            categoriaSeleccionada={categoriaSeleccionada}
            onSelect={handleCategoriaSelect}
          />
        </section>

        <section>
          <h2>Recetas {categoriaSeleccionada ? `— ${categoriaSeleccionada}` : ""}</h2>

          {loading && <p>Cargando recetas...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* ListaReceta ahora contiene toda la UI de las tarjetas */}
          <ListaReceta recetas={recetas} usuarioId={usuarioId} cargando={loading} />
        </section>

        <section>
          <h2>Agregar receta</h2>
          {/* Pasamos reloadAll (wrapper) para que el formulario pueda pedir recarga sin pasar signal) */}
          <FormularioReceta usuarioId={usuarioId} onRecetaAgregada={handleRecetaAgregada} onRecetaGuardada={reloadAll} />
        </section>

        <section>
          <h2>Consejos de cocina</h2>
          <FormularioConsejo setConsejos={() => {}} />
          <ListaConsejos consejos={[]} />
        </section>

        <ModalContacto />
        <Fotter />
      </main>
    </div>
  );
}


