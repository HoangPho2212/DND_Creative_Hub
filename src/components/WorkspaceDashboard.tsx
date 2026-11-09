/**
 * @file src/components/WorkspaceDashboard.tsx
 * Screen 02 · Main Workspace Dashboard (58 / 42 split view)
 */

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Pause,
  Play,
  Plus,
  Cloud,
  Lock,
  RotateCw,
  ExternalLink,
  Music2,
  Image as ImageIcon,
  Ban,
  Sparkles,
  Volume2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  HubViewState,
  DashboardTab,
  MediaTab,
} from '../contracts/sessionContract';
import { formatRemainingTime, formatTimeHHMM } from '../utils/formatters';

interface WorkspaceDashboardProps {
  viewState: HubViewState;
  onTogglePause: () => void;
  onExtendSession: (minutes?: number) => void;
  onAddNote: (text: string) => boolean;
  onNavigate: (url: string) => boolean;
  onChangeTab: (tab: DashboardTab) => void;
  onChangeMediaTab: (tab: MediaTab) => void;
  onCompleteSession: () => void;
  onToggleFullscreen?: () => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  viewState,
  onTogglePause,
  onExtendSession,
  onAddNote,
  onNavigate,
  onChangeTab,
  onChangeMediaTab,
  onCompleteSession,
  onToggleFullscreen,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [currentTime, setCurrentTime] = useState(formatTimeHHMM());
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  // Live clock in top right
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(formatTimeHHMM());
    }, 10000);
    return () => clearInterval(clockInterval);
  }, []);

  const handleNoteSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newNoteText.trim()) {
      onAddNote(newNoteText.trim());
      setNewNoteText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNoteSubmit();
    }
  };

  // Circular SVG ring calculation
  const total = viewState.initialDurationSeconds || 7200;
  const current = viewState.remainingSeconds;
  const progressPercent = Math.max(0, Math.min(1, current / total));
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressPercent * circumference;

  // Extract Desk initials (e.g. "Desk 04" -> "D4") matching prototype
  const getDeskBadge = (id: string): string => {
    if (!id) return 'D4';
    const match = id.match(/([A-Za-z]).*?(\d+)/);
    if (match) {
      const num = parseInt(match[2], 10);
      return `${match[1].toUpperCase()}${num}`;
    }
    return id.slice(0, 2).toUpperCase();
  };
  const deskShort = getDeskBadge(viewState.deskId);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white border-b border-slate-border px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-soft flex items-center justify-center text-emerald">
            <Wifi className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold tracking-tight text-slate-text text-sm sm:text-base">
            DND CREATIVE HUB
          </span>
        </div>

        {/* Tab Switcher */}
        <nav className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-pill text-xs font-medium text-slate-muted">
          <button
            onClick={() => onChangeTab('workspace')}
            className={`px-4 py-1.5 rounded-pill transition-all ${
              viewState.activeTab === 'workspace'
                ? 'bg-white text-slate-text shadow-sm font-semibold'
                : 'hover:text-slate-text'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onChangeTab('session_log')}
            className={`px-4 py-1.5 rounded-pill transition-all ${
              viewState.activeTab === 'session_log'
                ? 'bg-white text-slate-text shadow-sm font-semibold'
                : 'hover:text-slate-text'
            }`}
          >
            Session log
          </button>
          <button
            onClick={() => onChangeTab('network')}
            className={`px-4 py-1.5 rounded-pill transition-all ${
              viewState.activeTab === 'network'
                ? 'bg-white text-slate-text shadow-sm font-semibold'
                : 'hover:text-slate-text'
            }`}
          >
            Network
          </button>
        </nav>

        {/* Right Status Badges */}
        <div className="flex items-center space-x-3 text-xs sm:text-sm">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-soft text-emerald-dark font-medium rounded-pill border border-emerald-border/40">
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide">
              {viewState.isRunning ? 'FOCUS ACTIVE' : 'PAUSED'}
            </span>
          </div>

          <div className="font-mono text-slate-muted text-xs sm:text-sm hidden sm:block">
            {currentTime}
          </div>

          {/* Fullscreen Kiosk Mode Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={viewState.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-1.5 text-slate-muted hover:text-slate-text hover:bg-slate-100 rounded-lg transition-colors"
            >
              {viewState.isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-emerald" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          )}

          <div
            title={viewState.deskId}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-border flex items-center justify-center text-xs font-semibold text-slate-text"
          >
            {deskShort}
          </div>
        </div>
      </header>

      {/* Main Split Layout: 58% Left / 42% Right */}
      <main className="flex-1 p-6 sm:p-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (58% width => 7 cols on 12-col grid) */}
        <section className="lg:col-span-7 space-y-6">
          {/* Card 1: CURRENT SESSION */}
          <div className="bg-white rounded-card shadow-card border border-slate-border p-6 sm:p-8 relative">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold tracking-widest text-slate-muted uppercase">
                CURRENT SESSION
              </span>
              <div className="px-2.5 py-0.5 bg-slate-100 text-slate-muted rounded-pill text-[11px] font-mono font-medium border border-slate-border">
                {viewState.deskId.toUpperCase()} · {viewState.selectedDurationHours}H BLOCK
              </div>
            </div>

            {/* Countdown Progress Ring */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                  {/* Background track circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#F1F5F9"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Animated Emerald circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="#16A34A"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    fill="transparent"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                {/* Inside Ring Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[11px] font-bold text-slate-muted tracking-widest uppercase mb-1">
                    DEEP WORK
                  </span>
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-slate-text tracking-tight">
                    {formatRemainingTime(viewState.remainingSeconds)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-subtle tracking-wider uppercase mt-1">
                    REMAINING
                  </span>
                </div>
              </div>

              {/* Action Controls: Pause and +15 Min */}
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={onTogglePause}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-border hover:bg-slate-50 text-slate-text rounded-subtle text-sm font-medium transition-all shadow-subtle active:scale-95"
                >
                  {viewState.isRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-slate-text" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-text" />
                      <span>Resume</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onExtendSession(15)}
                  className="flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-soft hover:bg-emerald-100 text-emerald-dark border border-emerald-border/50 rounded-subtle text-sm font-semibold transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>+15 Min</span>
                </button>

                <button
                  onClick={onCompleteSession}
                  className="px-4 py-2.5 text-xs text-slate-muted hover:text-slate-text rounded-subtle hover:bg-slate-100 transition-all"
                  title="Conclude session and view summary"
                >
                  End Session
                </button>
              </div>

              {/* Start & End Times Footer */}
              <div className="mt-4 text-xs font-mono text-slate-subtle">
                Started {viewState.startTime || '12:32'} · Ends {viewState.endTime || '14:32'}
              </div>
            </div>
          </div>

          {/* Card 2: Quick Notes */}
          <div className="bg-white rounded-card shadow-card border border-slate-border p-6 sm:p-7 relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-text">Quick Notes</h2>
              <div className="flex items-center space-x-1.5 text-xs text-slate-muted font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald"></span>
                <span>Synced · {viewState.lastSyncAgo}</span>
              </div>
            </div>

            {/* API Endpoint Tag */}
            <div className="inline-flex items-center space-x-2 bg-slate-50 border border-slate-border rounded-md px-2.5 py-1 text-[11px] font-mono text-slate-muted mb-4">
              <Cloud className="w-3.5 h-3.5 text-slate-subtle" />
              <span>POST · http://localhost:3000/api/v1/user/notes</span>
            </div>

            {/* Notes List */}
            <div className="space-y-3 mb-4">
              {viewState.notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start space-x-3 text-sm border-b border-slate-100 pb-2.5 last:border-0"
                >
                  <span className="font-mono text-xs text-slate-subtle pt-0.5 min-w-[36px]">
                    {note.time}
                  </span>
                  <span className="text-slate-text leading-snug flex-1">
                    {note.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Note Input Field */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 border border-slate-border rounded-subtle px-3 py-2 focus-within:ring-2 focus-within:ring-emerald/20 focus-within:border-emerald bg-white transition-all">
                <Plus className="w-4 h-4 text-slate-subtle" />
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a note... (press Enter to sync)"
                  className="w-full text-sm text-slate-text placeholder-slate-subtle bg-transparent focus:outline-none"
                />
                {newNoteText.trim() && (
                  <button
                    onClick={() => handleNoteSubmit()}
                    className="text-xs px-2 py-1 bg-emerald text-white rounded font-medium"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column (42% width => 5 cols on 12-col grid) */}
        <section className="lg:col-span-5 bg-white rounded-card shadow-card border border-slate-border overflow-hidden flex flex-col min-h-[580px]">
          {/* Top Browser / Filtered Media Tabs */}
          <div className="bg-slate-50 border-b border-slate-border px-3 pt-3 flex items-center space-x-1 text-xs font-medium">
            {/* YouTube Music Tab */}
            <button
              onClick={() => onChangeMediaTab('youtube')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all ${
                viewState.activeMediaTab === 'youtube'
                  ? 'bg-white border-t-2 border-emerald text-slate-text font-semibold shadow-sm'
                  : 'text-slate-muted hover:text-slate-text hover:bg-slate-100'
              }`}
            >
              <Music2 className="w-3.5 h-3.5 text-emerald" />
              <span>YouTube Music</span>
            </button>

            {/* Pinterest Tab */}
            <button
              onClick={() => onChangeMediaTab('pinterest')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-t-lg transition-all ${
                viewState.activeMediaTab === 'pinterest'
                  ? 'bg-white border-t-2 border-emerald text-slate-text font-semibold shadow-sm'
                  : 'text-slate-muted hover:text-slate-text hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-slate-subtle" />
              <span>Pinterest Inspiration</span>
            </button>

            {/* Blocked Test Site Tab */}
            <button
              onClick={() => onNavigate('https://facebook.com')}
              title="Clicking tests DNS guardrail interception overlay"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-t-lg text-rose-500 hover:bg-rose-50 transition-all font-medium ml-auto"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Blocked Test Site</span>
            </button>
          </div>

          {/* Browser Address Bar */}
          <div className="bg-white border-b border-slate-border px-4 py-2.5 flex items-center space-x-2 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald shrink-0" />
            <input
              type="text"
              value={viewState.mediaUrl}
              onChange={(e) => onNavigate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onNavigate((e.target as HTMLInputElement).value);
                }
              }}
              className="flex-1 font-mono text-slate-muted bg-transparent focus:outline-none focus:text-slate-text"
            />
            <button
              onClick={() => onChangeMediaTab(viewState.activeMediaTab)}
              className="text-slate-subtle hover:text-slate-text p-1 rounded"
              title="Reload preview"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <a
              href={viewState.mediaUrl}
              target="_blank"
              rel="noreferrer"
              className="text-slate-subtle hover:text-slate-text p-1 rounded"
              title="Open in new window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Media Content Pane */}
          <div className="flex-1 bg-slate-50/50 p-6 flex flex-col items-center justify-center relative">
            {viewState.isMediaLoading ? (
              /* Loading Modal Toast */
              <div className="w-full max-w-[280px] bg-white rounded-card shadow-lg border border-slate-border p-6 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-full border-2 border-emerald border-t-transparent animate-spin mb-3"></div>
                <div className="text-sm font-semibold text-slate-text mb-1">
                  Loading {viewState.activeMediaTab === 'youtube' ? 'music.youtube.com' : 'pinterest.com'}
                </div>
                <div className="text-[11px] font-mono text-slate-subtle mb-3 truncate w-full">
                  {viewState.mediaUrl}
                </div>
                <div className="w-full bg-slate-100 rounded-pill h-1.5 overflow-hidden">
                  <div className="bg-emerald h-full w-2/3 animate-pulse"></div>
                </div>
              </div>
            ) : viewState.activeMediaTab === 'youtube' ? (
              /* YouTube Music Focus Player Mockup */
              <div className="w-full h-full flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-text flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-emerald" />
                      <span>Deep Focus Ambient Playlist</span>
                    </h3>
                    <p className="text-xs text-slate-muted">Curated distraction-free audio stream</p>
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-soft text-emerald-dark rounded text-[11px] font-medium">
                    Whitelisted
                  </div>
                </div>

                {/* Simulated Player Artwork / Equalizer */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white shadow-md my-auto">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-lg bg-emerald-700/60 flex items-center justify-center shadow-inner">
                      <Music2 className="w-8 h-8 text-emerald-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-emerald-400 font-mono tracking-wider uppercase mb-0.5">
                        Now Streaming
                      </div>
                      <div className="font-semibold text-base truncate">Binaural Alpha Waves 14Hz</div>
                      <div className="text-xs text-slate-300">DND Creative Soundscapes</div>
                    </div>
                  </div>

                  {/* Audio visualizer bars */}
                  <div className="flex items-end space-x-1.5 h-8 my-3">
                    {[40, 75, 55, 90, 65, 80, 45, 100, 70, 50, 85, 60, 95, 40].map((h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-t transition-all duration-300 ${
                          isPlayingMusic ? 'bg-emerald-400' : 'bg-slate-600'
                        }`}
                        style={{ height: isPlayingMusic ? `${h}%` : '20%' }}
                      />
                    ))}
                  </div>

                  {/* Player controls */}
                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="font-mono text-slate-400">24:18 / 60:00</span>
                    <button
                      onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                      className="px-4 py-1.5 bg-emerald text-white font-medium rounded-pill hover:bg-emerald-dark transition-all flex items-center space-x-1.5"
                    >
                      {isPlayingMusic ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingMusic ? 'Mute' : 'Play'}</span>
                    </button>
                    <div className="flex items-center space-x-1.5 text-slate-400">
                      <Volume2 className="w-4 h-4" />
                      <div className="w-16 bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-subtle mt-4">
                  Streamed over local low-latency cache · Zero external tracking
                </div>
              </div>
            ) : (
              /* Pinterest Inspiration Board Mockup */
              <div className="w-full h-full flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-text">Architectural Focus & Moodboard</h3>
                    <p className="text-xs text-slate-muted">Curated visual library for deep work</p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-soft text-emerald-dark rounded text-[11px] font-medium">
                    Whitelisted
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[360px] pr-1">
                  <div className="bg-slate-200 rounded-lg h-36 flex flex-col justify-end p-3 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:16px_16px] text-xs font-semibold text-slate-700">
                    Minimalist Studio Spaces
                  </div>
                  <div className="bg-emerald-100/60 rounded-lg h-36 flex flex-col justify-end p-3 text-xs font-semibold text-emerald-900 border border-emerald-200">
                    Ergonomic Lighting Patterns
                  </div>
                  <div className="bg-slate-100 rounded-lg h-36 flex flex-col justify-end p-3 text-xs font-semibold text-slate-700 border border-slate-200">
                    Acoustic Wood Paneling
                  </div>
                  <div className="bg-emerald-50 rounded-lg h-36 flex flex-col justify-end p-3 text-xs font-semibold text-emerald-800 border border-emerald-100">
                    Biophilic Workspace Ideas
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
