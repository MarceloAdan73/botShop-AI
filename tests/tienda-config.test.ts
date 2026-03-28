import { describe, it, expect } from 'vitest';
import { INFO_TIENDA, generarPromptTienda } from '../src/lib/tienda-config';

describe('INFO_TIENDA', () => {
  it('debe tener información básica de la tienda', () => {
    expect(INFO_TIENDA.nombre).toBeDefined();
    expect(typeof INFO_TIENDA.nombre).toBe('string');
  });

  it('debe tener ubicación válida', () => {
    expect(INFO_TIENDA.ubicacion.ciudad).toBeDefined();
    expect(INFO_TIENDA.ubicacion.provincia).toBeDefined();
    expect(INFO_TIENDA.ubicacion.direccion).toBeDefined();
  });

  it('debe tener información de envíos', () => {
    expect(INFO_TIENDA.envios.disponible).toBeDefined();
    expect(typeof INFO_TIENDA.envios.disponible).toBe('boolean');
  });

  it('debe tener información de contacto', () => {
    expect(INFO_TIENDA.redes.whatsapp).toBeDefined();
    expect(INFO_TIENDA.redes.instagram).toBeDefined();
  });
});

describe('generarPromptTienda', () => {
  it('debe generar un prompt válido', () => {
    const prompt = generarPromptTienda();
    expect(prompt).toBeDefined();
    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
  });

  it('debe incluir el nombre de la tienda', () => {
    const prompt = generarPromptTienda();
    expect(prompt).toContain(INFO_TIENDA.nombre);
  });

  it('debe incluir información de la dueña', () => {
    const prompt = generarPromptTienda();
    expect(prompt).toContain(INFO_TIENDA.dueña.nombre);
  });

  it('debe incluir categorías en la config', () => {
    expect(INFO_TIENDA.categorias.mujer.nombre).toBe('Mujer');
    expect(INFO_TIENDA.categorias.hombre.nombre).toBe('Hombre');
    expect(INFO_TIENDA.categorias.ninos.nombre).toBe('Niños/as');
  });
});
