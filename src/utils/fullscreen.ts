/**
 * @file src/utils/fullscreen.ts
 * Cross-browser Fullscreen API utility
 */

export function isSupportedFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenEnabled ||
      // Vendor prefixes
      (document as unknown as { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled ||
      (document as unknown as { mozFullScreenEnabled?: boolean }).mozFullScreenEnabled ||
      (document as unknown as { msFullscreenEnabled?: boolean }).msFullscreenEnabled
  );
}

export function isBrowserFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
  );
}

export async function enterFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const docEl = document.documentElement as unknown as {
    requestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };

  try {
    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen();
      return true;
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
      return true;
    } else if (docEl.mozRequestFullScreen) {
      await docEl.mozRequestFullScreen();
      return true;
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    // Browsers reject if not initiated by a user gesture or permission denied
    console.warn('Auto fullscreen request was not granted:', err);
    return false;
  }
}

export async function leaveFullscreen(): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  if (!isBrowserFullscreen()) return false;

  const doc = document as unknown as {
    exitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  };

  try {
    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
      return true;
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
      return true;
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
      return true;
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Exit fullscreen request failed:', err);
    return false;
  }
}

export async function toggleBrowserFullscreen(): Promise<boolean> {
  if (isBrowserFullscreen()) {
    return !(await leaveFullscreen());
  } else {
    return await enterFullscreen();
  }
}
