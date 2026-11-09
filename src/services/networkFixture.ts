/**
 * @file src/services/networkFixture.ts
 * Fixtures and Mock API service conforming to JayContract endpoints
 */

import { NetworkNodeStatus, NoteItem, DnsRule, SessionMetrics } from '../contracts/sessionContract';

export const INITIAL_NETWORK_STATUS: NetworkNodeStatus = {
  filterActive: true,
  seatsOnline: 12,
  nodeUrl: 'http://localhost:3000/api/v1/network/status',
  ssid: 'DND-Creative-Hub-5G',
  security: 'WPA3',
  nodeId: 'NODE 04',
};

export const INITIAL_DNS_RULES: DnsRule[] = [
  { domain: 'music.youtube.com', category: 'Allowed Productivity', status: 'allowed', hits: 342 },
  { domain: 'pinterest.com', category: 'Allowed Productivity', status: 'allowed', hits: 189 },
  { domain: 'github.com', category: 'Allowed Productivity', status: 'allowed', hits: 521 },
  { domain: 'linear.app', category: 'Allowed Productivity', status: 'allowed', hits: 145 },
  { domain: 'figma.com', category: 'Allowed Productivity', status: 'allowed', hits: 402 },
  { domain: 'facebook.com', category: 'Blocked Social', status: 'blocked', hits: 78 },
  { domain: 'instagram.com', category: 'Blocked Social', status: 'blocked', hits: 94 },
  { domain: 'tiktok.com', category: 'Blocked Social', status: 'blocked', hits: 63 },
  { domain: 'twitter.com', category: 'Blocked Social', status: 'blocked', hits: 112 },
  { domain: 'reddit.com', category: 'Blocked Social', status: 'blocked', hits: 156 },
  { domain: 'netflix.com', category: 'Blocked Entertainment', status: 'blocked', hits: 41 },
];

export const INITIAL_NOTES: NoteItem[] = [
  { id: 'n-1', time: '09:12', text: 'Draft the migration outline before lunch.', synced: true },
  { id: 'n-2', time: '09:41', text: 'Ask Priya for the staging credentials.', synced: true },
  { id: 'n-3', time: '10:05', text: 'Block 90 min for the API contract review.', synced: true },
];

export const INITIAL_METRICS: SessionMetrics = {
  totalMinutes: 120,
  interceptedCount: 14,
  focusScore: 98,
  sessionCode: 'Session #DND-2451',
  dateStr: '08 Nov 2026',
};

/**
 * Simulated client API for local DNS node
 */
export const NetworkApiClient = {
  async getStatus(): Promise<NetworkNodeStatus> {
    return Promise.resolve({ ...INITIAL_NETWORK_STATUS });
  },

  async getNotes(): Promise<NoteItem[]> {
    return Promise.resolve([...INITIAL_NOTES]);
  },

  async postNote(text: string): Promise<NoteItem> {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      time: timeStr,
      text,
      synced: true,
    };
    return Promise.resolve(newNote);
  },

  async postCheckout(metrics: SessionMetrics, _deskId: string): Promise<{ success: boolean; sessionCode: string }> {
    // Simulates POST http://localhost:3000/api/v1/sessions/checkout
    return Promise.resolve({
      success: true,
      sessionCode: metrics.sessionCode || `Session #DND-${Math.floor(1000 + Math.random() * 9000)}`,
    });
  },
};
