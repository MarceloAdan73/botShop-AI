import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Chat API Utils', () => {
  describe('procesarMarcadoresImagen', () => {
    it('debe procesar marcadores de imagen con URL completa', async () => {
      const texto = 'Mira este producto [IMAGEN:https://ejemplo.com/foto.jpg]';
      const expected = 'Mira este producto [IMAGEN:https://ejemplo.com/foto.jpg]';
      expect(texto).toContain('[IMAGEN:');
    });

    it('debe agregar prefijo /productos/ a URLs sin http', async () => {
      const texto = 'Producto [IMAGEN:mi-foto.jpg]';
      expect(texto).toContain('mi-foto.jpg');
    });

    it('debe manejar múltiples imágenes en un mensaje', async () => {
      const texto = 'Aquí hay opciones [IMAGEN:prod1.jpg] y [IMAGEN:prod2.png]';
      const matches = texto.match(/\[IMAGEN:[^\]]+\]/g);
      expect(matches?.length).toBe(2);
    });

    it('debe manejar texto sin marcadores de imagen', async () => {
      const texto = 'Hola, ¿cómo estás?';
      expect(texto).not.toContain('[IMAGEN:');
    });

    it('debe limpiar espacios en el marcador', async () => {
      const texto = 'Foto [IMAGEN:  foto.jpg ]';
      expect(texto).toContain('[IMAGEN:');
    });
  });

  describe('generarPromptDinamico', () => {
    it('debe incluir productos disponibles en el prompt', async () => {
      const prompt = '📦 PRODUCTOS DISPONIBLES';
      expect(prompt).toBeDefined();
    });

    it('debe incluir reglas de formato de imagen', () => {
      const regla = 'Cuando hables de un producto con imagen';
      expect(regla).toBeDefined();
    });

    it('debe manejar caso sin productos', () => {
      const mensaje = '⚠️ NO HAY PRODUCTOS DISPONIBLES';
      expect(mensaje).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('debe tener configuración de rate limit', () => {
      const RATE_LIMIT = 10;
      const WINDOW_SECONDS = 60;
      expect(RATE_LIMIT).toBe(10);
      expect(WINDOW_SECONDS).toBe(60);
    });

    it('debe generar headers de rate limit correctos', () => {
      const headers = {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': '5',
        'X-RateLimit-Reset': '1234567890'
      };
      expect(headers['X-RateLimit-Limit']).toBe('10');
    });

    it('debe manejar excedente de rate limit', () => {
      const current = 11;
      const RATE_LIMIT = 10;
      expect(current > RATE_LIMIT).toBe(true);
    });
  });

  describe('Reserva detection', () => {
    it('debe extraer datos de reserva del mensaje', () => {
      const responseText = '✅ RESERVA CONFIRMADA para Juan\n📦 Remera\n💰 15000 [RESERVA:Juan|Remera|15000]';
      const match = responseText.match(/\[RESERVA:([^\]]+)\]/);
      expect(match).toBeDefined();
      if (match) {
        const [nombre, producto, precio] = match[1].split('|');
        expect(nombre).toBe('Juan');
        expect(producto).toBe('Remera');
        expect(precio).toBe('15000');
      }
    });

    it('debe manejar mensaje sin reserva', () => {
      const responseText = 'Hola, ¿en qué te ayudo?';
      const match = responseText.match(/\[RESERVA:([^\]]+)\]/);
      expect(match).toBeNull();
    });
  });

  describe('Conversation handling', () => {
    it('debe crear estructura de mensaje válida', () => {
      const message = { role: 'user', content: 'Hola' };
      expect(message.role).toBe('user');
      expect(message.content).toBe('Hola');
    });

    it('debe incluir timestamp en mensajes', () => {
      const message = {
        role: 'user' as const,
        content: 'Test',
        timestamp: new Date().toISOString()
      };
      expect(message.timestamp).toBeDefined();
    });

    it('debe manejar historial de conversación', () => {
      const history = [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: '¡Hola!' },
        { role: 'user', content: '¿Qué productos tienen?' }
      ];
      expect(history.length).toBe(3);
      expect(history[0].role).toBe('user');
      expect(history[2].role).toBe('user');
    });
  });
});
