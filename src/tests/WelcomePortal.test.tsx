/**
 * @file src/tests/WelcomePortal.test.tsx
 * TDD Unit tests for WelcomePortal (Screen 01)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomePortal } from '../components/WelcomePortal';
import { HubViewState } from '../contracts/sessionContract';

const mockViewState: HubViewState = {
  screen: 'portal',
  activeTab: 'workspace',
  deskId: 'Desk 04',
  selectedDurationHours: 2,
  initialDurationSeconds: 7200,
  remainingSeconds: 7200,
  isRunning: false,
  startTime: null,
  endTime: null,
  isBlockedModalOpen: false,
  activeBlockedUrl: '',
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

describe('WelcomePortal (Screen 01)', () => {
  it('renders Wi-Fi network and node information in top bar', () => {
    render(<WelcomePortal viewState={mockViewState} onStartSession={vi.fn()} />);
    expect(screen.getByText(/DND-Creative-Hub-5G/i)).toBeInTheDocument();
    expect(screen.getByText(/SECURE · WPA3 · NODE 04/i)).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(<WelcomePortal viewState={mockViewState} onStartSession={vi.fn()} />);
    expect(screen.getByText(/Deep Work Session/i)).toBeInTheDocument();
    expect(screen.getByText(/Connected to local network. Distractions filtered./i)).toBeInTheDocument();
  });

  it('allows changing desk ID and selecting duration block', () => {
    const handleStart = vi.fn();
    render(<WelcomePortal viewState={mockViewState} onStartSession={handleStart} />);

    const deskInput = screen.getByDisplayValue('Desk 04');
    fireEvent.change(deskInput, { target: { value: 'Desk 08' } });

    const fourHourBtn = screen.getByRole('button', { name: /4 Hours/i });
    fireEvent.click(fourHourBtn);

    const submitBtn = screen.getByRole('button', { name: /Start Focus Session/i });
    fireEvent.click(submitBtn);

    expect(handleStart).toHaveBeenCalledWith('Desk 08', 4);
  });

  it('displays network status banner with node url', () => {
    render(<WelcomePortal viewState={mockViewState} onStartSession={vi.fn()} />);
    expect(screen.getByText(/Network Filter Active/i)).toBeInTheDocument();
    expect(screen.getByText(/12 seats online/i)).toBeInTheDocument();
    expect(screen.getByText(/http:\/\/localhost:3000\/api\/v1\/network\/status/i)).toBeInTheDocument();
  });
});
