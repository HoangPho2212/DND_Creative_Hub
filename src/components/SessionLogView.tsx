/**
 * @file src/components/SessionLogView.tsx
 * Session Log View for the Dashboard Tab Switcher
 */

import React from 'react';
import { ShieldAlert, CheckCircle, Clock, FileText } from 'lucide-react';
import { HubViewState } from '../contracts/sessionContract';

interface SessionLogViewProps {
  viewState: HubViewState;
}

export const SessionLogView: React.FC<SessionLogViewProps> = ({ viewState }) => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 sm:p-8 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-card p-6 border border-slate-border shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-soft flex items-center justify-center text-emerald">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-muted">Focus Duration</div>
            <div className="text-2xl font-bold font-mono text-slate-text">
              {viewState.metrics.totalMinutes} Mins
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card p-6 border border-slate-border shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-muted">DNS Guardrail Intercepts</div>
            <div className="text-2xl font-bold font-mono text-slate-text">
              {viewState.metrics.interceptedCount} Sites
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card p-6 border border-slate-border shadow-card flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-soft flex items-center justify-center text-emerald">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-bold text-slate-muted">Focus Quality Score</div>
            <div className="text-2xl font-bold font-mono text-emerald">
              {viewState.metrics.focusScore}%
            </div>
          </div>
        </div>
      </div>

      {/* Interception Audit Table */}
      <div className="bg-white rounded-card border border-slate-border shadow-card p-6">
        <h3 className="text-base font-bold text-slate-text mb-4 flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Intercepted Guardrail Logs (Real-time DNS Blocks)</span>
        </h3>

        {viewState.blockedAttempts.length === 0 ? (
          <div className="text-center py-8 text-slate-muted text-sm">
            No distractions intercepted in this session yet. Deep focus mode active!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {viewState.blockedAttempts.map((attempt) => (
              <div key={attempt.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-slate-subtle">{attempt.timestamp}</span>
                  <span className="font-mono font-medium text-slate-text">{attempt.url}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-semibold rounded">
                    INTERCEPTED
                  </span>
                  <span className="text-slate-muted">Saved ~{attempt.savedMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synchronized Notes Table */}
      <div className="bg-white rounded-card border border-slate-border shadow-card p-6">
        <h3 className="text-base font-bold text-slate-text mb-4 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald" />
          <span>Synchronized Session Notes</span>
        </h3>
        <div className="divide-y divide-slate-100">
          {viewState.notes.map((note) => (
            <div key={note.id} className="py-3 flex items-start space-x-3 text-sm">
              <span className="font-mono text-xs text-slate-subtle min-w-[40px] pt-0.5">
                {note.time}
              </span>
              <span className="text-slate-text flex-1">{note.text}</span>
              <span className="text-[11px] font-mono text-emerald">POST synced</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
