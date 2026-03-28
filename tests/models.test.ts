import { describe, it, expect } from 'vitest';
import { INFO_TIENDA } from '../src/lib/tienda-config';

describe('models', () => {
  describe('INFO_TIENDA', () => {
    it('should export INFO_TIENDA with required fields', () => {
      expect(INFO_TIENDA.nombre).toBeDefined();
      expect(INFO_TIENDA.dueña).toBeDefined();
      expect(INFO_TIENDA.categorias).toBeDefined();
    });

    it('should have valid categories', () => {
      expect(INFO_TIENDA.categorias.mujer).toBeDefined();
      expect(INFO_TIENDA.categorias.hombre).toBeDefined();
      expect(INFO_TIENDA.categorias.ninos).toBeDefined();
    });
  });
});
