import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pokelist.css";

import {
  apiGetPokemons,
  apiSearchPokemonByName,
  apiSuggestPokemons,
} from "../../api";

import PokeCardDb from "../pokeCard/PokeCardDb";

const langLabel = {
  english: "EN",
  french: "FR",
  japanese: "JP",
  chinese: "CN",
};

export default function PokeList() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timer = useRef(null);

  /* Pagination */
  const loadPage = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetPokemons(p, 20);
      setItems(data.items);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  /* Autocomplete */
  const onChangeQuery = (v) => {
    setQuery(v);
    if (timer.current) clearTimeout(timer.current);

    if (!v.trim()) {
      setSuggestions([]);
      return;
    }

    timer.current = setTimeout(async () => {
      try {
        const res = await apiSuggestPokemons(v);
        setSuggestions(res.items || []);
      } catch {
        setSuggestions([]);
      }
    }, 250);
  };

  /* Submit search */
  const onSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const res = await apiSearchPokemonByName(query);
      navigate(`/pokemons/${res.pokemon.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSearching(false);
      setSuggestions([]);
    }
  };

  if (loading) return <p className="loading">Chargement…</p>;
  if (error) return <p className="loading">Erreur : {error}</p>;

  return (
    <div className="viewer">
      <div className="viewerHeader">
        <h2 className="pokemonTitle">
          Mon <span>Pokédex</span>
        </h2>

        {/* 🔍 SEARCH + AUTOCOMPLETE */}
        <form onSubmit={onSearch} className="pokeSearch">
          <div className="pokeAutoWrap">
            <input
              className="pokeSearchInput"
              value={query}
              onChange={(e) => onChangeQuery(e.target.value)}
              placeholder="Rechercher (EN / FR / JP / CN)"
            />

            {suggestions.length > 0 && (
              <div className="pokeAutoList">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="pokeAutoItem"
                    onClick={() => navigate(`/pokemons/${s.id}`)}
                  >
                    <img src={s.image} className="pokeAutoImg" />
                    <div className="pokeAutoName">
                      {s.matchedValue}
                    </div>
                    <div className="pokeAutoLang">
                      {langLabel[s.matchedField] || ""}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="pokeGoBtn" type="submit" disabled={searching}>
            {searching ? "…" : "Go"}
          </button>
        </form>

        {/* Pagination */}
        <div className="nav">
          <button className="arrowBtn" onClick={() => loadPage(page - 1)} disabled={page === 1}>
            ‹
          </button>

          <div className="counter">
            <span className="counterBig">{page}</span>
            <span className="counterSlash">/</span>
            <span className="counterSmall">{totalPages}</span>
          </div>

          <button className="arrowBtn" onClick={() => loadPage(page + 1)} disabled={page === totalPages}>
            ›
          </button>
        </div>
      </div>

      {/* Cartes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 22,
          width: "100%",
          maxWidth: 1300,
          justifyItems: "center",
        }}
      >
        {items.map((pokemon) => (
          <PokeCardDb
            key={pokemon.id}
            pokemon={pokemon}
            onClick={() => navigate(`/pokemons/${pokemon.id}`)}
          />
        ))}
      </div>

      <p className="hint">
        Recherche multi-langues • autocomplétion • clic sur carte = détails
      </p>
    </div>
  );
}
