/**
 * @file src/tests/WorkspaceDashboard.test.tsx
 * TDD Unit tests for WorkspaceDashboard (Screen 02)
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkspaceDashboard } from '../components/WorkspaceDashboard';
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
  isBlockedModalOpen: false,
  activeBlockedUrl: '',
  savedFocusMinutes: 45,
  notes: [
    { id: '1', time: '09:12', text: 'Draft the migration outline before lunch.', synced: true },
    { id: '2', time: '09:41', text: 'Ask Priya for the staging credentials.', synced: true },
    { id: '3', time: '10:05', text: 'Block 90 min for the API contract review.', synced: true },
  ],
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

describe('WorkspaceDashboard (Screen 02)', () => {
  it('renders top navbar branding, tabs, and focus status badge', () => {
    render(
      <WorkspaceDashboard
        viewState={mockViewState}
        onTogglePause={vi.fn()}
        onExtendSession={vi.fn()}
        onAddNote={vi.fn()}
        onNavigate={vi.fn()}
        onChangeTab={vi.fn()}
        onChangeMediaTab={vi.fn()}
        onCompleteSession={vi.fn()}
      />
    );

    expect(screen.getByText(/DND CREATIVE HUB/i)).toBeInTheDocument();
    expect(screen.getByText(/FOCUS ACTIVE/i)).toBeInTheDocument();
    expect(screen.getByText('D4')).toBeInTheDocument();
  });

  it('renders countdown timer formatted as 01:59:42', () => {
    render(
      <WorkspaceDashboard
        viewState={mockViewState}
        onTogglePause={vi.fn()}
        onExtendSession={vi.fn()}
        onAddNote={vi.fn()}
        onNavigate={vi.fn()}
        onChangeTab={vi.fn()}
        onChangeMediaTab={vi.fn()}
        onCompleteSession={vi.fn()}
      />
    );

    expect(screen.getByText('01:59:42')).toBeInTheDocument();
    expect(screen.getByText(/DEEP WORK/i)).toBeInTheDocument();
    expect(screen.getByText(/REMAINING/i)).toBeInTheDocument();
  });

  it('triggers pause and extend actions', () => {
    const handleTogglePause = vi.fn();
    const handleExtend = vi.fn();

    render(
      <WorkspaceDashboard
        viewState={mockViewState}
        onTogglePause={handleTogglePause}
        onExtendSession={handleExtend}
        onAddNote={vi.fn()}
        onNavigate={vi.fn()}
        onChangeTab={vi.fn()}
        onChangeMediaTab={vi.fn()}
        onCompleteSession={vi.fn()}
      />
    );

    const pauseBtn = screen.getByRole('button', { name: /Pause/i });
    fireEvent.click(pauseBtn);
    expect(handleTogglePause).toHaveBeenCalledTimes(1);

    const extendBtn = screen.getByRole('button', { name: /\+15 Min/i });
    fireEvent.click(extendBtn);
    expect(handleExtend).toHaveBeenCalledWith(15);
  });

  it('renders quick notes list and supports adding new notes', () => {
    const handleAddNote = vi.fn();

    render(
      <WorkspaceDashboard
        viewState={mockViewState}
        onTogglePause={vi.fn()}
        onExtendSession={vi.fn()}
        onAddNote={handleAddNote}
        onNavigate={vi.fn()}
        onChangeTab={vi.fn()}
        onChangeMediaTab={vi.fn()}
        onCompleteSession={vi.fn()}
      />
    );

    expect(screen.getByText(/Draft the migration outline before lunch./i)).toBeInTheDocument();
    expect(screen.getByText(/Ask Priya for the staging credentials./i)).toBeInTheDocument();

    const noteInput = screen.getByPlaceholderText(/Add a note/i);
    fireEvent.change(noteInput, { target: { value: 'New test note' } });
    fireEvent.keyDown(noteInput, { key: 'Enter', code: 'Enter' });

    expect(handleAddNote).toHaveBeenCalledWith('New test note');
  });

  it('triggers domain navigation / guardrail test site', () => {
    const handleNavigate = vi.fn();

    render(
      <WorkspaceDashboard
        viewState={mockViewState}
        onTogglePause={vi.fn()}
        onExtendSession={vi.fn()}
        onAddNote={vi.fn()}
        onNavigate={handleNavigate}
        onChangeTab={vi.fn()}
        onChangeMediaTab={vi.fn()}
        onCompleteSession={vi.fn()}
      />
    );

    const blockedTab = screen.getByText(/Blocked Test Site/i);
    fireEvent.click(blockedTab);

    expect(handleNavigate).toHaveBeenCalledWith('https://facebook.com');
  });

  it('triggers onToggleFullscreen when fullscreen button is clicked', () => {
    const handleToggleFullscreen = vi.fn();
    render(
      <WorkspaceDashboard
        viewState={mockViewState}
        onTogglePause={vi.fn()}
        onExtendSession={vi.fn()}
        onAddNote={vi.fn()}
        onNavigate={vi.fn()}
        onChangeTab={vi.fn()}
        onChangeMediaTab={vi.fn()}
        onCompleteSession={vi.fn()}
        onToggleFullscreen={handleToggleFullscreen}
      />
    );

    const fsBtn = screen.getByTitle(/Fullscreen/i);
    fireEvent.click(fsBtn);
    expect(handleToggleFullscreen).toHaveBeenCalledTimes(1);
  });
});
