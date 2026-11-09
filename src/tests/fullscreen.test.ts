/**
 * @file src/tests/fullscreen.test.ts
 * TDD Unit tests for browser Fullscreen API helpers
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  isBrowserFullscreen,
  enterFullscreen,
  leaveFullscreen,
  isSupportedFullscreen,
} from '../utils/fullscreen';

describe('Fullscreen API Utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('✅ isSupportedFullscreen returns boolean without throwing', () => {
    expect(typeof isSupportedFullscreen()).toBe('boolean');
  });

  it('✅ isBrowserFullscreen reports true when document.fullscreenElement exists', () => {
    const dummyEl = document.createElement('div');
    Object.defineProperty(document, 'fullscreenElement', {
      value: dummyEl,
      configurable: true,
      writable: true,
    });

    expect(isBrowserFullscreen()).toBe(true);
  });

  it('✅ isBrowserFullscreen reports false when document.fullscreenElement is null', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      configurable: true,
      writable: true,
    });

    expect(isBrowserFullscreen()).toBe(false);
  });

  it('✅ enterFullscreen invokes requestFullscreen on documentElement', async () => {
    const mockRequest = vi.fn().mockResolvedValue(undefined);
    document.documentElement.requestFullscreen = mockRequest;

    const result = await enterFullscreen();
    expect(result).toBe(true);
    expect(mockRequest).toHaveBeenCalledTimes(1);
  });

  it('❌ enterFullscreen handles rejection gracefully without crashing', async () => {
    const mockRequest = vi.fn().mockRejectedValue(new Error('User denied fullscreen'));
    document.documentElement.requestFullscreen = mockRequest;

    const result = await enterFullscreen();
    expect(result).toBe(false);
  });

  it('✅ leaveFullscreen invokes exitFullscreen when active', async () => {
    const dummyEl = document.createElement('div');
    Object.defineProperty(document, 'fullscreenElement', {
      value: dummyEl,
      configurable: true,
      writable: true,
    });

    const mockExit = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = mockExit;

    const result = await leaveFullscreen();
    expect(result).toBe(true);
    expect(mockExit).toHaveBeenCalledTimes(1);
  });
});
