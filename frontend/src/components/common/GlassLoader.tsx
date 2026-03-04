import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../styles/themes";
import { useEffect, useState } from "react";

const ragStages = [
  "Analyzing AI visibility…",
  "Generating prompts…",
  "Querying AI models…",
  "Searching historical responses…",
  "Generating insights…"
];

export default function GlassLoader({
  text,
  useRAG
}: {
  text?: string;
  useRAG?: boolean;
}) {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!useRAG) return;

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % ragStages.length);
    }, 1400);

    return () => clearInterval(interval);
  }, [useRAG]);

  const displayText = useRAG
    ? ragStages[step]
    : text ?? "Analyzing AI visibility…";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Loader Card */}
      <div
        className={`relative px-8 py-6 rounded-xl flex flex-col items-center gap-4 ${themes[theme].card}`}
      >
        {/* Spinner */}
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />

        <p className={`${themes[theme].text} text-sm opacity-80`}>
          {displayText}
        </p>
      </div>
    </motion.div>
  );
}