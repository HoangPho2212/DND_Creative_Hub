/**
 * @file src/components/WelcomePortal.tsx
 * Screen 01 · Wi-Fi Welcome Portal
 */

import React, { useState } from 'react';
import { Wifi, ArrowRight, CreditCard, Check } from 'lucide-react';
import { HubViewState } from '../contracts/sessionContract';
import { enterFullscreen } from '../utils/fullscreen';

interface WelcomePortalProps {
  viewState: HubViewState;
  onStartSession: (deskId: string, durationHours: number) => void;
}

export const WelcomePortal: React.FC<WelcomePortalProps> = ({
  viewState,
  onStartSession,
}) => {
  const [deskId, setDeskId] = useState(viewState.deskId || 'Desk 04');
  const [duration, setDuration] = useState<number>(viewState.selectedDurationHours || 2);
  const [error, setError] = useState<string | null>(null);

  const durationOptions = [
    { hours: 1, label: '1 Hour' },
    { hours: 2, label: '2 Hours' },
    { hours: 4, label: '4 Hours' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deskId.trim() || deskId.trim().length < 2) {
      setError('Please enter a valid Desk or User ID (at least 2 characters).');
      return;
    }
    setError(null);
    // Auto full screen upon starting deep work session to remove OS task bar and other tabs
    enterFullscreen().catch(() => {});
    onStartSession(deskId.trim(), duration);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between hero-gradient-bg px-6 py-6 sm:px-10">
      {/* Top Bar Header */}
      <header className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-subtle">
        <div className="flex items-center space-x-2 text-emerald-dark font-medium">
          <Wifi className="w-4 h-4 text-emerald" />
          <span>{viewState.networkStatus.ssid}</span>
        </div>
        <div className="tracking-wide uppercase">
          SECURE · {viewState.networkStatus.security} · {viewState.networkStatus.nodeId}
        </div>
      </header>

      {/* Main Center Card */}
      <main className="flex-1 flex flex-col items-center justify-center my-8">
        <div className="w-full max-w-[460px] bg-white rounded-card shadow-card border border-slate-border p-8 sm:p-10 relative">
          {/* Eyebrow Label */}
          <div className="text-[11px] font-bold tracking-widest text-emerald-dark uppercase mb-2">
            DND CREATIVE HUB
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-[32px] font-bold text-slate-text leading-tight mb-2">
            Deep Work Session
          </h1>

          {/* Subtitle */}
          <p className="text-slate-muted text-[15px] mb-8 leading-relaxed">
            Connected to local network. Distractions filtered.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Desk ID Field */}
            <div>
              <label
                htmlFor="desk-id-input"
                className="block text-[11px] font-semibold text-slate-muted uppercase tracking-wider mb-2"
              >
                NAME / DESK ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-subtle">
                  <CreditCard className="w-4 h-4" />
                </div>
                <input
                  id="desk-id-input"
                  type="text"
                  value={deskId}
                  onChange={(e) => {
                    setDeskId(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. Desk 04"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-emerald rounded-subtle text-slate-text text-base font-medium focus:outline-none focus:ring-2 focus:ring-emerald/20 transition-all"
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            {/* Focus Duration Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-muted uppercase tracking-wider mb-2">
                FOCUS DURATION
              </label>
              <div className="grid grid-cols-3 gap-3">
                {durationOptions.map((opt) => {
                  const isSelected = duration === opt.hours;
                  return (
                    <button
                      key={opt.hours}
                      type="button"
                      onClick={() => setDuration(opt.hours)}
                      className={`flex items-center justify-center py-2.5 px-3 rounded-subtle text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-emerald text-white shadow-md shadow-emerald/30 font-semibold'
                          : 'bg-white border border-slate-border text-slate-text hover:bg-slate-50'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 mr-1 stroke-[3]" />}
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-emerald hover:bg-emerald-dark text-white font-medium rounded-subtle shadow-btn-emerald transition-all active:scale-[0.99]"
            >
              <span>Start Focus Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Network Filter Status Box */}
          <div className="mt-6 bg-[#F8FAFC] border border-slate-border rounded-subtle p-3.5 text-xs text-slate-muted">
            <div className="flex items-center space-x-2 font-medium mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald inline-block"></span>
              <span className="text-slate-text">Network Filter Active</span>
              <span className="text-slate-subtle">·</span>
              <span>{viewState.networkStatus.seatsOnline} seats online</span>
            </div>
            <div className="font-mono text-[11px] text-slate-subtle truncate">
              Node: {viewState.networkStatus.nodeUrl}
            </div>
          </div>

          {/* Local-only Note */}
          <div className="mt-4 text-center text-xs text-slate-subtle">
            Local-only session · Nothing leaves this network
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="text-center text-xs text-slate-subtle py-2">
        DND Creative Hub · Local node · v1.0.0
      </footer>
    </div>
  );
};
