/**
 * @file src/components/BlockedOverlay.tsx
 * Screen 03 · Website Blocked Overlay (Modal Guardrail)
 */

import React from 'react';
import { ShieldCheck, Clock, ArrowLeft } from 'lucide-react';
import { HubViewState } from '../contracts/sessionContract';
import { formatRemainingTime } from '../utils/formatters';

interface BlockedOverlayProps {
  viewState: HubViewState;
  onReturn: () => void;
}

export const BlockedOverlay: React.FC<BlockedOverlayProps> = ({
  viewState,
  onReturn,
}) => {
  if (!viewState.isBlockedModalOpen) return null;

  const targetDomain = viewState.activeBlockedUrl || 'https://facebook.com';
  const remainingStr = formatRemainingTime(viewState.remainingSeconds);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-md p-4 transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-[440px] bg-white rounded-card shadow-2xl border border-slate-border p-8 flex flex-col items-center text-center relative">
        {/* Shield Icon Badge */}
        <div className="w-14 h-14 rounded-full bg-emerald-soft flex items-center justify-center text-emerald mb-5">
          <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-bold text-slate-text mb-2">
          Website Blocked
        </h2>

        {/* Explanatory Text */}
        <p className="text-slate-muted text-sm leading-relaxed mb-5 max-w-sm">
          Access to <span className="font-semibold text-slate-text font-mono text-xs">{targetDomain}</span> is restricted by DND Hub local network to protect your focus.
        </p>

        {/* Time Saved Pill */}
        <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-soft text-emerald-dark rounded-pill text-xs font-semibold mb-6">
          <Clock className="w-3.5 h-3.5" />
          <span>Saved {viewState.savedFocusMinutes || 45}m of uninterrupted work</span>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturn}
          className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-emerald hover:bg-emerald-dark text-white font-medium rounded-subtle shadow-btn-emerald transition-all active:scale-[0.99] mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workspace</span>
        </button>

        {/* Session Continues Footer */}
        <div className="text-xs font-mono text-slate-subtle">
          Session continues · {remainingStr} remaining
        </div>
      </div>
    </div>
  );
};
