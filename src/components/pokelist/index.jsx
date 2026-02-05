import { useEffect, useMemo, useState } from "react";
import PokeCard from "../pokeCard";
import "./pokelist.css";

const PokeList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((r) => r.json())
      .then((data) => {
        setPokemons(data.results);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const total = pokemons.length;

  const next = () => {
    setIndex((i) => (total === 0 ? 0 : (i + 1) % total));
  };

  const prev = () => {
    setIndex((i) => (total === 0 ? 0 : (i - 1 + total) % total));
  };

  // bonus: clavier ← →
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [total]);

  const current = useMemo(() => pokemons[index], [pokemons, index]);

  if (loading) return <p className="loading">Chargement...</p>;
  if (!pokemons.length) return <p className="loading">Aucun Pokémon</p>;

  return (
    <div className="viewer">
      <div className="viewerHeader">
        <h2 className="pokemonTitle">Mon <span>Pokédex</span></h2>

        <div className="nav">
          <button className="arrowBtn" onClick={prev} aria-label="Précédent">
            ‹
          </button>

          <div className="counter">
            <span className="counterBig">{index + 1}</span>
            <span className="counterSlash">/</span>
            <span className="counterSmall">{total}</span>
          </div>

          <button className="arrowBtn" onClick={next} aria-label="Suivant">
            ›
          </button>
        </div>
      </div>

      <PokeCard pokemon={current} />

      <p className="hint">Astuce : utilise les flèches du clavier ← →</p>
    </div>
  );
};

export default PokeList;
