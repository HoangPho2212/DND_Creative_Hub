/**
 * @file src/utils/formatters.ts
 * Formatting utilities for countdown time, clocks, and metrics
 */

export function formatRemainingTime(totalSeconds: number): string {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function formatTimeHHMM(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function calculateEndTime(startDate: Date, durationSeconds: number): string {
  const end = new Date(startDate.getTime() + durationSeconds * 1000);
  return formatTimeHHMM(end);
}
