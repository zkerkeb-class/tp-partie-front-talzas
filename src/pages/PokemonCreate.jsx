import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiCreatePokemon, apiUploadImage } from "../api";

const ALLOWED_TYPES = [
  "Normal","Fire","Water","Grass","Electric","Ice","Fighting","Poison",
  "Ground","Flying","Psychic","Bug","Rock","Ghost","Dark","Dragon","Steel","Fairy",
];

export default function PokemonCreate() {
  const navigate = useNavigate();
  const [err, setErr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    id: "",
    english: "",
    french: "",
    japanese: "",
    chinese: "",
    types: ["Normal"], // <-- important
    image: "",
    HP: 1,
    Attack: 1,
    Defense: 1,
    SpecialAttack: 1,
    SpecialDefense: 1,
    Speed: 1,
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onToggleType = (t) => {
    setErr(null);
    setForm((f) => {
      const has = f.types.includes(t);
      const next = has ? f.types.filter((x) => x !== t) : [...f.types, t];
      if (next.length > 2) return f; // max 2 types
      if (next.length === 0) return f; // au moins 1
      return { ...f, types: next };
    });
  };

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr(null);
    setUploading(true);
    try {
      const { url } = await apiUploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!form.id) return setErr("ID obligatoire");
    if (!form.english || !form.french || !form.japanese || !form.chinese) {
      return setErr("Toutes les langues sont obligatoires (EN/FR/JP/CN).");
    }
    if (!form.image) return setErr("Image obligatoire (upload ou URL).");
    if (!form.types.length) return setErr("Choisis au moins 1 type.");

    setCreating(true);
    try {
      const payload = {
        id: Number(form.id),
        name: {
          english: form.english.trim(),
          french: form.french.trim(),
          japanese: form.japanese.trim(),
          chinese: form.chinese.trim(),
        },
        type: form.types,
        base: {
          HP: Number(form.HP),
          Attack: Number(form.Attack),
          Defense: Number(form.Defense),
          SpecialAttack: Number(form.SpecialAttack),
          SpecialDefense: Number(form.SpecialDefense),
          Speed: Number(form.Speed),
        },
        image: form.image.trim(),
      };

      const created = await apiCreatePokemon(payload);
      navigate(`/pokemons/${created.id}`);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <Link to="/" className="pokeBtn">← Retour</Link>
      </div>

      <h2 style={{ textAlign: "center", color: "white", marginBottom: 14 }}>
        Ajouter un Pokémon
      </h2>

      {err && (
        <p style={{ color: "#ffb4b4", textAlign: "center", fontWeight: 900 }}>
          {err}
        </p>
      )}

      <form onSubmit={submit} className="pokeForm">
        {/* Identité + langues */}
        <section className="pokeCardPanel">
          <div className="pokeGrid2">
            <div className="pokeField">
              <div className="pokeLabel">ID (unique)</div>
              <input className="pokeInput" placeholder="Ex: 999" value={form.id} onChange={set("id")} />
              <div className="pokeHelp">Doit être un nombre unique.</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }} className="pokeGrid2">
            <div className="pokeField">
              <div className="pokeLabel">Nom (English)</div>
              <input className="pokeInput" placeholder="Bulbasaur" value={form.english} onChange={set("english")} />
            </div>
            <div className="pokeField">
              <div className="pokeLabel">Nom (Français)</div>
              <input className="pokeInput" placeholder="Bulbizarre" value={form.french} onChange={set("french")} />
            </div>
            <div className="pokeField">
              <div className="pokeLabel">Nom (Japanese)</div>
              <input className="pokeInput" placeholder="フシギダネ" value={form.japanese} onChange={set("japanese")} />
            </div>
            <div className="pokeField">
              <div className="pokeLabel">Nom (Chinese)</div>
              <input className="pokeInput" placeholder="妙蛙种子" value={form.chinese} onChange={set("chinese")} />
            </div>
          </div>
        </section>

        {/* Types */}
        <section className="pokeCardPanel">
          <div className="pokeLabel" style={{ textAlign: "center", marginBottom: 10 }}>
            Types (clique — max 2)
          </div>

          <div className="typePicker">
            {ALLOWED_TYPES.map((t) => {
              const on = form.types.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  className={`typeChip ${on ? "isOn" : ""}`}
                  onClick={() => onToggleType(t)}
                  aria-pressed={on}
                >
                  <span className="typeChipDot" />
                  {t}
                </button>
              );
            })}
          </div>

          <div className="pokeHelp" style={{ textAlign: "center", marginTop: 10 }}>
            Sélection actuelle : <b style={{ color: "white" }}>{form.types.join(", ")}</b>
          </div>
        </section>

        {/* Image */}
        <section className="pokeCardPanel">
          <div className="pokeGrid2">
            <div className="pokeField">
              <div className="pokeLabel">Image (upload)</div>
              <input className="pokeFile" type="file" accept="image/*" onChange={onUpload} />
              <div className="pokeHelp">{uploading ? "Upload en cours…" : "Upload → URL auto"}</div>
            </div>

            <div className="pokeField">
              <div className="pokeLabel">Image URL (optionnel si upload)</div>
              <input
                className="pokeInput"
                placeholder="http://localhost:3000/assets/uploads/xxx.png"
                value={form.image}
                onChange={set("image")}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
            {form.image ? (
              <img src={form.image} alt="preview" className="pokePreview" />
            ) : (
              <div
                className="pokePreview"
                style={{
                  display: "grid",
                  placeItems: "center",
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 900,
                }}
              >
                Preview
              </div>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="pokeCardPanel">
          <div className="pokeLabel" style={{ marginBottom: 10, textAlign: "center" }}>
            Stats
          </div>

          <div className="pokeGrid3">
            {[
              ["HP", "PV"],
              ["Attack", "Attaque"],
              ["Defense", "Défense"],
              ["SpecialAttack", "Atk Spé"],
              ["SpecialDefense", "Def Spé"],
              ["Speed", "Vitesse"],
            ].map(([k, label]) => (
              <div key={k} className="pokeField">
                <div className="pokeLabel">{label}</div>
                <input className="pokeInput" type="number" min={1} max={255} value={form[k]} onChange={set(k)} />
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button className="pokePrimaryBtn" type="submit" disabled={uploading || creating}>
            {creating ? "Création…" : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}
