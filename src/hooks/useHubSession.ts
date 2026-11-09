/**
 * @file src/hooks/useHubSession.ts
 * JayContract State Machine Hook for DND Creative Hub
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  HubViewState,
  HubActionsContract,
  JayContract,
  DashboardTab,
  MediaTab,
  validateDeskId,
  validateDuration,
  validateNoteText,
  isBlockedDomain,
  BlockedAttempt,
} from '../contracts/sessionContract';
import {
  INITIAL_NETWORK_STATUS,
  INITIAL_DNS_RULES,
  INITIAL_NOTES,
  INITIAL_METRICS,
  NetworkApiClient,
} from '../services/networkFixture';
import { calculateEndTime, formatTimeHHMM } from '../utils/formatters';

export function useHubSession() {
  const [viewState, setViewState] = useState<HubViewState>(() => {
    return {
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
      notes: INITIAL_NOTES,
      lastSyncAgo: '2s ago',
      blockedAttempts: [],
      metrics: INITIAL_METRICS,
      networkStatus: INITIAL_NETWORK_STATUS,
      dnsRules: INITIAL_DNS_RULES,
      activeMediaTab: 'youtube',
      mediaUrl: 'https://music.youtube.com/',
      isMediaLoading: false,
    };
  });

  // Timer Tick Hook
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (viewState.isRunning && viewState.remainingSeconds > 0 && viewState.screen === 'workspace') {
      interval = setInterval(() => {
        setViewState((prev) => {
          if (prev.remainingSeconds <= 1) {
            return {
              ...prev,
              remainingSeconds: 0,
              isRunning: false,
              screen: 'summary',
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewState.isRunning, viewState.remainingSeconds, viewState.screen]);

  // Actions Implementation
  const startSession = useCallback(
    (deskId: string, durationHours: number): boolean => {
      if (!validateDeskId(deskId) || !validateDuration(durationHours)) {
        return false;
      }

      const totalSeconds = durationHours * 3600;
      const now = new Date();
      const startTimeStr = formatTimeHHMM(now);
      const endTimeStr = calculateEndTime(now, totalSeconds);

      setViewState((prev) => ({
        ...prev,
        deskId: deskId.trim(),
        selectedDurationHours: durationHours,
        initialDurationSeconds: totalSeconds,
        remainingSeconds: totalSeconds,
        isRunning: true,
        startTime: startTimeStr,
        endTime: endTimeStr,
        screen: 'workspace',
        metrics: {
          ...prev.metrics,
          totalMinutes: durationHours * 60,
        },
      }));

      return true;
    },
    []
  );

  const pauseSession = useCallback(() => {
    setViewState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resumeSession = useCallback(() => {
    setViewState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const togglePause = useCallback(() => {
    setViewState((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const extendSession = useCallback((minutes: number = 15) => {
    const additionalSeconds = minutes * 60;
    setViewState((prev) => {
      const newRemaining = prev.remainingSeconds + additionalSeconds;
      const now = new Date();
      const newEndTime = calculateEndTime(now, newRemaining);
      return {
        ...prev,
        remainingSeconds: newRemaining,
        endTime: newEndTime,
        metrics: {
          ...prev.metrics,
          totalMinutes: prev.metrics.totalMinutes + minutes,
        },
      };
    });
  }, []);

  const completeSession = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      isRunning: false,
      screen: 'summary',
      isBlockedModalOpen: false,
    }));
  }, []);

  const resetSession = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      screen: 'portal',
      isRunning: false,
      remainingSeconds: prev.selectedDurationHours * 3600,
      isBlockedModalOpen: false,
      activeBlockedUrl: '',
    }));
  }, []);

  const addNote = useCallback((text: string): boolean => {
    if (!validateNoteText(text)) {
      return false;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const newNote = {
      id: `note-${Date.now()}`,
      time: timeStr,
      text: text.trim(),
      synced: true,
    };

    setViewState((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
      lastSyncAgo: 'just now',
    }));

    return true;
  }, []);

  const attemptNavigate = useCallback((url: string): boolean => {
    if (isBlockedDomain(url)) {
      const newAttempt: BlockedAttempt = {
        id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        url,
        timestamp: formatTimeHHMM(new Date()),
        savedMinutes: 45,
      };

      setViewState((prev) => ({
        ...prev,
        isBlockedModalOpen: true,
        activeBlockedUrl: url,
        blockedAttempts: [newAttempt, ...prev.blockedAttempts],
        metrics: {
          ...prev.metrics,
          interceptedCount: prev.metrics.interceptedCount + 1,
        },
      }));
      return true;
    }

    setViewState((prev) => ({
      ...prev,
      mediaUrl: url,
      isMediaLoading: true,
    }));

    setTimeout(() => {
      setViewState((prev) => ({ ...prev, isMediaLoading: false }));
    }, 600);

    return false;
  }, []);

  const dismissBlockedOverlay = useCallback(() => {
    setViewState((prev) => ({
      ...prev,
      isBlockedModalOpen: false,
    }));
  }, []);

  const setActiveTab = useCallback((tab: DashboardTab) => {
    setViewState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const setActiveMediaTab = useCallback(
    (tab: MediaTab) => {
      if (tab === 'blocked_test') {
        attemptNavigate('https://facebook.com');
        return;
      }

      const url =
        tab === 'youtube'
          ? 'https://music.youtube.com/'
          : 'https://pinterest.com/inspiration';

      setViewState((prev) => ({
        ...prev,
        activeMediaTab: tab,
        mediaUrl: url,
        isMediaLoading: true,
      }));

      setTimeout(() => {
        setViewState((prev) => ({ ...prev, isMediaLoading: false }));
      }, 500);
    },
    [attemptNavigate]
  );

  const checkoutSession = useCallback(async () => {
    const res = await NetworkApiClient.postCheckout(viewState.metrics, viewState.deskId);
    return res;
  }, [viewState.metrics, viewState.deskId]);

  const actions: HubActionsContract = useMemo(
    () => ({
      startSession,
      pauseSession,
      resumeSession,
      togglePause,
      extendSession,
      completeSession,
      resetSession,
      addNote,
      attemptNavigate,
      dismissBlockedOverlay,
      setActiveTab,
      setActiveMediaTab,
      checkoutSession,
    }),
    [
      startSession,
      pauseSession,
      resumeSession,
      togglePause,
      extendSession,
      completeSession,
      resetSession,
      addNote,
      attemptNavigate,
      dismissBlockedOverlay,
      setActiveTab,
      setActiveMediaTab,
      checkoutSession,
    ]
  );

  const contract: JayContract<HubViewState, HubActionsContract> = useMemo(
    () => ({
      name: 'DNDCreativeHubJayContract',
      version: '1.0.0',
      validateState: (state: HubViewState) => {
        return (
          validateDeskId(state.deskId) &&
          validateDuration(state.selectedDurationHours) &&
          state.remainingSeconds >= 0
        );
      },
      actions,
    }),
    [actions]
  );

  return {
    viewState,
    actions,
    contract,
  };
}
