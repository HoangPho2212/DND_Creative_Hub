/**
 * @file src/components/NetworkView.tsx
 * Network & DNS Filter View for the Dashboard Tab Switcher
 */

import React from 'react';
import { Wifi, ShieldCheck, Server, Globe, Check, Ban } from 'lucide-react';
import { HubViewState } from '../contracts/sessionContract';

interface NetworkViewProps {
  viewState: HubViewState;
}

export const NetworkView: React.FC<NetworkViewProps> = ({ viewState }) => {
  return (
    <div className="max-w-[1200px] mx-auto p-6 sm:p-8 space-y-6">
      {/* Node Hardware & Captive Portal Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-card p-5 border border-slate-border shadow-card">
          <div className="flex items-center space-x-2 text-slate-muted text-xs font-semibold uppercase mb-1">
            <Wifi className="w-3.5 h-3.5 text-emerald" />
            <span>SSID</span>
          </div>
          <div className="font-mono text-base font-bold text-slate-text">
            {viewState.networkStatus.ssid}
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-slate-border shadow-card">
          <div className="flex items-center space-x-2 text-slate-muted text-xs font-semibold uppercase mb-1">
            <Server className="w-3.5 h-3.5 text-emerald" />
            <span>Local Node ID</span>
          </div>
          <div className="font-mono text-base font-bold text-slate-text">
            {viewState.networkStatus.nodeId}
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-slate-border shadow-card">
          <div className="flex items-center space-x-2 text-slate-muted text-xs font-semibold uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
            <span>Security Standard</span>
          </div>
          <div className="font-mono text-base font-bold text-slate-text">
            {viewState.networkStatus.security} Enterprise
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-slate-border shadow-card">
          <div className="flex items-center space-x-2 text-slate-muted text-xs font-semibold uppercase mb-1">
            <Globe className="w-3.5 h-3.5 text-emerald" />
            <span>Active Desks</span>
          </div>
          <div className="font-mono text-base font-bold text-emerald">
            {viewState.networkStatus.seatsOnline} Seats Connected
          </div>
        </div>
      </div>

      {/* DNS Guardrail Filter Rules */}
      <div className="bg-white rounded-card border border-slate-border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-text">Local DNS Resolver Filter Rules</h3>
            <p className="text-xs text-slate-muted">
              Whitelisted productivity endpoints are resolved locally; distraction domains trigger sinkhole redirection.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-soft text-emerald-dark font-semibold text-xs rounded-pill">
            Resolver Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-muted uppercase font-semibold">
                <th className="py-2.5 px-3">Domain</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Policy Action</th>
                <th className="py-2.5 px-3 text-right">Activity Hits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {viewState.dnsRules.map((rule) => (
                <tr key={rule.domain} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-semibold text-slate-text">
                    {rule.domain}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-muted">
                    {rule.category}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    {rule.status === 'allowed' ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-soft text-emerald-dark font-semibold rounded">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Whitelisted</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-rose-50 text-rose-600 font-semibold rounded">
                        <Ban className="w-3 h-3 stroke-[2.5]" />
                        <span>Sinkholed</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-muted font-mono">
                    {rule.hits} requests
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
