import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../styles/themes";

type Props = {
  onRun: (category: string, brands: string[], useRAG: boolean) => Promise<boolean>;
  loading?: boolean;
};

export default function AnalysisInputPanel({ onRun, loading }: Props) {
  const { theme } = useTheme();

  const [category, setCategory] = useState("");
  const [brands, setBrands] = useState("");
  const [useRAG, setUseRAG] = useState(true);

  async function handleSubmit() {
    if (loading) return;

    const parsedBrands = brands
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    const trimmedCategory = category.trim();

    if (!trimmedCategory || parsedBrands.length === 0) return;

    const success = await onRun(trimmedCategory, parsedBrands, useRAG);

    if (success) {
      setCategory("");
      setBrands("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className={`relative p-6 mb-8 rounded-xl ${themes[theme].card}`}>
      <h2 className={`text-lg font-semibold mb-4 ${themes[theme].text}`}>
        AI Visibility Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`p-3 rounded outline-none ${themes[theme].input}`}
          placeholder="Category (e.g. CRM software)"
        />

        <input
          value={brands}
          onChange={(e) => setBrands(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`p-3 rounded outline-none ${themes[theme].input}`}
          placeholder="Brands (comma separated)"
        />

        <button
          disabled={loading}
          onClick={handleSubmit}
          className={`rounded transition-transform hover:scale-[1.02] disabled:opacity-60 ${themes[theme].button}`}
        >
          {loading ? "Analyzing…" : "Run Analysis"}
        </button>
      </div>

      {/* RAG toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="useRAG"
          checked={useRAG}
          onChange={(e) => setUseRAG(e.target.checked)}
          className="rounded"
        />

        <label htmlFor="useRAG" className={`text-sm ${themes[theme].text}`}>
          Enable RAG insights and semantic search
        </label>

        {/* {useRAG && (
          <span className="ml-2 text-xs opacity-70">
            🧠 RAG enabled
          </span>
        )} */}
      </div>
    </div>
  );
}