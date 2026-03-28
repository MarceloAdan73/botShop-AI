import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Gemini AI Integration', () => {
  describe('Prompt Construction', () => {
    const constructSystemPrompt = (config: {
      nombreTienda: string;
      nombreDueña: string;
      ubicacion: string;
      instagram: string;
      whatsapp: string;
      envios: boolean;
    }) => {
      let prompt = `Sos ${config.nombreTienda}, el asistente virtual de la tienda.`;
      prompt += ` Tu dueña es ${config.nombreDueña}.`;
      prompt += ` Ubicación: ${config.ubicacion}.`;
      prompt += ` IG: ${config.instagram} | WA: ${config.whatsapp}`;
      
      if (config.envios) {
        prompt += ' Ofrecemos envíos a todo el país.';
      }
      
      prompt += 'Respondé SIEMPRE.';
      
      return prompt;
    };

    it('should construct system prompt with all config', () => {
      const config = {
        nombreTienda: 'ShopBot',
        nombreDueña: 'María',
        ubicacion: 'Av. Principal 123',
        instagram: '@mitienda',
        whatsapp: '+5491112345678',
        envios: true
      };
      
      const prompt = constructSystemPrompt(config);
      
      expect(prompt).toContain('ShopBot');
      expect(prompt).toContain('María');
      expect(prompt).toContain('envíos a todo el país');
    });

    it('should handle no shipping option', () => {
      const config = {
        nombreTienda: 'Test',
        nombreDueña: 'Owner',
        ubicacion: 'Test',
        instagram: '@test',
        whatsapp: '+5491112345678',
        envios: false
      };
      
      const prompt = constructSystemPrompt(config);
      expect(prompt).not.toContain('envíos');
    });
  });

  describe('Context Building', () => {
    interface Product {
      id: string;
      name: string;
      price: number;
      categoryId: string;
      estado: 'disponible' | 'reservado' | 'vendido';
    }

    const buildProductContext = (products: Product[]): string => {
      const available = products.filter(p => p.estado === 'disponible');
      
      if (available.length === 0) {
        return '⚠️ NO HAY PRODUCTOS DISPONIBLES';
      }
      
      let context = '📦 PRODUCTOS DISPONIBLES:\n\n';
      
      for (const product of available.slice(0, 10)) {
        context += `• ${product.name} - $${product.price}\n`;
      }
      
      if (available.length > 10) {
        context += `\n...y ${available.length - 10} más`;
      }
      
      return context;
    };

    it('should show message when no products available', () => {
      const products: Product[] = [];
      const context = buildProductContext(products);
      expect(context).toBe('⚠️ NO HAY PRODUCTOS DISPONIBLES');
    });

    it('should list available products', () => {
      const products: Product[] = [
        { id: '1', name: 'Remera', price: 15000, categoryId: 'mujer', estado: 'disponible' },
        { id: '2', name: 'Jeans', price: 35000, categoryId: 'mujer', estado: 'disponible' }
      ];
      
      const context = buildProductContext(products);
      expect(context).toContain('Remera');
      expect(context).toContain('15000');
    });

    it('should exclude reserved products', () => {
      const products: Product[] = [
        { id: '1', name: 'Remera', price: 15000, categoryId: 'mujer', estado: 'reservado' },
        { id: '2', name: 'Jeans', price: 35000, categoryId: 'mujer', estado: 'disponible' }
      ];
      
      const context = buildProductContext(products);
      expect(context).toContain('Jeans');
      expect(context).not.toContain('Remera');
    });

    it('should limit to 10 products with indicator', () => {
      const products: Product[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i),
        name: `Producto ${i}`,
        price: 10000,
        categoryId: 'mujer',
        estado: 'disponible' as 'disponible'
      }));
      
      const context = buildProductContext(products);
      expect(context).toContain('...y 5 más');
    });
  });

  describe('Response Processing', () => {
    const sanitizeResponse = (response: string): string => {
      return response
        .replace(/\[IMAGEN:\s*/g, '[IMAGEN:')
        .replace(/\s*\]/g, ']')
        .trim();
    };

    it('should normalize image markers', () => {
      const response = 'Mira [IMAGEN:  foto.jpg ] esto';
      const sanitized = sanitizeResponse(response);
      expect(sanitized).toBe('Mira [IMAGEN:foto.jpg] esto');
    });

    it('should trim whitespace', () => {
      const response = '  Hola mundo  ';
      expect(sanitizeResponse(response)).toBe('Hola mundo');
    });

    const extractStructuredData = (response: string) => {
      const reservaMatch = response.match(/\[RESERVA:([^\]]+)\]/);
      const imagenMatch = response.match(/\[IMAGEN:([^\]]+)\]/g);
      
      return {
        hasReserva: !!reservaMatch,
        reservaData: reservaMatch ? reservaMatch[1] : null,
        images: imagenMatch ? imagenMatch.map(m => m.replace('[IMAGEN:', '').replace(']', '')) : []
      };
    };

    it('should extract reserva and image markers', () => {
      const response = 'Listo [RESERVA:Juan|Remera|15000] aquí [IMAGEN:foto.jpg]';
      const data = extractStructuredData(response);
      
      expect(data.hasReserva).toBe(true);
      expect(data.images).toHaveLength(1);
    });
  });

  describe('History Management', () => {
    interface Message {
      role: 'user' | 'assistant';
      content: string;
      timestamp?: string;
    }

    const summarizeHistory = (messages: Message[], maxMessages: number = 6): Message[] => {
      if (messages.length <= maxMessages) {
        return messages;
      }
      
      const recent = messages.slice(-maxMessages);
      recent.unshift({
        role: 'assistant',
        content: `[Resumen de ${messages.length - maxMessages} mensajes anteriores]`
      });
      
      return recent;
    };

    it('should return all messages when under limit', () => {
      const messages: Message[] = [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: 'Hola!' }
      ];
      
      expect(summarizeHistory(messages)).toHaveLength(2);
    });

    it('should summarize when exceeding limit', () => {
      const messages: Message[] = Array.from({ length: 10 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: `Mensaje ${i}`
      }));
      
      const summarized = summarizeHistory(messages);
      expect(summarized).toHaveLength(7);
      expect(summarized[0].content).toContain('Resumen');
    });
  });
});

describe('Admin Authentication', () => {
  describe('Password Validation', () => {
    const validatePassword = (password: string, minLength: number = 6): { valid: boolean; error?: string } => {
      if (!password) {
        return { valid: false, error: 'Password is required' };
      }
      
      if (password.length < minLength) {
        return { valid: false, error: `Password must be at least ${minLength} characters` };
      }
      
      return { valid: true };
    };

    it('should accept valid password', () => {
      const result = validatePassword('demo123');
      expect(result.valid).toBe(true);
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject short password', () => {
      const result = validatePassword('abc');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters');
    });
  });

  describe('Session Management', () => {
    const createSession = (userId: string, expiresIn: number = 3600000) => {
      return {
        userId,
        createdAt: Date.now(),
        expiresAt: Date.now() + expiresIn
      };
    };

    const isSessionValid = (session: { expiresAt: number }) => {
      return Date.now() < session.expiresAt;
    };

    it('should create valid session', () => {
      const session = createSession('admin-1');
      expect(session.userId).toBe('admin-1');
      expect(isSessionValid(session)).toBe(true);
    });

    it('should detect expired session', () => {
      const session = { expiresAt: Date.now() - 1000 };
      expect(isSessionValid(session)).toBe(false);
    });
  });
});
