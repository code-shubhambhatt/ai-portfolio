import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Database, Terminal, Cpu, Wrench, Layout, CheckCircle2, ShieldCheck } from 'lucide-react';

const CATEGORY_META = {
  'backend': { icon: Server, color: 'text-blue-400' },
  'databases & orm': { icon: Database, color: 'text-indigo-400' },
  'databases': { icon: Database, color: 'text-indigo-400' },
  'programming languages': { icon: Terminal, color: 'text-emerald-400' },
  'languages': { icon: Terminal, color: 'text-emerald-400' },
  'frontend': { icon: Layout, color: 'text-cyan-400' },
  'ai': { icon: Cpu, color: 'text-purple-400' },
  'ai & ml': { icon: Cpu, color: 'text-purple-400' },
  'cloud & infrastructure': { icon: Wrench, color: 'text-amber-400' },
  'cloud & devops': { icon: Wrench, color: 'text-amber-400' },
  'testing & engineering': { icon: ShieldCheck, color: 'text-teal-400' },
};

export default function Skills({ skills = [] }) {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Group skills by category
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill.name);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  // Filter groups by category AND search query
  const displayedGroups = Object.entries(grouped)
    .filter(([cat]) => selectedFilter === 'All' || cat.toLowerCase() === selectedFilter.toLowerCase())
    .map(([cat, items]) => {
      const filteredItems = searchQuery.trim()
        ? items.filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase().trim()))
        : items;
      return [cat, filteredItems];
    })
    .filter(([_, items]) => items.length > 0);

  return (
    <section id="skills" className="py-20 sm:py-28 border-b border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Technical Matrix</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Skills & Competencies
              </h2>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-xl">
                Languages, frameworks, databases, and engineering tools applied across production repositories.
              </p>
            </div>

            {/* Quick Skill Search Input */}
            <div className="relative sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill (e.g. FastAPI, Docker)..."
                className="w-full bg-[#16181f] border border-white/[0.1] focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-[#64748b] focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Filter Pills with layoutId Slider */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.08] self-start pt-2">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                selectedFilter === 'All' ? 'text-white' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {selectedFilter === 'All' && (
                <motion.div
                  layoutId="skillsCategorySlider"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">All ({skills.length})</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors capitalize cursor-pointer ${
                  selectedFilter === cat ? 'text-white' : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {selectedFilter === cat && (
                  <motion.div
                    layoutId="skillsCategorySlider"
                    className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Categories Grid with Smooth Responsive Transitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedGroups.length === 0 ? (
            <div className="col-span-full text-center py-12 text-[#94a3b8] text-sm">
              No skills matching "{searchQuery}". Try searching for another skill.
            </div>
          ) : (
            displayedGroups.map(([category, items]) => {
              const meta = CATEGORY_META[category.toLowerCase()] || {
                icon: Terminal,
                color: 'text-blue-400',
              };
              const Icon = meta.icon;

              return (
                <div
                  key={category}
                  className="glass-card rounded-2xl p-6 space-y-4 hover:-translate-y-1 hover:border-blue-500/30 transition-transform transition-colors duration-200 ease-out group"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl bg-white/[0.04] ${meta.color} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight capitalize">
                        {category}
                      </h3>
                    </div>
                    <span className="text-[11px] text-[#64748b] font-medium">
                      {items.length} {items.length === 1 ? 'skill' : 'skills'}
                    </span>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {items.map((skillName, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-xl bg-white/[0.03] text-[#cbd5e1] border border-white/[0.06] hover:border-blue-400/40 hover:text-white hover:bg-blue-600/[0.12] hover:scale-105 hover:-translate-y-0.5 transition-all duration-150 cursor-default"
                      >
                        {skillName}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
