/**
 * @file src/tests/BlockedOverlay.test.tsx
 * TDD Unit tests for BlockedOverlay (Screen 03)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlockedOverlay } from '../components/BlockedOverlay';
import { HubViewState } from '../contracts/sessionContract';

const mockViewState: HubViewState = {
  screen: 'workspace',
  activeTab: 'workspace',
  deskId: 'Desk 04',
  selectedDurationHours: 2,
  initialDurationSeconds: 7200,
  remainingSeconds: 7182, // 01:59:42
  isRunning: true,
  startTime: '12:32',
  endTime: '14:32',
  isBlockedModalOpen: true,
  activeBlockedUrl: 'https://facebook.com',
  savedFocusMinutes: 45,
  notes: [],
  lastSyncAgo: '2s ago',
  blockedAttempts: [],
  metrics: {
    totalMinutes: 120,
    interceptedCount: 14,
    focusScore: 98,
    sessionCode: '#DND-2451',
    dateStr: '08 Nov 2026',
  },
  networkStatus: {
    filterActive: true,
    seatsOnline: 12,
    nodeUrl: 'http://localhost:3000/api/v1/network/status',
    ssid: 'DND-Creative-Hub-5G',
    security: 'WPA3',
    nodeId: 'NODE 04',
  },
  dnsRules: [],
  activeMediaTab: 'youtube',
  mediaUrl: 'https://music.youtube.com/',
  isMediaLoading: false,
  isFullscreen: false,
  fullscreenSupported: true,
};

describe('BlockedOverlay (Screen 03)', () => {
  it('renders modal with Website Blocked header and target domain message', () => {
    render(<BlockedOverlay viewState={mockViewState} onReturn={vi.fn()} />);

    expect(screen.getByText('Website Blocked')).toBeInTheDocument();
    expect(screen.getByText('https://facebook.com')).toBeInTheDocument();
    expect(screen.getByText(/Access to/i)).toBeInTheDocument();
    expect(
      screen.getByText(/is restricted by DND Hub local network to protect your focus./i)
    ).toBeInTheDocument();
  });

  it('displays saved focus time pill badge', () => {
    render(<BlockedOverlay viewState={mockViewState} onReturn={vi.fn()} />);
    expect(screen.getByText(/Saved 45m of uninterrupted work/i)).toBeInTheDocument();
  });

  it('displays remaining session time in footer', () => {
    render(<BlockedOverlay viewState={mockViewState} onReturn={vi.fn()} />);
    expect(screen.getByText(/Session continues · 01:59:42 remaining/i)).toBeInTheDocument();
  });

  it('triggers onReturn callback when clicking Return to Workspace button', () => {
    const handleReturn = vi.fn();
    render(<BlockedOverlay viewState={mockViewState} onReturn={handleReturn} />);

    const returnBtn = screen.getByRole('button', { name: /Return to Workspace/i });
    fireEvent.click(returnBtn);

    expect(handleReturn).toHaveBeenCalledTimes(1);
  });
});
