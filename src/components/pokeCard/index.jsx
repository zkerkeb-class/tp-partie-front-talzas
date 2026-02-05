import { useEffect, useMemo, useRef, useState } from "react";
import "./pokeCard.css";

const TYPE_THEME = {
  grass: { c: "#78C850", b1: "#2e7d32", b2: "#a5d6a7" },
  poison: { c: "#A040A0", b1: "#4a148c", b2: "#ce93d8" },
  fire: { c: "#F08030", b1: "#b71c1c", b2: "#ffcc80" },
  water: { c: "#6890F0", b1: "#0d47a1", b2: "#90caf9" },
  electric: { c: "#F8D030", b1: "#f9a825", b2: "#fff59d" },
  bug: { c: "#A8B820", b1: "#33691e", b2: "#c5e1a5" },
  normal: { c: "#A8A878", b1: "#424242", b2: "#cfcfcf" },
  ground: { c: "#E0C068", b1: "#6d4c41", b2: "#d7ccc8" },
  fairy: { c: "#EE99AC", b1: "#ad1457", b2: "#f8bbd0" },
  fighting: { c: "#C03028", b1: "#4e342e", b2: "#ffab91" },
  psychic: { c: "#F85888", b1: "#880e4f", b2: "#f48fb1" },
  rock: { c: "#B8A038", b1: "#5d4037", b2: "#ffe082" },
  ghost: { c: "#705898", b1: "#311b92", b2: "#b39ddb" },
  ice: { c: "#98D8D8", b1: "#006064", b2: "#b2ebf2" },
  dragon: { c: "#7038F8", b1: "#1a237e", b2: "#b39ddb" },
  steel: { c: "#B8B8D0", b1: "#263238", b2: "#cfd8dc" },
  dark: { c: "#705848", b1: "#212121", b2: "#a1887f" },
  flying: { c: "#A890F0", b1: "#283593", b2: "#c5cae9" },
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const prettify = (s) => cap((s ?? "").replaceAll("-", " "));

export default function PokeCard({ pokemon }) {
  const [poke, setPoke] = useState(null);
  const [hover, setHover] = useState(false);
  const [error, setError] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!pokemon?.url) return;

    setPoke(null);
    setError(null);

    fetch(pokemon.url)
      .then((r) => {
        if (!r.ok) throw new Error("Erreur API PokeAPI");
        return r.json();
      })
      .then(setPoke)
      .catch((e) => setError(e.message));
  }, [pokemon?.url]);

  const type = useMemo(() => poke?.types?.[0]?.type?.name ?? "normal", [poke]);

  // ✅ IMPORTANT : fallback pour éviter crash
  const theme = TYPE_THEME[type] ?? TYPE_THEME.normal;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    el.style.setProperty("--rx", `${-y * 10}deg`);
    el.style.setProperty("--ry", `${x * 12}deg`);
    el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    setHover(false);

    // reset pour éviter valeurs "bloquées"
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `40%`);
  };

  if (error) return <p style={{ color: "white" }}>Erreur : {error}</p>;
  if (!poke) return <p style={{ color: "white" }}>Chargement…</p>;

  return (
    <article
      ref={ref}
      className={`tcgCard shiny ${hover ? "isHover" : ""}`}
      style={{
        "--typeBg1": theme.b1,
        "--typeBg2": theme.b2,
        "--typeColor": theme.c,
        "--rx": "0deg",
        "--ry": "0deg",
        "--mx": "50%",
        "--my": "40%",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <header className="tcgTop">
        <div>
          <span className="stagePill">BASE</span>
          <h3 className="tcgName">{cap(poke.name)}</h3>
        </div>

        <div className="topRight">
          <span className="hp">PV {poke.stats?.[0]?.base_stat ?? "?"}</span>
          <span className="typeIcon">{type?.[0]?.toUpperCase() ?? "?"}</span>
        </div>
      </header>

      <section className="artFrame">
        <div className="artInner">
          <img
            src={poke.sprites?.front_default}
            alt={poke.name}
            className="sprite"
          />
        </div>
      </section>

      <div className="infoLine">
        <span>N°{poke.id}</span>
        <span>Pokémon {prettify(type)}</span>
        <span>{poke.height / 10} m</span>
        <span>{poke.weight / 10} kg</span>
      </div>

      <section className="moves">
        <div className="move">
          <div className="energyRow">
            <span />
            <span />
          </div>
          <div>
            <div className="moveTitle">{prettify(poke.moves?.[0]?.move?.name ?? "attaque")}</div>
            <div className="moveText">Inflige de lourds dégâts.</div>
          </div>
          <div className="dmg">90</div>
        </div>
      </section>

      <footer className="tcgBottom">
        <div className="bottomRow">
          <span className="badgeSmall">Faiblesse ×2</span>
          <span className="badgeSmall">Résistance —</span>
          <span className="badgeSmall">Retraite 1</span>
        </div>
        <div className="flavor">
          Plus son éclat est fort, plus cette carte est rare.
        </div>
      </footer>
    </article>
  );
}
