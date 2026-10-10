'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Sparkles,
  Download,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  User,
  GraduationCap,
  Briefcase,
  Layers,
  Wand2,
  Printer,
  Eye,
} from 'lucide-react';

export default function ResumeMakerPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    personal: {
      fullName: user?.name || 'Alex Chen',
      email: user?.email || 'student@btech.edu',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      linkedin: 'https://linkedin.com/in/alexchen',
      github: 'https://github.com/alexchen',
    },
    summary:
      'Motivated B.Tech student targeting Software Development & Machine Learning roles. Solid foundations in Data Structures, Algorithms, Python, and Fullstack architecture. Demonstrated track record building responsive web applications and end-to-end predictive analytics pipelines.',
    education: [
      {
        institution: user?.college || 'National Institute of Technology',
        degree: `B.Tech in ${user?.department || 'Artificial Intelligence'}`,
        year: '2023 - 2027',
        cgpa: '8.8 / 10.0',
      },
    ],
    skills: ['Python', 'C++', 'JavaScript', 'TypeScript', 'Next.js', 'React', 'SQL', 'PyTorch', 'Git', 'Docker'],
    projects: [
      {
        title: 'EduCareer AI - AI-Powered Personalized Learning & Placement OS',
        technologies: 'Next.js, Node.js, Prisma SQLite, Recharts, Gemini AI',
        bullet1: 'Engineered an interactive student learning OS serving 50+ programming courses and B.Tech branch roadmaps.',
        bullet2: 'Implemented instant technical quiz evaluation engine and ATS resume analyzer scoring 1,000+ keywords.',
      },
      {
        title: 'Predictive Campus Placement Analytics Pipeline',
        technologies: 'Python, Scikit-Learn, Pandas, Streamlit',
        bullet1: 'Trained and evaluated Gradient Boosting models across student academic metrics, reaching 91% predictive accuracy.',
        bullet2: 'Automated feature engineering and model serving with sub-100ms inference latency.',
      },
    ],
    certifications: [
      'DeepLearning.AI Machine Learning Specialization (Coursera)',
      'HackerRank Problem Solving 5-Star Badge',
    ],
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern-ats');
  const [skillInput, setSkillInput] = useState('');

  // AI Assistant: Generate Summary
  const handleAiSummary = () => {
    const dept = user?.department || 'Engineering';
    const goal = user?.careerGoal || 'Software';
    setFormData((prev) => ({
      ...prev,
      summary: `Proactive and analytically driven ${dept} engineering student passionate about ${goal} innovation. Proven expertise in data structures, algorithms, and modular fullstack systems. Seeking to leverage strong problem-solving skills in high-impact product engineering teams.`,
    }));
  };

  // AI Assistant: Suggest Skills
  const handleSuggestSkills = () => {
    const suggested = ['FastAPI', 'REST APIs', 'PostgreSQL', 'TailwindCSS', 'Redis', 'Unit Testing'];
    setFormData((prev) => ({
      ...prev,
      skills: Array.from(new Set([...prev.skills, ...suggested])),
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (s) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== s),
    }));
  };

  const handleSaveResume = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${formData.personal.fullName} - ATS Resume`,
          targetRole: user?.careerGoal || 'Software Developer',
          templateId: selectedTemplate,
          resumeData: formData,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-container py-10">
      
      {/* Tool Navigation Switcher */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <a
          href="/resume-maker"
          className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 flex items-center gap-2"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>ATS Resume Maker</span>
        </a>
        <a
          href="/resume-analyser"
          className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center gap-2 transition-all hover:border-emerald-500/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>ATS Resume Analyser</span>
        </a>
        <a
          href="/resume-tools"
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900/60 border border-white/5 text-slate-500 hover:text-slate-300"
        >
          <span>Tools Overview</span>
        </a>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge badge-indigo text-xs">ATS-Friendly</span>
            <span className="badge badge-emerald text-xs">Single Column Format</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            ATS Resume Maker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build recruiter-approved single-column resumes with live preview and AI bullet point enhancement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/resume-analyser"
            className="btn-secondary py-2 px-3 text-xs"
          >
            ATS Analyser →
          </a>
          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="btn-secondary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : saveSuccess ? 'Saved ✓' : 'Save Resume'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export / Print PDF</span>
          </button>
        </div>
      </div>

      {/* 2-Column Split: Form (Left) & Real-Time ATS Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Input Sections Form */}
        <div className="space-y-6">
          
          {/* Section 1: Contact Details */}
          <div className="glass-panel p-6 bg-slate-900/60 border border-white/10">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              1. Personal & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  value={formData.personal.fullName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, fullName: e.target.value },
                    })
                  }
                  className="form-input text-xs py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={formData.personal.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, email: e.target.value },
                    })
                  }
                  className="form-input text-xs py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Phone Number</label>
                <input
                  type="text"
                  value={formData.personal.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, phone: e.target.value },
                    })
                  }
                  className="form-input text-xs py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Location (City, Country)</label>
                <input
                  type="text"
                  value={formData.personal.location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, location: e.target.value },
                    })
                  }
                  className="form-input text-xs py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.personal.linkedin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, linkedin: e.target.value },
                    })
                  }
                  className="form-input text-xs py-2 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">GitHub / Portfolio URL</label>
                <input
                  type="text"
                  value={formData.personal.github}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, github: e.target.value },
                    })
                  }
                  className="form-input text-xs py-2 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Summary */}
          <div className="glass-panel p-6 bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                2. Professional Objective / Summary
              </h2>
              <button
                type="button"
                onClick={handleAiSummary}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI Generate</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="form-textarea text-xs leading-relaxed"
            />
          </div>

          {/* Section 3: Technical Skills */}
          <div className="glass-panel p-6 bg-slate-900/60 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                3. Technical Skills
              </h2>
              <button
                type="button"
                onClick={handleSuggestSkills}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-purple-300"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Suggest Skills</span>
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add skill (e.g. PyTorch, Docker, SQL)..."
                className="form-input text-xs py-1.5 flex-1"
              />
              <button type="submit" className="btn-secondary py-1.5 px-3 text-xs font-semibold">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap gap-1.5">
              {formData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 border border-white/10 flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Projects */}
          <div className="glass-panel p-6 bg-slate-900/60 border border-white/10">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              4. Key Academic & Capstone Projects
            </h2>

            {formData.projects.map((proj, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 mb-4 space-y-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Project Title</label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="form-input text-xs py-1.5 mt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Technologies Used</label>
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].technologies = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="form-input text-xs py-1.5 mt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Bullet Point 1 (Action Verb + Impact)</label>
                  <input
                    type="text"
                    value={proj.bullet1}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].bullet1 = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="form-input text-xs py-1.5 mt-0.5"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase">Bullet Point 2 (Metrics / Result)</label>
                  <input
                    type="text"
                    value={proj.bullet2}
                    onChange={(e) => {
                      const updated = [...formData.projects];
                      updated[idx].bullet2 = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="form-input text-xs py-1.5 mt-0.5"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Real-Time Clean ATS Document Preview */}
        <div className="sticky top-24">
          <div className="flex items-center justify-between pb-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Real-Time ATS Document Preview
            </span>
            <span className="text-[11px] text-emerald-400 font-bold">100% ATS Compatible</span>
          </div>

          {/* White Paper Sheet Preview (Printable) */}
          <div
            id="printable-resume"
            className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-2xl font-sans text-xs leading-normal select-text"
            style={{ minHeight: '850px' }}
          >
            {/* Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900">
              <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-950">
                {formData.personal.fullName || 'YOUR NAME'}
              </h1>
              <div className="text-[11px] text-slate-700 mt-1 flex flex-wrap items-center justify-center gap-2">
                <span>{formData.personal.email}</span>
                <span>•</span>
                <span>{formData.personal.phone}</span>
                <span>•</span>
                <span>{formData.personal.location}</span>
              </div>
              <div className="text-[10px] text-slate-600 mt-1 flex flex-wrap items-center justify-center gap-3">
                <span className="font-semibold text-indigo-700">{formData.personal.linkedin}</span>
                <span>•</span>
                <span className="font-semibold text-indigo-700">{formData.personal.github}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 pb-3 border-b border-slate-300">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 mb-1">
                Professional Summary
              </h2>
              <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                {formData.summary}
              </p>
            </div>

            {/* Education */}
            <div className="mt-4 pb-3 border-b border-slate-300">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 mb-1.5">
                Education
              </h2>
              {formData.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px]">
                  <div>
                    <strong className="text-slate-950">{edu.institution}</strong>
                    <div className="text-slate-700">{edu.degree}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-800">{edu.year}</span>
                    <div className="font-semibold text-slate-900">CGPA: {edu.cgpa}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Technical Skills */}
            <div className="mt-4 pb-3 border-b border-slate-300">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 mb-1.5">
                Technical Skills
              </h2>
              <div className="text-[11px] text-slate-800 leading-relaxed">
                <strong className="text-slate-950">Languages & Tools: </strong>
                {formData.skills.join(', ')}
              </div>
            </div>

            {/* Projects */}
            <div className="mt-4 pb-3 border-b border-slate-300">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 mb-2">
                Projects
              </h2>
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="mb-3 text-[11px]">
                  <div className="flex justify-between font-bold text-slate-950">
                    <span>{proj.title}</span>
                    <span className="font-semibold text-slate-600 text-[10px]">{proj.technologies}</span>
                  </div>
                  <ul className="list-disc pl-4 mt-1 text-slate-800 space-y-0.5">
                    {proj.bullet1 && <li>{proj.bullet1}</li>}
                    {proj.bullet2 && <li>{proj.bullet2}</li>}
                  </ul>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 mb-1.5">
                Certifications & Achievements
              </h2>
              <ul className="list-disc pl-4 text-[11px] text-slate-800 space-y-0.5">
                {formData.certifications.map((cert, idx) => (
                  <li key={idx}>{cert}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
