import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, CheckCircle2, Play, Award, Sparkles, BarChart3, Database } from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/salesData';

export const PresentationViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slide = PRESENTATION_SLIDES[currentSlideIndex];
  const totalSlides = PRESENTATION_SLIDES.length;

  return (
    <div className="space-y-6">
      {/* Presentation Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
            <Presentation className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Internship Mini Project Presentation Deck
            </h2>
            <p className="text-xs text-slate-400">
              Interactive slides for mentor review & final evaluation
            </p>
          </div>
        </div>

        {/* Slide Counter Controls */}
        <div className="flex items-center space-x-3">
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-medium">
            Slide <span className="text-white font-bold">{currentSlideIndex + 1}</span> of {totalSlides}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1))}
              disabled={currentSlideIndex === totalSlides - 1}
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Main Slide Card */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800/90 min-h-[420px] flex flex-col justify-between relative overflow-hidden bg-slate-900/90 shadow-2xl">
        {/* Background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div>
          {/* Slide Tag */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Slide {slide.id}: {slide.type}
            </span>
          </div>

          {/* Slide Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2 leading-tight">
            {slide.title}
          </h1>

          <p className="text-sm sm:text-base font-semibold text-blue-400 mb-8">
            {slide.subtitle}
          </p>

          {/* Bullet Points */}
          <div className="space-y-4 max-w-4xl">
            {slide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start space-x-3.5 group">
                <div className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mt-1 shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Footer */}
        <div className="mt-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>SalesInsight - Sales Data Analysis Mini Project</span>
          <span>Prepared for Internship Submission</span>
        </div>
      </div>

      {/* Slide Thumbnails Selector */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {PRESENTATION_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all ${
              currentSlideIndex === idx
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="block text-[10px] opacity-75">Slide {s.id}</span>
            <span className="truncate block mt-0.5">{s.title.split(':')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
