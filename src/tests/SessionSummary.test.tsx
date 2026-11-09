/**
 * @file src/tests/SessionSummary.test.tsx
 * TDD Unit tests for SessionSummary (Screen 04)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SessionSummary } from '../components/SessionSummary';
import { HubViewState } from '../contracts/sessionContract';

const mockViewState: HubViewState = {
  screen: 'summary',
  activeTab: 'workspace',
  deskId: 'Desk 04',
  selectedDurationHours: 2,
  initialDurationSeconds: 7200,
  remainingSeconds: 0,
  isRunning: false,
  startTime: '12:32',
  endTime: '14:32',
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
    sessionCode: 'Session #DND-2451',
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

describe('SessionSummary (Screen 04)', () => {
  it('renders session complete headline and summary subtitle', () => {
    render(
      <SessionSummary
        viewState={mockViewState}
        onCheckout={vi.fn()}
        onStartAnother={vi.fn()}
      />
    );

    expect(screen.getByText('Session Complete!')).toBeInTheDocument();
    expect(
      screen.getByText(/You maintained focus for 2 hours at DND Creative Hub./i)
    ).toBeInTheDocument();
  });

  it('renders all 3 metric cards correctly', () => {
    render(
      <SessionSummary
        viewState={mockViewState}
        onCheckout={vi.fn()}
        onStartAnother={vi.fn()}
      />
    );

    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Mins')).toBeInTheDocument();

    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('Sites')).toBeInTheDocument();

    expect(screen.getByText('98')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });

  it('renders MCP checkout log bar with POST badge and endpoint', () => {
    render(
      <SessionSummary
        viewState={mockViewState}
        onCheckout={vi.fn()}
        onStartAnother={vi.fn()}
      />
    );

    expect(screen.getByText('MCP LOG')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText(/http:\/\/localhost:3000\/api\/v1\/sessions\/checkout/i)).toBeInTheDocument();
  });

  it('triggers checkout and start another session callbacks', () => {
    const handleCheckout = vi.fn();
    const handleStartAnother = vi.fn();

    render(
      <SessionSummary
        viewState={mockViewState}
        onCheckout={handleCheckout}
        onStartAnother={handleStartAnother}
      />
    );

    const checkoutBtn = screen.getByRole('button', { name: /Finish & Checkout/i });
    fireEvent.click(checkoutBtn);
    expect(handleCheckout).toHaveBeenCalledTimes(1);

    const anotherLink = screen.getByRole('button', { name: /Start another session/i });
    fireEvent.click(anotherLink);
    expect(handleStartAnother).toHaveBeenCalledTimes(1);
  });
});
