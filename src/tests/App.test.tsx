/**
 * @file src/tests/App.test.tsx
 * Full End-to-End User Flow Integration Test
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('DND Creative Hub End-to-End User Flow', () => {
  it('navigates through Screen 01 -> Screen 02 -> Screen 03 -> Screen 04 smoothly', async () => {
    render(<App />);

    // Screen 01: Welcome Portal
    expect(screen.getByText('Deep Work Session')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Desk 04')).toBeInTheDocument();

    // Select 4 Hours
    const fourHourBtn = screen.getByRole('button', { name: /4 Hours/i });
    fireEvent.click(fourHourBtn);

    // Start Focus Session
    const startBtn = screen.getByRole('button', { name: /Start Focus Session/i });
    fireEvent.click(startBtn);

    // Screen 02: Workspace Dashboard
    expect(screen.getByText(/CURRENT SESSION/i)).toBeInTheDocument();
    expect(screen.getByText(/DEEP WORK/i)).toBeInTheDocument();
    expect(screen.getByText('Quick Notes')).toBeInTheDocument();

    // Add a note
    const noteInput = screen.getByPlaceholderText(/Add a note/i);
    fireEvent.change(noteInput, { target: { value: 'Synthesizing backend contracts.' } });
    fireEvent.keyDown(noteInput, { key: 'Enter', code: 'Enter' });

    expect(screen.getByText('Synthesizing backend contracts.')).toBeInTheDocument();

    // Trigger Screen 03: Website Blocked Overlay via Blocked Test Site
    const blockedTab = screen.getByRole('button', { name: /Blocked Test Site/i });
    fireEvent.click(blockedTab);

    // Overlay is open
    expect(screen.getByText('Website Blocked')).toBeInTheDocument();
    expect(screen.getByText('https://facebook.com')).toBeInTheDocument();

    // Dismiss overlay
    const returnBtn = screen.getByRole('button', { name: /Return to Workspace/i });
    fireEvent.click(returnBtn);

    // Modal closed, back on dashboard
    expect(screen.queryByText('Website Blocked')).not.toBeInTheDocument();

    // Check Session Log tab
    const sessionLogTab = screen.getByRole('button', { name: 'Session log' });
    fireEvent.click(sessionLogTab);
    expect(screen.getByText(/Intercepted Guardrail Logs/i)).toBeInTheDocument();
    expect(screen.getAllByText('https://facebook.com').length).toBeGreaterThan(0);

    // Check Network tab
    const networkTab = screen.getByRole('button', { name: 'Network' });
    fireEvent.click(networkTab);
    expect(screen.getByText(/Local DNS Resolver Filter Rules/i)).toBeInTheDocument();

    // Return to Workspace tab
    const workspaceTab = screen.getByRole('button', { name: 'Workspace' });
    fireEvent.click(workspaceTab);

    // Conclude Session -> Screen 04: Session Complete Summary
    const endSessionBtn = screen.getByRole('button', { name: /End Session/i });
    fireEvent.click(endSessionBtn);

    // Summary screen
    expect(screen.getByText('Session Complete!')).toBeInTheDocument();
    expect(screen.getByText('MCP LOG')).toBeInTheDocument();
    expect(screen.getByText('Finish & Checkout')).toBeInTheDocument();

    // Finish checkout
    const checkoutBtn = screen.getByRole('button', { name: /Finish & Checkout/i });
    fireEvent.click(checkoutBtn);
    expect(screen.getByText(/Checked Out Successfully!/i)).toBeInTheDocument();

    // Start another session -> Screen 01
    const anotherBtn = screen.getByRole('button', { name: /Start another session/i });
    fireEvent.click(anotherBtn);

    expect(screen.getByText('Deep Work Session')).toBeInTheDocument();
  });
});
