import React, { useEffect, useState } from "react";
import styles from "./ListaConsejos.module.css";

export default function ConsejosList({ consejos }) {
  const consejosBase = [
    {
      titulo: "✅ Evitá la contaminación cruzada",
      contenido: (
        <ul>
          <li>Usá utensilios y superficies exclusivas o bien lavadas.</li>
          <li>No compartas aceite, tostadoras ni coladores.</li>
          <li>
            Almacená los ingredientes sin TACC por separado y bien etiquetados.
          </li>
        </ul>
      ),
    },
    {
      titulo: "✅ Usá ingredientes certificados",
      contenido: (
        <p>
          Elegí productos con el símbolo <strong>“sin TACC”</strong>.
        </p>
      ),
    },
    {
      titulo: "✅ Leé siempre las etiquetas",
      contenido: (
        <p>
          Las fórmulas pueden cambiar. Prestá atención a los aditivos y
          almidones.
        </p>
      ),
    },
    {
      titulo: "🌾 Harinas sin TACC recomendadas",
      contenido: (
        <>
          <ul>
            <li>
              <strong>Harina de arroz:</strong> liviana y versátil.
            </li>
            <li>
              <strong>Harina de maíz:</strong> ideal para masas y polenta.
            </li>
            <li>
              <strong>Fécula de maíz:</strong> mejora textura y elasticidad.
            </li>
            <li>
              <strong>Harina de mandioca:</strong> buena para panes y chipá.
            </li>
            <li>
              <strong>Harina de garbanzo:</strong> sabrosa y nutritiva.
            </li>
            <li>
              <strong>Harinas integrales:</strong> sorgo, quinoa, teff, mijo.
            </li>
          </ul>
          <p>💡 Mezclá harinas para una textura más parecida al trigo.</p>
        </>
      ),
    },
    {
      titulo: "👩‍🍳 Trucos útiles para cocinar sin gluten",
      contenido: (
        <ul>
          <li>
            Usá <strong>goma xántica</strong> o <strong>psyllium</strong> para
            elasticidad.
          </li>
          <li>Pesá los ingredientes.</li>
          <li>Agregá ingredientes húmedos.</li>
          <li>Dejá reposar la masa antes de hornear.</li>
          <li>Precalentá bien el horno.</li>
          <li>Conservá los productos en heladera o freezer.</li>
        </ul>
      ),
    },
  ];

  const [listaFinal, setListaFinal] = useState([]);

  useEffect(() => {
    // Combina los consejos base con los nuevos del usuario
    setListaFinal([...consejosBase, ...consejos]);
  }, [consejos]);

  if (listaFinal.length === 0) {
    return <p className={styles.mensaje}>Todavía no hay consejos.</p>;
  }

  return (
    <section className={styles.consejosSection}>
      <div className={styles.consejosContent}>
        <h2 className={styles.consejosTitle}>
          Consejos clave para cocinar sin TACC
        </h2>
        <p className={styles.consejosIntro}>
          Cocinar sin TACC requiere cuidados especiales para garantizar
          preparaciones seguras y deliciosas para personas celíacas o con
          sensibilidad al gluten.
        </p>

        <div className={styles.consejosBloques}>
          {listaFinal.map((c, i) => (
            <div key={i} className={styles.bloque}>
              {c.titulo && <h3>{c.titulo}</h3>}
              <div>{c.contenido || <p>{c.texto}</p>}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
