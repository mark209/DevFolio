"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type PreloaderProps = {
  onComplete: () => void;
};

const loaderLines = ["Initializing DevFolio", "Loading projects", "Opening portfolio"];
const bootSteps = ["Profile", "Projects", "Stack", "Contact"];

export function Preloader({ onComplete }: PreloaderProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [hideLoader, setHideLoader] = useState(false);
  const progress = Math.min(
    100,
    Math.round(((lineIndex + (loaderLines[lineIndex] ? charIndex / loaderLines[lineIndex].length : 1)) / loaderLines.length) * 100)
  );

  useEffect(() => {
    if (lineIndex >= loaderLines.length) {
      const closeTimer = setTimeout(() => setHideLoader(true), 320);
      return () => clearTimeout(closeTimer);
    }

    const currentLine = loaderLines[lineIndex];
    if (charIndex < currentLine.length) {
      const typingTimer = setTimeout(() => setCharIndex((prev) => prev + 1), 16);
      return () => clearTimeout(typingTimer);
    }

    const pauseTimer = setTimeout(() => {
      setDisplayedLines((prev) => [...prev, currentLine]);
      setLineIndex((prev) => prev + 1);
      setCharIndex(0);
    }, 100);

    return () => clearTimeout(pauseTimer);
  }, [charIndex, lineIndex]);

  useEffect(() => {
    if (!hideLoader) {
      return;
    }
    const timeout = setTimeout(() => onComplete(), 280);
    return () => clearTimeout(timeout);
  }, [hideLoader, onComplete]);

  const handleSkip = () => {
    setHideLoader(true);
  };

  return (
    <AnimatePresence>
      {!hideLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#030407] px-6"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-8%" }}
          transition={{ duration: 0.7, ease: [0.8, 0, 0.2, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_32%,rgba(255,255,255,0.025))]" />
          <div className="ambient-grid pointer-events-none absolute inset-0 opacity-20" />
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.06] to-transparent"
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute h-px w-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
            animate={{ y: ["8vh", "92vh"], opacity: [0, 1, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.section
            className="premium-panel relative w-full max-w-2xl overflow-hidden rounded-[28px] px-6 py-8 text-center sm:px-10 sm:py-10"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute left-5 top-5 h-8 w-8 border-l border-t border-white/25" />
            <div className="pointer-events-none absolute right-5 top-5 h-8 w-8 border-r border-t border-white/25" />
            <div className="pointer-events-none absolute bottom-5 left-5 h-8 w-8 border-b border-l border-white/25" />
            <div className="pointer-events-none absolute bottom-5 right-5 h-8 w-8 border-b border-r border-white/25" />

            <div className="relative mx-auto flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/12"
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-dashed border-white/18"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-5 rounded-full bg-white/[0.04] blur-xl"
                animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative overflow-hidden">
                <motion.p
                  className="bg-gradient-to-r from-zinc-300 via-white to-cyan-200 bg-clip-text font-heading text-7xl font-black tracking-tight text-transparent sm:text-8xl"
                  animate={{ textShadow: ["0 0 18px rgba(255,255,255,0.18)", "0 0 34px rgba(255,255,255,0.38)", "0 0 18px rgba(255,255,255,0.18)"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  EJ
                </motion.p>
                <motion.span
                  className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 1.7, repeat: Infinity, repeatDelay: 0.35, ease: "easeInOut" }}
                />
              </div>
            </div>

            <div className="mx-auto mt-7 max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.34em] text-white/45">Boot Sequence</p>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65 transition hover:border-white/35 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                >
                  Skip
                </button>
              </div>
              <div className="mt-4 min-h-[92px] rounded-2xl border border-white/10 bg-black/25 p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                {displayedLines.map((line) => (
                  <p key={line} className="font-mono text-sm leading-7 text-white/58">
                    <span className="mr-2 text-emerald-300/80">OK</span>
                    {line}
                  </p>
                ))}
                {lineIndex < loaderLines.length && (
                  <p className="font-mono text-sm leading-7 text-white/90">
                    <span className="mr-2 text-cyan-200/90">{">"}</span>
                    {loaderLines[lineIndex].slice(0, charIndex)}
                    <motion.span
                      className="ml-1 inline-block h-4 w-[2px] bg-white/90 align-middle"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </p>
                )}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                  <span>Loading</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-200 via-white to-violet-200 shadow-[0_0_20px_rgba(255,255,255,0.36)]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {bootSteps.map((step, index) => {
                  const isReady = progress >= ((index + 1) / bootSteps.length) * 100;

                  return (
                    <div
                      key={step}
                      className={`rounded-xl border px-3 py-2 text-xs transition ${
                        isReady
                          ? "border-white/25 bg-white/10 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/35"
                      }`}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
