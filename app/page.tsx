"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type FormEvent, type MouseEvent, useEffect, useMemo, useState } from "react";
import { Preloader } from "@/components/Preloader";
import { SceneBackground } from "@/components/SceneBackground";
import { projectCategories, projects, techStackGroups } from "@/lib/projects";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
  { label: "Resume", href: "/CUBING_Resume.pdf", external: true }
];

const socialLinks = [
  { href: "https://www.instagram.com/elijvvh_", label: "Instagram", icon: "/icons/instagram.svg" },
  { href: "https://www.facebook.com/elijah.james.5667#", label: "Facebook", icon: "/icons/facebook.svg" },
  { href: "https://www.linkedin.com/in/elijah-cubing", label: "LinkedIn", icon: "/icons/linkedin.svg" }
];

function AnimatedMetric({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(shouldReduceMotion ? value : 0);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const totalFrames = 28;
    const interval = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress === 1) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => window.clearInterval(interval);
  }, [shouldReduceMotion, value]);

  return (
    <motion.article
      className="hud-readout min-w-[130px] rounded-2xl px-4 py-3"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
    >
      <p className="font-heading text-2xl font-extrabold text-white">
        {displayValue}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
    </motion.article>
  );
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [bootChecked, setBootChecked] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePortfolioTab, setActivePortfolioTab] = useState<"projects" | "techstack">("projects");
  const [activeProjectFilter, setActiveProjectFilter] = useState<(typeof projectCategories)[number]>("All");
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");
  const [formFeedback, setFormFeedback] = useState("");
  const [scrambleText, setScrambleText] = useState("Hello! I'm");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: ""
  });

  const uniqueTechnologies = useMemo(
    () => Array.from(new Set(projects.flatMap((project) => project.technologies))).sort(),
    []
  );

  const portfolioMetrics = useMemo(
    () => [
      { value: projects.length, label: "Projects", suffix: "+" },
      { value: uniqueTechnologies.length, label: "Technologies", suffix: "+" },
      { value: projects.filter((project) => project.status === "Live").length, label: "Live Builds" },
      { value: projectCategories.length - 1, label: "Focus Areas" }
    ],
    [uniqueTechnologies.length]
  );

  const filteredProjects = useMemo(
    () =>
      activeProjectFilter === "All"
        ? projects
        : projects.filter((project) => project.category === activeProjectFilter),
    [activeProjectFilter]
  );

  const activeTechProjects = useMemo(
    () => (activeTech ? projects.filter((project) => project.technologies.includes(activeTech)) : []),
    [activeTech]
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      setLoaded(true);
      setShowPreloader(false);
      setBootChecked(true);
      return;
    }

    const seenPreloader = sessionStorage.getItem("portfolio_preloader_seen") === "1";
    if (seenPreloader) {
      setLoaded(true);
      setShowPreloader(false);
      setBootChecked(true);
      return;
    }

    setShowPreloader(true);
    setBootChecked(true);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    const timer = setTimeout(() => {
      target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
    }, 80);

    return () => clearTimeout(timer);
  }, [loaded, shouldReduceMotion]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");
    setFormFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Request failed");
      }

      setFormStatus("success");
      setFormFeedback("Message sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (error) {
      setFormStatus("error");
      setFormFeedback(error instanceof Error ? error.message : "Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loaded || shouldReduceMotion) {
      setScrambleText("Hello! I'm");
      return;
    }

    const target = "Hello! I'm";
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let frame = 0;

    const interval = setInterval(() => {
      frame += 1;
      const reveal = Math.min(target.length, Math.floor(frame / 4));
      const next = target
        .split("")
        .map((char, index) => {
          if (char === " ") {
            return " ";
          }
          if (index < reveal) {
            return target[index];
          }
          return charset[Math.floor(Math.random() * charset.length)];
        })
        .join("");

      setScrambleText(next);
      if (reveal >= target.length) {
        clearInterval(interval);
        setScrambleText(target);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [loaded, shouldReduceMotion]);


  useEffect(() => {
    setShowAllProjects(false);
  }, [activeProjectFilter]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollDirection(currentY > lastY ? "down" : "up");
      setScrollProgress(maxScroll > 0 ? currentY / maxScroll : 0);
      lastY = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "portfolio", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.12, 0.25, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      setIsMobileMenuOpen(false);
      return;
    }
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      window.history.replaceState(null, "", href);
      target.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("portfolio_preloader_seen", "1");
    setShowPreloader(false);
    setLoaded(true);
  };

  if (!bootChecked) {
    return null;
  }

  const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, 3);
  const backgroundMode = activeSection === "portfolio" ? "wave" : "particles";
  const sectionMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: false, amount: 0.2 },
        transition: { duration: scrollDirection === "down" ? 0.55 : 0 }
      };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      <SceneBackground mode={backgroundMode} reduceMotion={Boolean(shouldReduceMotion)} />
      <motion.div
        className="fixed left-0 top-0 z-40 h-[3px] origin-left bg-gradient-to-r from-cyan-300 via-white to-violet-300"
        style={{ scaleX: scrollProgress }}
      />

      <main className="relative z-10 min-h-screen overflow-hidden">
        <div className="ambient-grid pointer-events-none absolute inset-0 opacity-20" />

        <section id="home" className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 md:pt-10">
          <motion.header
            className="relative z-30 flex items-center justify-between"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.2 }}
          >
            <p className="font-heading text-xl font-bold tracking-tight">DevFolio.</p>
            <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className={`relative transition-colors hover:text-white ${
                    activeSection === item.href.slice(1) ? "text-white" : "text-white/70"
                  }`}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05, textShadow: "0 0 14px rgba(255,255,255,0.6)" }}
                >
                  {item.label}
                  {item.href.startsWith("#") && activeSection === item.href.slice(1) && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute -bottom-2 left-0 h-px w-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
                    />
                  )}
                </motion.a>
              ))}
            </nav>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="premium-button-ghost inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] md:hidden"
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
              <span className="flex w-5 flex-col gap-1.5">
                <span className={`h-px w-full bg-white transition ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-px w-full bg-white transition ${isMobileMenuOpen ? "opacity-0" : "opacity-80"}`} />
                <span className={`h-px w-full bg-white transition ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
              </span>
            </button>
          </motion.header>

          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                id="mobile-navigation"
                className="fixed inset-x-4 top-20 z-40 rounded-3xl border border-white/15 bg-[#080b12]/95 p-4 shadow-hero backdrop-blur-xl md:hidden"
                initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              >
                <nav className="grid gap-2" aria-label="Mobile navigation">
                  {navItems.map((item) => (
                    <a
                      key={`mobile-${item.label}`}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      onClick={(event) => handleNavClick(event, item.href)}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-14 grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.35 }}
            >
              <motion.p
                className="text-sm uppercase tracking-[0.34em] text-white/55"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 0.42 }}
              >
                {scrambleText}
              </motion.p>
              <motion.h1
                className="mt-4 max-w-2xl bg-gradient-to-r from-white via-cyan-200 to-violet-300 bg-[length:180%_180%] bg-clip-text font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-transparent sm:text-5xl md:text-6xl"
              >
                Elijah James Cubing
              </motion.h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
                I build scalable, user-focused platforms that turn complex content into structured, accessible digital
                systems.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">
                <span className="hud-readout rounded-full px-3 py-2">System Ready</span>
                <span className="hud-readout rounded-full px-3 py-2">Full Stack Developer</span>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <motion.a
                  href="#portfolio"
                  className="premium-button rounded-full bg-white px-7 py-3 font-heading text-sm font-semibold text-black transition"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04, boxShadow: "0 0 30px rgba(255,255,255,0.32), 0 10px 24px rgba(0,0,0,0.35)" }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  View Projects
                </motion.a>
                <motion.a
                  href="#contact"
                  className="premium-button-ghost rounded-full bg-white/5 px-7 py-3 font-heading text-sm font-semibold text-white backdrop-blur-sm transition"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04, boxShadow: "0 0 26px rgba(255,255,255,0.18), 0 10px 24px rgba(0,0,0,0.35)" }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                >
                  Contact Me
                </motion.a>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-white/20 bg-white/5 p-2.5 text-xs text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition hover:border-white/45 hover:text-white hover:shadow-[0_0_22px_rgba(255,255,255,0.22)]"
                  >
                    <Image
                      src={social.icon}
                      alt={social.label}
                      width={18}
                      height={18}
                      className="opacity-95 brightness-0 invert"
                    />
                  </a>
                ))}
              </div>

              <div className="mt-9 grid grid-cols-2 gap-5 sm:flex sm:flex-wrap">
                {portfolioMetrics.map((metric) => (
                  <AnimatedMetric key={metric.label} {...metric} />
                ))}
              </div>

            </motion.div>

            <motion.div
              className="mx-auto w-full max-w-md"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: shouldReduceMotion ? 0 : 0.95, delay: shouldReduceMotion ? 0 : 0.45 }}
            >
              <article className="premium-panel relative overflow-hidden rounded-[28px] p-4 shadow-hero">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/Profile.jpg"
                    alt="Portrait hero image"
                    width={760}
                    height={980}
                    className="h-[500px] w-full object-cover saturate-110 contrast-[1.06]"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                </div>

                <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-[0_0_22px_rgba(255,255,255,0.1)] backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-heading text-sm font-semibold text-white">@elijvvh_</p>
                      <p className="mt-1 text-xs text-white/75">Online and available for collaborations</p>
                    </div>
                    <a
                      href="#contact"
                      className="rounded-xl border border-white/30 bg-black/35 px-3 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(255,255,255,0.08)] transition hover:border-white/50 hover:bg-black/55 hover:shadow-[0_0_28px_rgba(255,255,255,0.16)]"
                    >
                      Let&apos;s Talk
                    </a>
                  </div>
                </div>
              </article>
            </motion.div>
          </div>

          <motion.section
            id="about"
            className="premium-panel content-panel hud-shell mt-8 rounded-3xl p-6 sm:p-8"
            {...sectionMotion}
          >
            <div className="hud-corners" />
            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="mx-auto w-full max-w-sm">
                <div className="premium-panel relative aspect-[4/5] overflow-hidden rounded-[26px] p-3 shadow-hero transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_42px_rgba(0,0,0,0.45),0_0_30px_rgba(255,255,255,0.1)]">
                  <Image
                    src="/Profile2.jpg"
                    alt="Elijah James Cubing about portrait"
                    fill
                    sizes="(max-width: 1024px) 90vw, 360px"
                    className="rounded-2xl object-cover object-top"
                  />
                </div>
              </div>

              <div>
                <p className="hud-label">About</p>
                <h2 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  Full Stack Web Developer
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
                  I&apos;m a full-stack developer focused on building structured, scalable platforms that solve real-world problems.
                  I specialize in turning complex information into organized, accessible systems where clarity, control, and reliability matter.
                  My work combines clean front-end execution with practical backend architecture to deliver fast, maintainable, and reliable applications that are built for long-term use, not just initial launch.
                </p>

                <div className="premium-panel mt-6 max-w-xl rounded-2xl p-5">
                  <p className="text-sm text-white/75">Curriculum Vitae</p>
                  <p className="mt-1 text-xs text-white/55">View or download my latest CV in PDF format.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href="/CUBING_Resume.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="premium-button inline-flex rounded-full bg-white px-5 py-2 text-xs font-semibold text-black transition hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(255,255,255,0.26)]"
                    >
                      View CV
                    </a>
                    <a
                      href="/CUBING_Resume.pdf"
                      download="CUBING_Resume.pdf"
                      className="premium-button-ghost inline-flex rounded-full bg-white/5 px-5 py-2 text-xs font-semibold text-white transition hover:border-white/45 hover:shadow-[0_0_24px_rgba(255,255,255,0.14)]"
                    >
                      Download CV
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="portfolio"
            className="premium-panel content-panel hud-shell mt-8 rounded-3xl p-6 sm:p-8"
            {...sectionMotion}
          >
            <div className="hud-corners" />
            <div className="mx-auto max-w-3xl text-center">
              <p className="hud-label justify-center">Projects</p>
              <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Portfolio Showcase
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
                Explore a selection of projects that highlight both technical execution and design precision. Each build focuses on performance, 
                scalability, and clean architecture, combining modern frontend frameworks with efficient backend systems.
              </p>
            </div>

            <div className="premium-panel relative mx-auto mt-8 flex max-w-4xl justify-center rounded-2xl p-2">
              <motion.span
                aria-hidden="true"
                className="absolute left-2 top-2 h-[calc(100%-1rem)] w-[calc(50%-0.5rem)] rounded-xl border border-white/25 bg-white/12 shadow-[0_0_28px_rgba(255,255,255,0.18)]"
                animate={{ x: activePortfolioTab === "projects" ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}
              />
              <button
                type="button"
                onClick={() => setActivePortfolioTab("projects")}
                className={`relative z-10 w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors sm:w-1/2 ${
                  activePortfolioTab === "projects"
                    ? "text-white"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => setActivePortfolioTab("techstack")}
                className={`relative z-10 w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors sm:w-1/2 ${
                  activePortfolioTab === "techstack"
                    ? "text-white"
                    : "text-white/65 hover:text-white"
                }`}
              >
                Tech Stack
              </button>
            </div>

            <div className="mt-8 min-h-[360px]">
              <AnimatePresence mode="wait">
                {activePortfolioTab === "projects" ? (
                  <>
                  <motion.div
                    key="project-filters"
                    className="mb-6 flex flex-wrap items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {projectCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveProjectFilter(category)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          activeProjectFilter === category
                            ? "border-white/55 bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.2)]"
                            : "border-white/15 bg-white/[0.03] text-white/70 hover:border-white/35 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </motion.div>
                  <motion.div
                    key={`projects-${activeProjectFilter}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
                  >
                    {displayedProjects.map((item) => (
                      <article
                        key={item.title}
                        className="group premium-panel project-card hud-shell overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_18px_32px_rgba(0,0,0,0.38),0_0_24px_rgba(255,255,255,0.1)]"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-110"
                          />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                        </div>
                        <div className="p-5">
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                            <span>{item.category}</span>
                            <span className="h-1 w-1 rounded-full bg-white/35" />
                            <span>{item.year}</span>
                            <span className="h-1 w-1 rounded-full bg-white/35" />
                            <span>{item.status}</span>
                          </div>
                          <h3 className="font-heading text-lg font-semibold text-white">{item.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-white/72">{item.summary}</p>
                          <div className="mt-4 space-y-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Problem</p>
                              <p className="mt-1 text-xs leading-relaxed text-white/62">{item.problem}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">Impact</p>
                              <p className="mt-1 text-xs leading-relaxed text-white/62">{item.impact[0]}</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {item.technologies.slice(0, 4).map((tech) => (
                                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/68">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Link
                            prefetch
                            href={`/projects/${item.slug}`}
                            className="premium-button-ghost mt-4 inline-flex rounded-full px-4 py-2 text-xs font-semibold text-white transition hover:border-white/45 hover:shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                          >
                            View Case Study
                          </Link>
                        </div>
                      </article>
                    ))}
                  </motion.div>
                  {filteredProjects.length > 3 && (
                    <div className="mt-5 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowAllProjects((prev) => !prev)}
                        className="premium-button-ghost rounded-full bg-white/[0.03] px-5 py-2 text-xs font-semibold text-white transition hover:border-white/45 hover:shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                      >
                        {showAllProjects ? "See Less" : "See More"}
                      </button>
                    </div>
                  )}
                  </>
                ) : (
                  <motion.div
                    key="techstack"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.35 }}
                    className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]"
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      {techStackGroups.map((group) => (
                        <article
                          key={group.title}
                          className="premium-panel hud-shell rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-white/35 hover:shadow-[0_0_28px_rgba(255,255,255,0.12)]"
                        >
                          <div className="hud-corners !inset-3" />
                          <h3 className="font-heading text-base font-semibold text-white">{group.title}</h3>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {group.items.map((item) => {
                              const matchCount = projects.filter((project) =>
                                project.technologies.includes(item.label)
                              ).length;
                              const isActive = activeTech === item.label;

                              return (
                                <button
                                  key={item.label}
                                  type="button"
                                  onClick={() => setActiveTech(isActive ? null : item.label)}
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                                    isActive
                                      ? "border-white/55 bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                      : "border-white/20 bg-white/10 text-white/90 hover:border-white/40 hover:bg-white/15"
                                  }`}
                                  title={`${matchCount} listed project${matchCount === 1 ? "" : "s"}`}
                                >
                                  {"icon" in item && item.icon && (
                                    <Image
                                      src={item.icon}
                                      alt={item.label}
                                      width={14}
                                      height={14}
                                      className={isActive ? "" : "opacity-95 brightness-0 invert"}
                                    />
                                  )}
                                  {item.label}
                                  <span className={isActive ? "text-black/55" : "text-white/45"}>{matchCount}</span>
                                </button>
                              );
                            })}
                          </div>
                        </article>
                      ))}
                    </div>

                    <aside className="premium-panel hud-shell rounded-2xl p-5">
                      <div className="hud-corners !inset-3" />
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">Tech Usage</p>
                      <h3 className="mt-2 font-heading text-xl font-semibold text-white">
                        {activeTech ? activeTech : "Select a stack item"}
                      </h3>
                      <div className="mt-4 space-y-3">
                        {activeTech ? (
                          activeTechProjects.length > 0 ? (
                            activeTechProjects.map((project) => (
                              <Link
                                key={project.slug}
                                href={`/projects/${project.slug}`}
                                className="block rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:border-white/30 hover:bg-white/[0.06]"
                              >
                                <p className="text-sm font-semibold text-white">{project.title}</p>
                                <p className="mt-1 text-xs text-white/55">{project.category} - {project.role}</p>
                              </Link>
                            ))
                          ) : (
                            <p className="text-sm leading-relaxed text-white/60">
                              This tool is part of the wider stack, but it is not tied to a listed project yet.
                            </p>
                          )
                        ) : (
                          <p className="text-sm leading-relaxed text-white/60">
                            Click any technology to see where it appears across the project work.
                          </p>
                        )}
                      </div>
                    </aside>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

          <motion.section
            id="contact"
            className="premium-panel content-panel hud-shell mt-8 rounded-3xl p-6 sm:p-8"
            {...sectionMotion}
          >
            <div className="hud-corners" />
            <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="space-y-6">
                <div>
                  <p className="hud-label">Contact</p>
                  <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Let&apos;s work together!
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
                    I&apos;m always open to meaningful collaborations and new opportunities. Send a message and I&apos;ll
                    get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-3 text-sm text-white/80">
                  <p>
                    <span className="mr-2 text-white/50">Email:</span>
                    ejcubing@gmail.com
                  </p>
                  <p>
                    <span className="mr-2 text-white/50">Based in:</span>
                    Philippines
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={`contact-${social.label}`}
                      href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="rounded-full border border-white/20 bg-white/[0.03] p-2.5 text-xs font-semibold text-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] transition hover:border-white/45 hover:text-white hover:shadow-[0_0_22px_rgba(255,255,255,0.2)]"
                  >
                      <Image
                        src={social.icon}
                        alt={social.label}
                        width={18}
                        height={18}
                        className="opacity-95 brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="premium-panel rounded-2xl p-5 sm:p-6"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    name="website"
                    value={formData.website}
                    onChange={(event) => setFormData((prev) => ({ ...prev, website: event.target.value }))}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <div>
                    <label htmlFor="contact-name" className="field-label">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                      placeholder="Your name"
                      className="premium-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/38 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="field-label">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                      placeholder="you@example.com"
                      className="premium-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/38 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="field-label">Subject</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      autoComplete="off"
                      value={formData.subject}
                      onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
                      placeholder="Project inquiry, collaboration, or opportunity"
                      className="premium-input mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/38 outline-none transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="field-label">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={6}
                      autoComplete="off"
                      value={formData.message}
                      onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                      placeholder="Tell me about the project, role, or problem you want to solve."
                      className="premium-input mt-2 w-full resize-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/38 outline-none transition"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="premium-button w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>

                    {formStatus === "success" && (<p className="text-sm text-emerald-300" role="status">{formFeedback}</p>)}
                    {formStatus === "error" && (<p className="text-sm text-rose-300" role="alert">{formFeedback}</p>)}
                  </div>
                </div>
              </form>
            </div>
          </motion.section>
        </section>
      </main>
    </>
  );
}




























