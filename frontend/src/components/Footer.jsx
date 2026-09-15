import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, ArrowUp, Send, Sparkles } from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function Footer({ profile }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!profile?.email) return;
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="py-20 bg-[#0f1116] border-t border-white/[0.06] relative scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Contact Banner with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 border-blue-500/20"
        >
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Get in Touch
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Let's engineer reliable, high-impact backend systems.
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Open to full-time Python backend roles, API architecture contracts, and production AI engineering collaborations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile?.email && (
              <>
                <a
                  href={`mailto:${profile.email}`}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-150 flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </a>

                <button
                  onClick={handleCopy}
                  className="px-4 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#94a3b8] hover:text-white hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] font-medium text-sm transition-all duration-150 flex items-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Bottom Colophon */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#64748b]">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-semibold text-white">
              Shubham Bhatt — Software Engineer
            </p>
            <p>
              Designed with bespoke glassmorphism • Built on FastAPI & React
            </p>
          </div>

          <div className="flex items-center gap-4">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 hover:scale-110 active:scale-95 transition-all duration-150 flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 hover:scale-110 active:scale-95 transition-all duration-150 flex items-center gap-1.5"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer"
              title="Return to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
