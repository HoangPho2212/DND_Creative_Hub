/**
 * @file src/tests/sessionContract.test.ts
 * TDD Unit tests for sessionContract validation and rules
 */
import { describe, it, expect } from 'vitest';
import {
  validateDeskId,
  validateDuration,
  validateNoteText,
  isBlockedDomain,
} from '../contracts/sessionContract';

describe('JayContract Validation Rules', () => {
  describe('validateDeskId', () => {
    it('✅ accepts valid desk IDs', () => {
      expect(validateDeskId('Desk 04')).toBe(true);
      expect(validateDeskId('D-12')).toBe(true);
      expect(validateDeskId('Node_1')).toBe(true);
      expect(validateDeskId('AB')).toBe(true);
    });

    it('❌ rejects empty or too short desk IDs', () => {
      expect(validateDeskId('')).toBe(false);
      expect(validateDeskId(' ')).toBe(false);
      expect(validateDeskId('A')).toBe(false);
    });

    it('❌ rejects desk IDs with invalid characters', () => {
      expect(validateDeskId('Desk@04!')).toBe(false);
      expect(validateDeskId('Desk#1')).toBe(false);
    });
  });

  describe('validateDuration', () => {
    it('✅ accepts allowed duration blocks: 1, 2, 4 hours', () => {
      expect(validateDuration(1)).toBe(true);
      expect(validateDuration(2)).toBe(true);
      expect(validateDuration(4)).toBe(true);
    });

    it('❌ rejects non-standard duration values', () => {
      expect(validateDuration(0)).toBe(false);
      expect(validateDuration(3)).toBe(false);
      expect(validateDuration(5)).toBe(false);
      expect(validateDuration(-1)).toBe(false);
    });
  });

  describe('validateNoteText', () => {
    it('✅ accepts non-empty note text', () => {
      expect(validateNoteText('Draft the migration outline before lunch.')).toBe(true);
      expect(validateNoteText('Review PR')).toBe(true);
    });

    it('❌ rejects empty or whitespace-only text', () => {
      expect(validateNoteText('')).toBe(false);
      expect(validateNoteText('   ')).toBe(false);
    });
  });

  describe('isBlockedDomain', () => {
    it('✅ correctly identifies distraction domains as blocked', () => {
      expect(isBlockedDomain('https://facebook.com')).toBe(true);
      expect(isBlockedDomain('http://instagram.com/feed')).toBe(true);
      expect(isBlockedDomain('https://twitter.com/home')).toBe(true);
      expect(isBlockedDomain('https://reddit.com/r/all')).toBe(true);
      expect(isBlockedDomain('https://tiktok.com')).toBe(true);
    });

    it('❌ allows productive and whitelisted domains', () => {
      expect(isBlockedDomain('https://music.youtube.com')).toBe(false);
      expect(isBlockedDomain('https://pinterest.com')).toBe(false);
      expect(isBlockedDomain('https://github.com')).toBe(false);
    });
  });
});
