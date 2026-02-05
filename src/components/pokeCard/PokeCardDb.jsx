import { useMemo, useRef, useState } from "react";
import "./pokeCard.css";

const TYPE_THEME = {
  Grass: { c: "#78C850", b1: "#2e7d32", b2: "#a5d6a7" },
  Poison: { c: "#A040A0", b1: "#4a148c", b2: "#ce93d8" },
  Fire: { c: "#F08030", b1: "#b71c1c", b2: "#ffcc80" },
  Water: { c: "#6890F0", b1: "#0d47a1", b2: "#90caf9" },
  Electric: { c: "#F8D030", b1: "#f9a825", b2: "#fff59d" },
  Bug: { c: "#A8B820", b1: "#33691e", b2: "#c5e1a5" },
  Normal: { c: "#A8A878", b1: "#424242", b2: "#cfcfcf" },
  Ground: { c: "#E0C068", b1: "#6d4c41", b2: "#d7ccc8" },
  Fairy: { c: "#EE99AC", b1: "#ad1457", b2: "#f8bbd0" },
  Fighting: { c: "#C03028", b1: "#4e342e", b2: "#ffab91" },
  Psychic: { c: "#F85888", b1: "#880e4f", b2: "#f48fb1" },
  Rock: { c: "#B8A038", b1: "#5d4037", b2: "#ffe082" },
  Ghost: { c: "#705898", b1: "#311b92", b2: "#b39ddb" },
  Ice: { c: "#98D8D8", b1: "#006064", b2: "#b2ebf2" },
  Dragon: { c: "#7038F8", b1: "#1a237e", b2: "#b39ddb" },
  Steel: { c: "#B8B8D0", b1: "#263238", b2: "#cfd8dc" },
  Dark: { c: "#705848", b1: "#212121", b2: "#a1887f" },
  Flying: { c: "#A890F0", b1: "#283593", b2: "#c5cae9" },
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function PokeCardDb({ pokemon, onClick }) {
  const [hover, setHover] = useState(false);
  const ref = useRef(null);

  const type = useMemo(() => pokemon?.type?.[0] ?? "Normal", [pokemon]);
  const theme = TYPE_THEME[type] ?? TYPE_THEME.Normal;

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
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `40%`);
  };

  if (!pokemon) return null;

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
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <header className="tcgTop">
        <div>
          <span className="stagePill">BASE</span>
          <h3 className="tcgName">{cap(pokemon.name?.english)}</h3>
        </div>

        <div className="topRight">
          <span className="hp">PV {pokemon.base?.HP ?? "?"}</span>
          <span className="typeIcon">{type?.[0]?.toUpperCase() ?? "?"}</span>
        </div>
      </header>

      <section className="artFrame">
        <div className="artInner">
          <img
            src={pokemon.image}
            alt={pokemon.name?.english}
            className="sprite"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      </section>

      <div className="infoLine">
        <span>N°{pokemon.id}</span>
        <span>{pokemon.type?.join(", ")}</span>
      </div>

      <section className="moves">
        <div className="move">
          <div className="energyRow">
            <span />
            <span />
          </div>
          <div>
            <div className="moveTitle">Stats</div>
            <div className="moveText">
              ATK {pokemon.base?.Attack} • DEF {pokemon.base?.Defense} • SPD {pokemon.base?.Speed}
            </div>
          </div>
          <div className="dmg">{pokemon.base?.SpecialAttack ?? "?"}</div>
        </div>
      </section>

      <footer className="tcgBottom">
        <div className="bottomRow">
          <span className="badgeSmall">Faiblesse ×2</span>
          <span className="badgeSmall">Résistance —</span>
          <span className="badgeSmall">Retraite 1</span>
        </div>
        <div className="flavor">Pokédex maison (MongoDB).</div>
      </footer>
    </article>
  );
}
