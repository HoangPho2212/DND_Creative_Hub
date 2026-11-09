/**
 * @file src/contracts/sessionContract.ts
 * Jay Framework Contract & ViewState Definitions for DND Creative Hub
 */

export type ScreenState = 'portal' | 'workspace' | 'summary';
export type DashboardTab = 'workspace' | 'session_log' | 'network';
export type MediaTab = 'youtube' | 'pinterest' | 'blocked_test';

export interface FocusBlockOption {
  hours: number;
  label: string;
}

export interface NoteItem {
  id: string;
  time: string;
  text: string;
  synced: boolean;
}

export interface BlockedAttempt {
  id: string;
  url: string;
  timestamp: string;
  savedMinutes: number;
}

export interface SessionMetrics {
  totalMinutes: number;
  interceptedCount: number;
  focusScore: number;
  sessionCode: string;
  dateStr: string;
}

export interface NetworkNodeStatus {
  filterActive: boolean;
  seatsOnline: number;
  nodeUrl: string;
  ssid: string;
  security: string;
  nodeId: string;
}

export interface DnsRule {
  domain: string;
  category: 'Allowed Productivity' | 'Blocked Social' | 'Blocked Entertainment';
  status: 'allowed' | 'blocked';
  hits: number;
}

/**
 * HubViewState: Root ViewState contract for DND Creative Hub
 */
export interface HubViewState {
  screen: ScreenState;
  activeTab: DashboardTab;
  deskId: string;
  selectedDurationHours: number;
  
  // Timer State
  initialDurationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  startTime: string | null;
  endTime: string | null;

  // Guardrail Modal State
  isBlockedModalOpen: boolean;
  activeBlockedUrl: string;
  savedFocusMinutes: number;

  // Notes State
  notes: NoteItem[];
  lastSyncAgo: string;

  // History & Guardrail logs
  blockedAttempts: BlockedAttempt[];
  metrics: SessionMetrics;
  networkStatus: NetworkNodeStatus;
  dnsRules: DnsRule[];

  // Filtered Media Preview pane
  activeMediaTab: MediaTab;
  mediaUrl: string;
  isMediaLoading: boolean;

  // Fullscreen State
  isFullscreen: boolean;
  fullscreenSupported: boolean;
}

/**
 * Action Contract interface for JayContract
 */
export interface HubActionsContract {
  startSession: (deskId: string, durationHours: number) => boolean;
  pauseSession: () => void;
  resumeSession: () => void;
  togglePause: () => void;
  extendSession: (minutes?: number) => void;
  completeSession: () => void;
  resetSession: () => void;
  addNote: (text: string) => boolean;
  attemptNavigate: (url: string) => boolean;
  dismissBlockedOverlay: () => void;
  setActiveTab: (tab: DashboardTab) => void;
  setActiveMediaTab: (tab: MediaTab) => void;
  checkoutSession: () => Promise<{ success: boolean; sessionCode: string }>;
  requestFullscreen: () => Promise<boolean>;
  exitFullscreen: () => Promise<boolean>;
  toggleFullscreen: () => Promise<void>;
}

/**
 * Generic JayContract specification
 */
export interface JayContract<TState, TActions> {
  name: string;
  version: string;
  validateState: (state: TState) => boolean;
  actions: TActions;
}

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  deskIdMinLength: 2,
  deskIdPattern: /^[A-Za-z0-9\s_-]+$/,
  allowedDurations: [1, 2, 4],
  blockedDomains: [
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'twitter.com',
    'x.com',
    'reddit.com',
    'netflix.com'
  ]
};

export function validateDeskId(deskId: string): boolean {
  if (!deskId) return false;
  const trimmed = deskId.trim();
  return (
    trimmed.length >= VALIDATION_RULES.deskIdMinLength &&
    VALIDATION_RULES.deskIdPattern.test(trimmed)
  );
}

export function validateDuration(hours: number): boolean {
  return VALIDATION_RULES.allowedDurations.includes(hours);
}

export function validateNoteText(text: string): boolean {
  return typeof text === 'string' && text.trim().length > 0;
}

export function isBlockedDomain(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return VALIDATION_RULES.blockedDomains.some(domain => lower.includes(domain));
}
