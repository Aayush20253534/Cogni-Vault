import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function DrawerShell({
  title,
  icon: Icon,
  onClose,
  children,
  footer,
  accent = "cyan",
  maxWidth = "max-w-[500px]",
}) {
  const accentClass =
    accent === "rose" ? "text-rose-300" :
    accent === "amber" ? "text-amber-300" :
    accent === "purple" ? "text-purple-300" :
    "text-cyan-300";

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 260 }}
      className={`fixed bottom-0 right-0 top-0 z-50 flex w-full ${maxWidth} flex-col overflow-y-auto border-l border-slate-800 bg-slate-950/95 p-5 shadow-[0_0_60px_rgba(0,0,0,0.95)] lg:p-6`}
    >
      <div className="mb-5 flex shrink-0 items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={`h-4 w-4 ${accentClass}`} />}
          <span className="text-xs font-black uppercase tracking-widest text-slate-200">
            {title}
          </span>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg border border-slate-800 bg-slate-900/70 p-1 text-slate-500 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5">{children}</div>

      {footer && (
        <div className="mt-5 shrink-0 border-t border-slate-800 pt-4">
          {footer}
        </div>
      )}
    </motion.aside>
  );
}