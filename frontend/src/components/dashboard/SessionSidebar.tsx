import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { themes } from "../../styles/themes";

function formatSessionTime(dateString?: string) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) {
    return `Today, ${time}`;
  }

  if (isYesterday) {
    return `Yesterday, ${time}`;
  }

  const datePart = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return `${datePart}, ${time}`;
}

export default function SessionSidebar({
  sessions,
  onSelect,
  open,
  onClose,
}: {
  sessions: any[];
  onSelect: (session: any) => void;
  open: boolean;
  onClose: () => void;
}) {
  const { theme } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-30 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={`
              fixed left-0 top-0 h-full w-72 z-40
              backdrop-blur-xl
              ${themes[theme].card}
              ${
                theme === "space"
                  ? "border-r border-white/10"
                  : "border-r border-black/10"
              }
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4">
              <h3 className={`font-semibold ${themes[theme].text}`}>
                Sessions
              </h3>

              <button
                onClick={onClose}
                className={`text-lg opacity-70 hover:opacity-100 ${themes[theme].text}`}
              >
                ✕
              </button>
            </div>

            {/* Session List */}
            <div className="px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-64px)]">
              {sessions.length === 0 && (
                <div className={`text-sm opacity-60 ${themes[theme].text}`}>
                  No sessions yet
                </div>
              )}

              {sessions.map((s) => {
                const ragEnabled = s.useRAG || !!s.result?.rag;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      onSelect(s);
                      onClose();
                    }}
                    className={`
                      p-3 rounded-lg cursor-pointer transition
                      ${
                        theme === "space"
                          ? "hover:bg-white/5"
                          : "hover:bg-black/5"
                      }
                      ${themes[theme].text}
                    `}
                  >
                    {/* Category + RAG badge */}
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">
                        {s.category?.trim()}
                      </div>

                      {ragEnabled && (
                        <span className="text-[10px] px-1.5 py-[1px] rounded bg-white/10 opacity-80">
                          🧠 RAG
                        </span>
                      )}
                    </div>

                    {/* Brands */}
                    <div className="text-xs opacity-60 truncate">
                      {s.brands?.join(", ")}
                    </div>

                    {/* Time */}
                    <div className="flex justify-end mt-1 text-[10px] opacity-60">
                      {formatSessionTime(s.createdAt || s.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}