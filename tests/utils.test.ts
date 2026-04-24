import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Chat Flow Utilities', () => {
  describe('Message Processing', () => {
    const extractImageUrls = (text: string): string[] => {
      const regex = /\[IMAGEN:([^\]]+)\]/g;
      const urls: string[] = [];
      let match;
      while ((match = regex.exec(text)) !== null) {
        urls.push(match[1]);
      }
      return urls;
    };

    it('should extract single image URL from message', () => {
      const text = 'Mira este producto [IMAGEN:https://example.com/photo.jpg]';
      const urls = extractImageUrls(text);
      expect(urls).toHaveLength(1);
      expect(urls[0]).toBe('https://example.com/photo.jpg');
    });

    it('should extract multiple image URLs from message', () => {
      const text = 'Tenemos [IMAGEN:img1.jpg] y [IMAGEN:img2.png]';
      const urls = extractImageUrls(text);
      expect(urls).toHaveLength(2);
      expect(urls).toEqual(['img1.jpg', 'img2.png']);
    });

    it('should return empty array when no images', () => {
      const text = 'Hola, cómo estás?';
      const urls = extractImageUrls(text);
      expect(urls).toHaveLength(0);
    });

    it('should handle malformed image markers gracefully', () => {
      const text = 'Test [IMAGEN:test.jpg] invalid';
      const urls = extractImageUrls(text);
      expect(urls).toHaveLength(1);
    });
  });

  describe('Reserva Marker Processing', () => {
    const extractReservaData = (text: string): { nombre: string; producto: string; precio: string } | null => {
      const match = text.match(/\[RESERVA:([^\]]+)\]/);
      if (!match) return null;
      
      const parts = match[1].split('|');
      if (parts.length !== 3) return null;
      
      return { nombre: parts[0], producto: parts[1], precio: parts[2] };
    };

    it('should extract reserva data correctly', () => {
      const text = '✅ RESERVA CONFIRMADA para Juan\n📦 Remera\n💰 15000 [RESERVA:Juan|Remera|15000]';
      const data = extractReservaData(text);
      
      expect(data).not.toBeNull();
      expect(data?.nombre).toBe('Juan');
      expect(data?.producto).toBe('Remera');
      expect(data?.precio).toBe('15000');
    });

    it('should return null for message without reserva marker', () => {
      const text = 'Hola, en qué puedo ayudarte?';
      const data = extractReservaData(text);
      expect(data).toBeNull();
    });

    it('should handle reserva with special characters', () => {
      const text = '[RESERVA:María José|Jean Azul|25000]';
      const data = extractReservaData(text);
      
      expect(data).not.toBeNull();
      expect(data?.nombre).toBe('María José');
    });
  });

  describe('Conversation State Management', () => {
    type Message = { role: 'user' | 'assistant'; content: string };
    type ConversationState = 'idle' | 'awaiting_name' | 'reserva_confirmed';

    const analyzeConversationState = (messages: Message[]): ConversationState => {
      const lastAssistantMessage = messages
        .filter(m => m.role === 'assistant')
        .pop();
      
      if (!lastAssistantMessage) return 'idle';
      
      if (lastAssistantMessage.content.includes('necesito tu nombre')) {
        return 'awaiting_name';
      }
      
      if (lastAssistantMessage.content.includes('RESERVA CONFIRMADA')) {
        return 'reserva_confirmed';
      }
      
      return 'idle';
    };

    it('should detect idle state for new conversation', () => {
      const messages: Message[] = [];
      expect(analyzeConversationState(messages)).toBe('idle');
    });

    it('should detect awaiting_name state', () => {
      const messages: Message[] = [
        { role: 'user', content: 'Quiero reservar' },
        { role: 'assistant', content: 'Para reservar necesito tu nombre completo' }
      ];
      expect(analyzeConversationState(messages)).toBe('awaiting_name');
    });

    it('should detect reserva_confirmed state', () => {
      const messages: Message[] = [
        { role: 'user', content: 'Juan' },
        { role: 'assistant', content: '✅ RESERVA CONFIRMADA para Juan' }
      ];
      expect(analyzeConversationState(messages)).toBe('reserva_confirmed');
    });
  });

  describe('Product Display Formatting', () => {
    const formatProductCard = (product: {
      name: string;
      price: number;
      imageUrl?: string;
      talles?: string;
    }): string => {
      let card = `📦 *${product.name}*\n`;
      card += `💰 $${product.price.toLocaleString()}`;
      
      if (product.talles) {
        card += `\n📏 Talles: ${product.talles}`;
      }
      
      if (product.imageUrl) {
        card += `\n🖼️ [IMAGEN:${product.imageUrl}]`;
      }
      
      return card;
    };

    it('should format basic product info', () => {
      const product = { name: 'Remera', price: 15000 };
      const formatted = formatProductCard(product);
      
      expect(formatted).toContain('Remera');
      expect(formatted).toMatch(/15[.,]000/);
    });

    it('should include talles when provided', () => {
      const product = { name: 'Jeans', price: 35000, talles: 'XS al XXL' };
      const formatted = formatProductCard(product);
      
      expect(formatted).toContain('Talles: XS al XXL');
    });

    it('should include image marker when imageUrl provided', () => {
      const product = { name: 'Vestido', price: 45000, imageUrl: 'dress.jpg' };
      const formatted = formatProductCard(product);
      
      expect(formatted).toContain('[IMAGEN:dress.jpg]');
    });
  });

  describe('Date/Time Utilities', () => {
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    it('should format date correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format time correctly', () => {
      const date = new Date('2024-01-15T14:30:00');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/\d{2}:\d{2}/);
    });

    const isToday = (date: Date): boolean => {
      const today = new Date();
      return date.toDateString() === today.toDateString();
    };

    it('should correctly identify today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('should correctly identify past date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('Currency Formatting', () => {
    const formatPrice = (price: number, currency: string = 'ARS'): string => {
      if (currency === 'ARS') {
        return new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          minimumFractionDigits: 0
        }).format(price);
      }
      return `$${price}`;
    };

    it('should format price in ARS correctly', () => {
      expect(formatPrice(15000)).toContain('15.000');
    });

    it('should handle zero price', () => {
      const formatted = formatPrice(0);
      expect(formatted).toContain('0');
    });

    it('should handle large numbers with separators', () => {
      const formatted = formatPrice(150000);
      expect(formatted).toMatch(/150\.000/);
    });
  });
});
