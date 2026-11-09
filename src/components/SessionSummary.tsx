/**
 * @file src/components/SessionSummary.tsx
 * Screen 04 · Session Complete Summary (Checkout)
 */

import React, { useState } from 'react';
import { Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HubViewState } from '../contracts/sessionContract';

interface SessionSummaryProps {
  viewState: HubViewState;
  onCheckout: () => void;
  onStartAnother: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  viewState,
  onCheckout,
  onStartAnother,
}) => {
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const durationHours = viewState.selectedDurationHours || 2;
  const totalMins = viewState.metrics.totalMinutes || durationHours * 60;
  const intercepted = viewState.metrics.interceptedCount;
  const score = viewState.metrics.focusScore;

  const handleCheckoutClick = () => {
    setIsCheckedOut(true);
    onCheckout();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center hero-gradient-bg px-6 py-10">
      <div className="w-full max-w-[500px] bg-white rounded-card shadow-card border border-slate-border p-8 sm:p-10 flex flex-col items-center text-center relative">
        {/* Checkmark Badge */}
        <div className="w-16 h-16 rounded-full border-2 border-emerald flex items-center justify-center text-emerald mb-5">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-[30px] font-bold text-slate-text mb-2">
          Session Complete!
        </h1>

        {/* Subtitle */}
        <p className="text-slate-muted text-[15px] mb-8 leading-relaxed max-w-sm">
          You maintained focus for {durationHours} hours at DND Creative Hub.
        </p>

        {/* Metrics Grid Container */}
        <div className="w-full bg-[#F8FAFC] border border-slate-border rounded-subtle p-5 mb-6">
          <div className="grid grid-cols-3 divide-x divide-slate-200 text-center">
            {/* Metric 1: Total Time */}
            <div className="px-2">
              <div className="text-[10px] font-bold tracking-wider text-slate-muted uppercase mb-1">
                TOTAL TIME
              </div>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-2xl font-bold font-mono text-slate-text">{totalMins}</span>
                <span className="text-xs text-slate-muted font-medium">Mins</span>
              </div>
            </div>

            {/* Metric 2: Intercepted Distractions */}
            <div className="px-2">
              <div className="text-[10px] font-bold tracking-wider text-slate-muted uppercase mb-1 truncate">
                INTERCEPTED DISTRACTIONS
              </div>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-2xl font-bold font-mono text-slate-text">{intercepted}</span>
                <span className="text-xs text-slate-muted font-medium">Sites</span>
              </div>
            </div>

            {/* Metric 3: Focus Score */}
            <div className="px-2">
              <div className="text-[10px] font-bold tracking-wider text-slate-muted uppercase mb-1">
                FOCUS SCORE
              </div>
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-2xl font-bold font-mono text-emerald">{score}</span>
                <span className="text-xs text-slate-muted font-medium">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* MCP Checkout Log Banner */}
        <div className="w-full bg-slate-50 border border-dashed border-slate-border rounded-subtle p-3 flex items-center justify-between text-xs mb-6 font-mono">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
              MCP LOG
            </span>
            <div className="text-left">
              <div className="text-[9px] text-slate-subtle font-bold tracking-wider uppercase">
                SESSION CHECKOUT
              </div>
              <div className="text-[11px] text-slate-muted truncate max-w-[240px]">
                http://localhost:3000/api/v1/sessions/checkout
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-soft text-emerald-dark font-bold text-[10px] rounded">
            POST
          </span>
        </div>

        {/* Action Button */}
        {isCheckedOut ? (
          <div className="w-full py-3.5 px-6 bg-emerald-soft text-emerald-dark font-medium rounded-subtle flex items-center justify-center space-x-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Checked Out Successfully!</span>
          </div>
        ) : (
          <button
            onClick={handleCheckoutClick}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-emerald hover:bg-emerald-dark text-white font-medium rounded-subtle shadow-btn-emerald transition-all active:scale-[0.99] mb-4"
          >
            <span>Finish & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {/* Start Another Session */}
        <button
          onClick={onStartAnother}
          className="text-xs text-slate-muted hover:text-emerald font-medium underline transition-colors mb-6"
        >
          Start another session
        </button>

        {/* Footer Meta */}
        <div className="text-xs font-mono text-slate-subtle">
          {viewState.metrics.sessionCode} · {viewState.deskId} · {viewState.metrics.dateStr}
        </div>
      </div>
    </div>
  );
};
