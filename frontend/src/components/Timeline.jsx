import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2, Award } from 'lucide-react';

export default function Timeline({ experiences = [], educations = [] }) {
  const [tab, setTab] = useState('experience');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="experience" className="py-20 sm:py-28 border-b border-white/[0.06] relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header & Segmented Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Award className="w-3.5 h-3.5" />
              <span>Career & Background</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Experience & Education
            </h2>
            <p className="text-sm sm:text-base text-[#94a3b8]">
              Track record of backend development, performance optimization, and academic training.
            </p>
          </div>

          {/* Animated Tab Slider */}
          <div className="inline-flex rounded-2xl bg-white/[0.03] border border-white/[0.08] p-1.5 self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setTab('experience')}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                tab === 'experience' ? 'text-white' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {tab === 'experience' && (
                <motion.div
                  layoutId="timelineTabSlider"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Briefcase className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Work Experience ({experiences.length})</span>
            </button>

            <button
              onClick={() => setTab('education')}
              className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                tab === 'education' ? 'text-white' : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              {tab === 'education' && (
                <motion.div
                  layoutId="timelineTabSlider"
                  className="absolute inset-0 bg-blue-600 rounded-xl shadow-md shadow-blue-600/25"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <GraduationCap className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Education ({educations.length})</span>
            </button>
          </div>
        </motion.div>

        {/* Content with Animated Presence */}
        <AnimatePresence mode="wait">
          {tab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="glass-card rounded-2xl p-7 space-y-5 hover:-translate-y-1 hover:border-blue-500/30 transition-transform transition-colors duration-200 ease-out"
                >
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {exp.role}
                        </h3>
                        {exp.employment_type && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                            {exp.employment_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-blue-400">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#94a3b8]">
                      <span className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-xl border border-white/[0.06]">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formatDate(exp.start_date)} — {exp.current ? 'Present' : formatDate(exp.end_date)}</span>
                      </span>
                      {exp.location && (
                        <span className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-xl border border-white/[0.06]">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span>{exp.location}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {exp.description && (
                    <p className="text-sm text-[#cbd5e1] leading-relaxed">
                      {exp.description}
                    </p>
                  )}

                  {/* Responsibilities Bullets */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {exp.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#94a3b8] leading-relaxed group">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 group-hover:text-emerald-400 transition-colors" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tech Pills */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.06]">
                      {exp.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.03] text-[#94a3b8] hover:text-white border border-white/[0.06] hover:border-blue-400/30 transition-colors duration-150 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {tab === 'education' && (
            <motion.div
              key="education"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6"
            >
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="glass-card rounded-2xl p-7 space-y-5 hover:-translate-y-1 hover:border-blue-500/30 transition-transform transition-colors duration-200 ease-out"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {edu.title}
                      </h3>
                      <p className="text-sm font-semibold text-blue-400">
                        {edu.institution}
                      </p>
                      {edu.specialization && (
                        <div className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 font-medium">
                          {edu.specialization}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#94a3b8] font-mono">
                      <span className="flex items-center gap-1.5 bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.06]">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        {formatDate(edu.start_date)} — {formatDate(edu.completion_date)}
                      </span>
                      {edu.score && (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold">
                          {edu.score} {edu.score_type?.toUpperCase() || 'CGPA'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coursework */}
                  {edu.subjects && edu.subjects.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                        Core Academic Coursework:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.subjects.map((subj, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.03] text-[#cbd5e1] border border-white/[0.06]"
                          >
                            {subj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
