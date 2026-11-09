/**
 * @file src/App.tsx
 * DND Creative Hub Client Application Root
 */

import React from 'react';
import { useHubSession } from './hooks/useHubSession';
import { WelcomePortal } from './components/WelcomePortal';
import { WorkspaceDashboard } from './components/WorkspaceDashboard';
import { BlockedOverlay } from './components/BlockedOverlay';
import { SessionSummary } from './components/SessionSummary';
import { SessionLogView } from './components/SessionLogView';
import { NetworkView } from './components/NetworkView';

export const App: React.FC = () => {
  const { viewState, actions } = useHubSession();

  return (
    <div className="min-h-screen bg-canvas font-sans antialiased text-slate-text">
      {/* Screen 01: Welcome Portal */}
      {viewState.screen === 'portal' && (
        <WelcomePortal
          viewState={viewState}
          onStartSession={(deskId, durationHours) => {
            actions.startSession(deskId, durationHours);
          }}
        />
      )}

      {/* Screen 02: Workspace Dashboard & Secondary Views */}
      {viewState.screen === 'workspace' && (
        <>
          {viewState.activeTab === 'workspace' && (
            <WorkspaceDashboard
              viewState={viewState}
              onTogglePause={actions.togglePause}
              onExtendSession={actions.extendSession}
              onAddNote={actions.addNote}
              onNavigate={actions.attemptNavigate}
              onChangeTab={actions.setActiveTab}
              onChangeMediaTab={actions.setActiveMediaTab}
              onCompleteSession={actions.completeSession}
              onToggleFullscreen={actions.toggleFullscreen}
            />
          )}

          {viewState.activeTab === 'session_log' && (
            <div className="min-h-screen bg-canvas flex flex-col">
              {/* Secondary view top bar */}
              <div className="h-16 bg-white border-b border-slate-border px-6 flex items-center justify-between">
                <div className="font-bold text-slate-text">DND CREATIVE HUB</div>
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-pill text-xs">
                  <button
                    onClick={() => actions.setActiveTab('workspace')}
                    className="px-3 py-1 rounded-pill hover:text-slate-text text-slate-muted"
                  >
                    Workspace
                  </button>
                  <button
                    onClick={() => actions.setActiveTab('session_log')}
                    className="px-3 py-1 rounded-pill bg-white text-slate-text font-bold shadow-sm"
                  >
                    Session log
                  </button>
                  <button
                    onClick={() => actions.setActiveTab('network')}
                    className="px-3 py-1 rounded-pill hover:text-slate-text text-slate-muted"
                  >
                    Network
                  </button>
                </div>
              </div>
              <SessionLogView viewState={viewState} />
            </div>
          )}

          {viewState.activeTab === 'network' && (
            <div className="min-h-screen bg-canvas flex flex-col">
              <div className="h-16 bg-white border-b border-slate-border px-6 flex items-center justify-between">
                <div className="font-bold text-slate-text">DND CREATIVE HUB</div>
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-pill text-xs">
                  <button
                    onClick={() => actions.setActiveTab('workspace')}
                    className="px-3 py-1 rounded-pill hover:text-slate-text text-slate-muted"
                  >
                    Workspace
                  </button>
                  <button
                    onClick={() => actions.setActiveTab('session_log')}
                    className="px-3 py-1 rounded-pill hover:text-slate-text text-slate-muted"
                  >
                    Session log
                  </button>
                  <button
                    onClick={() => actions.setActiveTab('network')}
                    className="px-3 py-1 rounded-pill bg-white text-slate-text font-bold shadow-sm"
                  >
                    Network
                  </button>
                </div>
              </div>
              <NetworkView viewState={viewState} />
            </div>
          )}

          {/* Screen 03: Website Blocked Overlay (Modal Guardrail) */}
          <BlockedOverlay
            viewState={viewState}
            onReturn={actions.dismissBlockedOverlay}
          />
        </>
      )}

      {/* Screen 04: Session Complete Summary */}
      {viewState.screen === 'summary' && (
        <SessionSummary
          viewState={viewState}
          onCheckout={async () => {
            await actions.checkoutSession();
          }}
          onStartAnother={actions.resetSession}
        />
      )}
    </div>
  );
};

export default App;
