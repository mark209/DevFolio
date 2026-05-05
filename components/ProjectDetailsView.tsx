"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { type Project } from "@/lib/projects";

type ProjectDetailsViewProps = {
  project: Project;
};

export function ProjectDetailsView({ project }: ProjectDetailsViewProps) {
  const hasLiveDemo = project.liveDemoUrl && project.liveDemoUrl !== "#";
  const hasGithub = project.githubUrl && project.githubUrl !== "#";

  return (
    <main className="relative min-h-screen overflow-hidden px-6 pb-16 pt-8 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(59,130,246,0.18),transparent_44%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.14),transparent_38%)]" />
      <div className="ambient-grid pointer-events-none absolute inset-0 opacity-15" />

      <section className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center gap-3 text-sm text-white/65"
        >
          <Link
            href="/#portfolio"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-white transition hover:border-white/25"
          >
            Back
          </Link>
          <span>Projects</span>
          <span className="text-white/30">/</span>
          <span className="text-white">{project.title}</span>
        </motion.div>

        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <p className="hud-label">Case File</p>
            <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              {[project.category, project.role, project.year, project.status].map((item) => (
                <span key={item} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1">
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{project.description}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 38 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="premium-panel hud-shell overflow-hidden rounded-3xl p-3 shadow-hero"
          >
            <div className="hud-corners" />
            <div className="relative overflow-hidden rounded-2xl">
              <Image src={project.detailImage} alt={project.title} width={1200} height={820} className="h-auto w-full object-cover" priority />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="hud-readout rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{project.technologies.length}</p>
                <p className="mt-1 text-sm text-white/65">Total Technologies</p>
              </article>
              <article className="hud-readout rounded-2xl p-4">
                <p className="text-2xl font-bold text-white">{project.features.length}</p>
                <p className="mt-1 text-sm text-white/65">Key Features</p>
              </article>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              {hasLiveDemo ? (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Live Demo
                </a>
              ) : (
                <span className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/45">
                  Demo unavailable
                </span>
              )}
              {hasGithub && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35"
                >
                  GitHub
                </a>
              )}
            </div>

            <div className="mt-7">
              <h2 className="font-heading text-xl font-semibold text-white">Project Outcomes</h2>
              <div className="mt-4 space-y-3">
                {project.outcomes.map((outcome) => (
                  <motion.div
                    key={outcome}
                    whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.07)" }}
                  className="hud-readout rounded-xl px-4 py-3 text-sm text-white/72"
                  >
                    {outcome}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <h2 className="font-heading text-xl font-semibold text-white">Technologies Used</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.article
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="premium-panel hud-shell rounded-2xl p-6"
          >
            <div className="hud-corners !inset-3" />
            <h2 className="font-heading text-2xl font-semibold text-white">Key Features</h2>
            <ul className="mt-5 space-y-3">
              {project.features.map((feature) => (
                <motion.li
                  key={feature}
                  whileHover={{ x: 6, scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-white/75"
                >
                  {feature}
                </motion.li>
              ))}
            </ul>
          </motion.article>
        </div>
      </section>
    </main>
  );
}
