import { describe, it, expect } from 'vitest';
import {
  formatCO2,
  formatNumber,
  formatDate,
  formatRelativeTime,
  formatPercentage,
  truncate,
  getMonthName,
  cn
} from './formatters';

describe('formatters', () => {
  describe('formatCO2', () => {
    it('should format values greater than or equal to 1000 in metric tons (t)', () => {
      expect(formatCO2(1200)).toBe('1.2 t CO₂');
      expect(formatCO2(2500)).toBe('2.5 t CO₂');
    });

    it('should format values between 10 and 1000 in kilograms (kg) rounded', () => {
      expect(formatCO2(15.6)).toBe('16 kg CO₂');
      expect(formatCO2(250)).toBe('250 kg CO₂');
    });

    it('should format values less than 10 in kilograms (kg) with one decimal place', () => {
      expect(formatCO2(4.2)).toBe('4.2 kg CO₂');
      expect(formatCO2(0.55)).toBe('0.6 kg CO₂');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas in Indian locale', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(100000)).toBe('1,00,000');
    });
  });

  describe('formatDate', () => {
    it('should format a valid date string to Indian locale style', () => {
      const formatted = formatDate('2025-05-15');
      // Indian locale toLocaleDateString might be slightly different on environments but is standard "15 May 2025" or "15-May-2025" or similar.
      expect(formatted).toContain('May');
      expect(formatted).toContain('2025');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return relative time tags', () => {
      const now = new Date();
      
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe('2h ago');

      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
      expect(formatRelativeTime(tenMinutesAgo)).toBe('10m ago');

      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveDaysAgo)).toBe('5d ago');
    });
  });

  describe('formatPercentage', () => {
    it('should format values with signs and one decimal place', () => {
      expect(formatPercentage(5.24)).toBe('+5.2%');
      expect(formatPercentage(-3.12)).toBe('-3.1%');
      expect(formatPercentage(0)).toBe('0.0%');
    });

    it('should allow hiding the positive sign', () => {
      expect(formatPercentage(5.24, false)).toBe('5.2%');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings with trailing ellipsis', () => {
      expect(truncate('Hello world this is a test', 10)).toBe('Hello w...');
    });

    it('should return original text if shorter than limit', () => {
      expect(truncate('Short text', 20)).toBe('Short text');
    });
  });

  describe('getMonthName', () => {
    it('should extract month name from YYYY-MM format', () => {
      const name = getMonthName('2025-05');
      expect(name).toContain('May');
      expect(name).toContain('2025');
    });
  });

  describe('cn', () => {
    it('should filter and join truthy class names', () => {
      expect(cn('class1', 'class2', null, undefined, 'class3', false)).toBe('class1 class2 class3');
    });
  });
});
