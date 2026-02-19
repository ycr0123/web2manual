import { describe, it, expect } from 'vitest';
import {
  CATEGORY_INFO,
  CATEGORY_ORDER,
  getCategoryFromFilename,
  extractSectionNumber,
  SITE_META,
  SEARCH_CONFIG,
} from '@/lib/constants';

describe('CATEGORY_INFO', () => {
  it('contains all 9 categories', () => {
    const keys = Object.keys(CATEGORY_INFO);
    expect(keys).toHaveLength(9);
  });

  it('overview category has correct label', () => {
    expect(CATEGORY_INFO.overview.label).toBe('개요');
  });

  it('each category has id, label, description, and color', () => {
    for (const [, info] of Object.entries(CATEGORY_INFO)) {
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('label');
      expect(info).toHaveProperty('description');
      expect(info).toHaveProperty('color');
    }
  });
});

describe('CATEGORY_ORDER', () => {
  it('has 9 categories in order', () => {
    expect(CATEGORY_ORDER).toHaveLength(9);
    expect(CATEGORY_ORDER[0]).toBe('overview');
    expect(CATEGORY_ORDER[CATEGORY_ORDER.length - 1]).toBe('troubleshooting');
  });
});

describe('getCategoryFromFilename', () => {
  it('returns overview for filename starting with 0', () => {
    expect(getCategoryFromFilename('0-intro.md')).toBe('overview');
  });

  it('returns getting-started for filename with prefix 1.x', () => {
    expect(getCategoryFromFilename('1-install.md')).toBe('getting-started');
    expect(getCategoryFromFilename('1.5-setup.md')).toBe('getting-started');
  });

  it('returns common-workflows for prefix 2.x', () => {
    expect(getCategoryFromFilename('2-workflow.md')).toBe('common-workflows');
    expect(getCategoryFromFilename('2.3-tasks.md')).toBe('common-workflows');
  });

  it('returns cli-reference for prefix 3.x', () => {
    expect(getCategoryFromFilename('3-cli.md')).toBe('cli-reference');
  });

  it('returns settings for prefix 4.x', () => {
    expect(getCategoryFromFilename('4-settings.md')).toBe('settings');
  });

  it('returns features for prefix 5.x', () => {
    expect(getCategoryFromFilename('5-features.md')).toBe('features');
  });

  it('returns third-party for prefix 6.x', () => {
    expect(getCategoryFromFilename('6-integrations.md')).toBe('third-party');
  });

  it('returns security for prefix 7.x', () => {
    expect(getCategoryFromFilename('7-security.md')).toBe('security');
  });

  it('returns troubleshooting for prefix 8.x', () => {
    expect(getCategoryFromFilename('8-debug.md')).toBe('troubleshooting');
  });

  it('returns overview for non-numeric prefix', () => {
    expect(getCategoryFromFilename('abc-intro.md')).toBe('overview');
  });

  it('returns overview for prefix >= 9', () => {
    // Number >= 9 falls through to default return 'overview'
    expect(getCategoryFromFilename('9-other.md')).toBe('overview');
    expect(getCategoryFromFilename('10-extra.md')).toBe('overview');
  });

  it('handles filename without dash', () => {
    const result = getCategoryFromFilename('readme.md');
    // 'readme' parsed as NaN -> returns 'overview'
    expect(result).toBe('overview');
  });
});

describe('extractSectionNumber', () => {
  it('extracts leading number from slug', () => {
    expect(extractSectionNumber('1-introduction')).toBe('1');
    expect(extractSectionNumber('2.3-advanced')).toBe('2.3');
  });

  it('returns "0" when no number at start', () => {
    expect(extractSectionNumber('intro-section')).toBe('0');
    expect(extractSectionNumber('abc')).toBe('0');
  });

  it('handles complex section numbers', () => {
    expect(extractSectionNumber('10.2.3-deep')).toBe('10.2.3');
  });

  it('handles empty string', () => {
    expect(extractSectionNumber('')).toBe('0');
  });
});

describe('SITE_META', () => {
  it('has title, description, url, and ogImage', () => {
    expect(SITE_META).toHaveProperty('title');
    expect(SITE_META).toHaveProperty('description');
    expect(SITE_META).toHaveProperty('url');
    expect(SITE_META).toHaveProperty('ogImage');
  });

  it('url starts with https', () => {
    expect(SITE_META.url).toMatch(/^https:\/\//);
  });
});

describe('SEARCH_CONFIG', () => {
  it('has maxResults, debounceMs, and minQueryLength', () => {
    expect(SEARCH_CONFIG).toHaveProperty('maxResults');
    expect(SEARCH_CONFIG).toHaveProperty('debounceMs');
    expect(SEARCH_CONFIG).toHaveProperty('minQueryLength');
  });

  it('maxResults is 10', () => {
    expect(SEARCH_CONFIG.maxResults).toBe(10);
  });

  it('minQueryLength is at least 1', () => {
    expect(SEARCH_CONFIG.minQueryLength).toBeGreaterThanOrEqual(1);
  });
});
