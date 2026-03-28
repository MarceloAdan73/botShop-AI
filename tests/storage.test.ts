import { describe, it, expect } from 'vitest';

describe('storage', () => {
  describe('localStorage operations', () => {
    it('debe tener localStorage disponible', () => {
      expect(typeof localStorage).toBeDefined();
    });

    it('debe poder guardar y recuperar datos', () => {
      const testKey = 'test_key';
      const testValue = 'test_value';
      
      localStorage.setItem(testKey, testValue);
      expect(localStorage.getItem(testKey)).toBe(testValue);
      
      localStorage.removeItem(testKey);
      expect(localStorage.getItem(testKey)).toBeNull();
    });
  });
});
