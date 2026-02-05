import { useEffect, useState } from "react";
import Title from "../title";
import PokeCard from "../pokeCard";

const Counter = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    document.title = `Pokemon index: ${count}`;
  }, [count]);

  const increment = () => {
    setCount((prev) => Math.min(prev + 1, pokemons.length - 1));
  };

  const decrement = () => {
    setCount((prev) => Math.max(prev - 1, 0));
  };

  if (loading) return <p>Chargement...</p>;
  if (!pokemons.length) return <p>Aucun Pokémon</p>;

  return (
    <div>
      {count >= 10 && <Title label="BRAVO 10 compteur" />}

      <h2>Pokemon Viewer</h2>

      <p>
        {count + 1} / {pokemons.length}
      </p>

      <button onClick={increment} disabled={count === pokemons.length - 1}>
        Incrémenter
      </button>

      <button onClick={decrement} disabled={count === 0}>
        Décrémenter
      </button>

      <PokeCard pokemon={pokemons[count]} />
    </div>
  );
};

export default Counter;
