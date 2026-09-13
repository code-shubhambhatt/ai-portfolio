import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Sparkles, Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Github } from './Icons';

export default function Projects({ projects = [] }) {
  const [filter, setFilter] = useState('all');

  const filteredProjects = projects.filter((p) => {
    if (filter === 'featured') return p.featured;
    return true;
  });

  return (
    <section id="projects" className="py-20 sm:py-28 border-b border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Selected Engineering Systems
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl">
              Production architectures, backend services, and multi-tenant applications built with Python and modern data stores.
            </p>
          </div>

          {/* Filter Pills with Sliding layoutId Slider */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`relative px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all' ? 'text-white' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {filter === 'all' && (
                <motion.div
                  layoutId="projectsFilterSlider"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">All Systems ({projects.length})</span>
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`relative px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'featured' ? 'text-white' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {filter === 'featured' && (
                <motion.div
                  layoutId="projectsFilterSlider"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">Featured Highlights</span>
            </button>
          </div>
        </motion.div>

        {/* Bento Grid with Pure CSS Smooth Transitions (Zero Scroll Jitter) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj, index) => {
            const isFirst = index === 0 && filter === 'all';
            return (
              <div
                key={proj.id}
                className={`glass-card rounded-2xl p-7 flex flex-col justify-between hover:-translate-y-1.5 hover:border-blue-500/40 transition-transform transition-colors duration-200 ease-out group relative overflow-hidden ${
                  isFirst ? 'md:col-span-2 bg-gradient-to-br from-[#1c1f28]/95 via-[#181b22]/90 to-[#14161d]/90 border-blue-500/20' : ''
                }`}
              >
                {/* Subtle card glow on hover */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/[0.04] rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/[0.12] transition-colors duration-300" />

                <div className="space-y-4">
                  {/* Top metadata */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors capitalize">
                          {proj.name}
                        </h3>
                        {proj.featured && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                            Featured System
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-blue-400/80 font-medium">
                        {proj.technologies && proj.technologies.slice(0, 3).join(' • ')}
                      </p>
                    </div>

                    {/* Quick Link Arrow */}
                    {(proj.demo_url || proj.github_url) && (
                      <a
                        href={proj.demo_url || proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-white/[0.04] group-hover:bg-blue-600 group-hover:text-white text-[#94a3b8] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm"
                        title="View Project"
                      >
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    {proj.short_description || proj.description}
                  </p>

                  {/* Tech stack badges */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.03] text-[#cbd5e1] border border-white/[0.06] hover:border-blue-400/30 hover:bg-blue-600/10 hover:text-white transition-colors duration-150 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Link Buttons */}
                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-white/[0.06]">
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white hover:translate-x-0.5 transition-all duration-150"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Source Code</span>
                    </a>
                  )}

                  {proj.demo_url && (
                    <a
                      href={proj.demo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors ml-auto group-hover:underline underline-offset-4"
                    >
                      <span>Live Deployment</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
