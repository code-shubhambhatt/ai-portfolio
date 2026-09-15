import React, { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Menu, X } from 'lucide-react';
import { Github, Linkedin } from './Icons';

export default function Navbar({ profile, onOpenChat }) {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState('about');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['about', 'projects', 'skills', 'experience', 'contact'];
          const scrollPosition = window.scrollY + 220;

          for (const section of sections) {
            const el = document.getElementById(section);
            if (el) {
              const top = el.offsetTop;
              const height = el.offsetHeight;
              if (scrollPosition >= top && scrollPosition < top + height) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    // Allow drawer close animation to start before triggering smooth scroll
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#12141a]/85 border-b border-white/[0.06] transition-colors">
      {/* Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-teal-400 z-50"
      />

      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Monogram */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            SB
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors tracking-tight">
              Shubham Bhatt
            </span>
            <span className="text-[11px] text-[#94a3b8] tracking-tight">
              Backend & AI Engineer
            </span>
          </div>
        </a>

        {/* Center: Interactive Nav Links with Active Indicator (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full p-1 text-xs">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-150 ${
                  isActive
                    ? 'text-white bg-white/[0.08] border border-white/[0.08] shadow-sm'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-teal-500/20 hover:from-blue-600/30 hover:to-teal-500/30 border border-blue-500/30 text-blue-300 text-xs font-medium hover:scale-105 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-blue-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Ask AI</span>
            <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
              ⌘K
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-white/[0.08]">
            {profile?.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06] hover:scale-110 active:scale-95 transition-all duration-150"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06] hover:scale-110 active:scale-95 transition-all duration-150"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#94a3b8] hover:text-white bg-white/[0.03] border border-white/[0.08] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 border-b border-white/[0.08] bg-[#12141a]/98 backdrop-blur-2xl overflow-hidden px-6 py-4 space-y-3 shadow-2xl shadow-black/80"
          >
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    activeSection === link.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-[#94a3b8] hover:text-white bg-white/[0.02]'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-[#64748b]">Connect with Shubham:</span>
              <div className="flex items-center gap-2">
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-[#94a3b8] hover:text-white bg-white/[0.04]"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg text-[#94a3b8] hover:text-white bg-white/[0.04]"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
