/**
 * @file src/tests/useHubSession.test.ts
 * TDD Unit tests for useHubSession JayContract state machine
 */
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHubSession } from '../hooks/useHubSession';

describe('useHubSession State Machine & JayContract', () => {
  it('✅ initializes in portal screen with default desk 04 and 2 hour duration', () => {
    const { result } = renderHook(() => useHubSession());
    expect(result.current.viewState.screen).toBe('portal');
    expect(result.current.viewState.deskId).toBe('Desk 04');
    expect(result.current.viewState.selectedDurationHours).toBe(2);
    expect(result.current.viewState.isBlockedModalOpen).toBe(false);
  });

  it('✅ transitions from portal to workspace upon startSession with valid input', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      const ok = result.current.actions.startSession('Desk 04', 2);
      expect(ok).toBe(true);
    });

    expect(result.current.viewState.screen).toBe('workspace');
    expect(result.current.viewState.isRunning).toBe(true);
    expect(result.current.viewState.remainingSeconds).toBe(2 * 3600);
    expect(result.current.viewState.startTime).not.toBeNull();
  });

  it('❌ rejects startSession with invalid desk ID', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      const ok = result.current.actions.startSession('', 2);
      expect(ok).toBe(false);
    });

    expect(result.current.viewState.screen).toBe('portal');
  });

  it('✅ toggles pause and resume correctly', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 1);
    });
    expect(result.current.viewState.isRunning).toBe(true);

    act(() => {
      result.current.actions.togglePause();
    });
    expect(result.current.viewState.isRunning).toBe(false);

    act(() => {
      result.current.actions.togglePause();
    });
    expect(result.current.viewState.isRunning).toBe(true);
  });

  it('✅ extends session by +15 minutes', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 1);
    });
    const beforeSeconds = result.current.viewState.remainingSeconds;

    act(() => {
      result.current.actions.extendSession(15);
    });

    expect(result.current.viewState.remainingSeconds).toBe(beforeSeconds + 15 * 60);
  });

  it('✅ allows adding synchronized notes', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 2);
    });

    act(() => {
      const added = result.current.actions.addNote('Draft the migration outline before lunch.');
      expect(added).toBe(true);
    });

    expect(result.current.viewState.notes.length).toBeGreaterThan(0);
    expect(result.current.viewState.notes[result.current.viewState.notes.length - 1].text).toBe(
      'Draft the migration outline before lunch.'
    );
  });

  it('❌ rejects adding empty notes', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 2);
    });

    const initialCount = result.current.viewState.notes.length;

    act(() => {
      const added = result.current.actions.addNote('   ');
      expect(added).toBe(false);
    });

    expect(result.current.viewState.notes.length).toBe(initialCount);
  });

  it('✅ triggers blocked modal overlay when attempting to navigate to blocked domain', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 2);
    });

    const initialIntercepts = result.current.viewState.metrics.interceptedCount;

    act(() => {
      const blocked = result.current.actions.attemptNavigate('https://facebook.com');
      expect(blocked).toBe(true);
    });

    expect(result.current.viewState.isBlockedModalOpen).toBe(true);
    expect(result.current.viewState.activeBlockedUrl).toBe('https://facebook.com');
    expect(result.current.viewState.metrics.interceptedCount).toBe(initialIntercepts + 1);

    // Dismiss overlay
    act(() => {
      result.current.actions.dismissBlockedOverlay();
    });
    expect(result.current.viewState.isBlockedModalOpen).toBe(false);
  });

  it('✅ transitions to session summary on completion', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 2);
    });

    act(() => {
      result.current.actions.completeSession();
    });

    expect(result.current.viewState.screen).toBe('summary');
    expect(result.current.viewState.isRunning).toBe(false);
  });

  it('✅ resets back to portal when resetSession is called', () => {
    const { result } = renderHook(() => useHubSession());
    
    act(() => {
      result.current.actions.startSession('Desk 04', 2);
      result.current.actions.completeSession();
      result.current.actions.resetSession();
    });

    expect(result.current.viewState.screen).toBe('portal');
  });
});
