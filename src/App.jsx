import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import PokeList from "./components/pokelist";
import PokemonDetail from "./pages/PokemonDetail";
import PokemonCreate from "./pages/PokemonCreate";

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <nav className="pokeNav pokeNavWithLaser">
        {/* ===== LASER SUR LA GRANDE BARRE DE FOND ===== */}
        <div className="navBarLaser" aria-hidden="true">
          <svg
            className="navBarLaserSvg"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
          >
            {/* Glow continu (base) */}
            <rect
              className="navBarGlow"
              x="2"
              y="2"
              width="96"
              height="36"
              rx="18"
              ry="18"
              pathLength="100"
              vectorEffect="non-scaling-stroke"
            />

            {/* Queue du laser */}
            <rect
              className="navBarTail"
              x="2"
              y="2"
              width="96"
              height="36"
              rx="18"
              ry="18"
              pathLength="100"
              vectorEffect="non-scaling-stroke"
            />

            {/* Tête du laser (plus brillante) */}
            <rect
              className="navBarHead"
              x="2"
              y="2"
              width="96"
              height="36"
              rx="18"
              ry="18"
              pathLength="100"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* ===== BOUTONS ===== */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `pokeNavBtn ${isActive ? "isActive" : ""}`
          }
        >
          📘 Liste
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            `pokeNavBtn ${isActive ? "isActive" : ""}`
          }
        >
          ➕ Ajouter
        </NavLink>
      </nav>

      {/* ===== ROUTES ===== */}
      <Routes>
        <Route path="/" element={<PokeList />} />
        <Route path="/pokemons/:id" element={<PokemonDetail />} />
        <Route path="/create" element={<PokemonCreate />} />
      </Routes>
    </div>
  );
}
