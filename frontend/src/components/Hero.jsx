import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Copy, Check, Terminal, Database, Cpu, Zap } from 'lucide-react';

export default function Hero({ profile, onOpenChat }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="about" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-white/[0.06] overflow-hidden">
      {/* Static Ambient Floating Gradient Glows (Lightweight, zero GPU repaint) */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[550px] sm:w-[850px] h-[340px] bg-gradient-to-b from-blue-600/15 via-indigo-600/8 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-1/4 w-[450px] sm:w-[700px] h-[300px] bg-gradient-to-b from-teal-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Availability Badge & Location */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#94a3b8] shadow-sm hover:border-emerald-500/30 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-white font-medium">Available for opportunities</span>
              <span className="text-white/20">•</span>
              <span>Python & AI Backend</span>
              <span className="text-white/20">•</span>
              <span>UTC+05:30</span>
            </div>
          </motion.div>

          {/* Hero Headline & Bio */}
          <motion.div variants={itemVariants} className="space-y-6 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Building scalable{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
                backend systems
              </span>{' '}
              & production AI pipelines.
            </h1>

            <p className="text-lg sm:text-xl text-[#94a3b8] leading-relaxed max-w-3xl font-normal">
              Hi, I'm <span className="text-white font-medium">Shubham Bhatt</span> — a Python Developer specializing in high-throughput RESTful services, clean PostgreSQL state models, and LLM-driven inference workflows with FastAPI and Groq.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-2">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-transform transition-colors duration-200 flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Engineering Systems</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={onOpenChat}
              className="px-5 py-3 rounded-xl bg-[#1a1d25] hover:bg-[#222631] border border-white/[0.1] hover:border-blue-500/40 text-white font-medium text-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform transition-colors duration-200 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Chat with AI Assistant</span>
            </button>

            {profile?.email && (
              <button
                onClick={handleCopyEmail}
                className="px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-[#94a3b8] hover:text-white font-medium text-sm hover:-translate-y-0.5 active:translate-y-0 transition-transform transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                title="Copy Email Address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied to clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </>
                )}
              </button>
            )}
          </motion.div>

          {/* Highlights Bento Strip */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
          >
            <div
              className="glass-card rounded-2xl p-5 space-y-2 cursor-default group hover:-translate-y-1 hover:border-blue-500/30 transition-transform transition-colors duration-200"
            >
              <div className="flex items-center gap-2 text-blue-400">
                <Terminal className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Backend Core</span>
              </div>
              <p className="text-sm font-bold text-white">FastAPI, Flask & Django</p>
              <p className="text-xs text-[#64748b]">Production REST APIs & Auth</p>
            </div>

            <div
              className="glass-card rounded-2xl p-5 space-y-2 cursor-default group hover:-translate-y-1 hover:border-indigo-500/30 transition-transform transition-colors duration-200"
            >
              <div className="flex items-center gap-2 text-indigo-400">
                <Database className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Databases</span>
              </div>
              <p className="text-sm font-bold text-white">PostgreSQL & MongoDB</p>
              <p className="text-xs text-[#64748b]">Alembic & SQLAlchemy ORM</p>
            </div>

            <div
              className="glass-card rounded-2xl p-5 space-y-2 cursor-default group hover:-translate-y-1 hover:border-teal-500/30 transition-transform transition-colors duration-200"
            >
              <div className="flex items-center gap-2 text-teal-400">
                <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">AI Systems</span>
              </div>
              <p className="text-sm font-bold text-white">LLM Orchestration</p>
              <p className="text-xs text-[#64748b]">Groq, Prompting & JD Match</p>
            </div>

            <div
              className="glass-card rounded-2xl p-5 space-y-2 cursor-default group hover:-translate-y-1 hover:border-emerald-500/30 transition-transform transition-colors duration-200"
            >
              <div className="flex items-center gap-2 text-emerald-400">
                <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Optimization</span>
              </div>
              <p className="text-sm font-bold text-white">~30% Faster Response</p>
              <p className="text-xs text-[#64748b]">Indexed Queries & Caching</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
