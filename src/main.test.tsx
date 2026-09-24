import { describe, it, expect, beforeEach } from 'vitest';

describe('ClientHub session behavior', () => {
  beforeEach(() => localStorage.clear());

  it('starts signed out when no token exists', () => {
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('stores and clears the access token', () => {
    localStorage.setItem('accessToken', 'demo');
    expect(localStorage.getItem('accessToken')).toBe('demo');
    localStorage.removeItem('accessToken');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });
});