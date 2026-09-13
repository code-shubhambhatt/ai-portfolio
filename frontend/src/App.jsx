import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Timeline from './components/Timeline';
import Footer from './components/Footer';
import AiChatWidget from './components/AiChatWidget';
import {
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchExperience,
  fetchEducation,
} from './services/api';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    async function loadPortfolioData() {
      try {
        setLoading(true);
        const [profData, projData, skillsData, expData, eduData] = await Promise.all([
          fetchProfile().catch((e) => {
            console.warn('Profile fetch failed:', e);
            return null;
          }),
          fetchProjects().catch((e) => {
            console.warn('Projects fetch failed:', e);
            return [];
          }),
          fetchSkills().catch((e) => {
            console.warn('Skills fetch failed:', e);
            return [];
          }),
          fetchExperience().catch((e) => {
            console.warn('Experience fetch failed:', e);
            return [];
          }),
          fetchEducation().catch((e) => {
            console.warn('Education fetch failed:', e);
            return [];
          }),
        ]);

        setProfile(profData);
        setProjects(projData || []);
        setSkills(skillsData || []);
        setExperiences(expData || []);
        setEducations(eduData || []);
      } catch (err) {
        console.error('Data load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#181a1f] text-white flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        <p className="text-sm text-[#9aa1af]">Loading portfolio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12141a] bg-dot-pattern text-[#f1f5f9] flex flex-col relative selection:bg-blue-500/20 selection:text-white">
      <Navbar profile={profile} onOpenChat={() => setIsChatOpen(true)} />


      <main className="flex-1">
        <Hero profile={profile} onOpenChat={() => setIsChatOpen(true)} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Timeline experiences={experiences} educations={educations} />
      </main>

      <Footer profile={profile} />

      {/* Floating AI Chat Assistant - Accessible Everywhere */}
      <AiChatWidget isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  );
}
