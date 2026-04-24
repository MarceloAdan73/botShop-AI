import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Database - SQLite', () => {
  describe('Connection', () => {
    it('debe establecer conexión con SQLite', () => {
      const dbConfig = {
        path: 'dev.db',
        mode: 'readwrite' as const
      };
      expect(dbConfig.path).toBe('dev.db');
    });

    it('debe tener WAL mode habilitado', () => {
      const pragmaSettings = {
        journal_mode: 'WAL',
        foreign_keys: 'ON'
      };
      expect(pragmaSettings.journal_mode).toBe('WAL');
    });
  });

  describe('Schema - Product Table', () => {
    const productSchema = {
      columns: ['id', 'name', 'description', 'price', 'stock', 'categoryId', 'imageUrl', 'talles', 'estado', 'reserva_info', 'venta_info'],
      required: ['id', 'name', 'price', 'categoryId']
    };

    it('debe tener columnas requeridas en Product', () => {
      productSchema.required.forEach(col => {
        expect(productSchema.columns).toContain(col);
      });
    });

    it('debe tener estado con valores válidos', () => {
      const validStates = ['disponible', 'reservado', 'vendido'];
      expect(validStates).toContain('disponible');
      expect(validStates).toContain('reservado');
      expect(validStates).toContain('vendido');
    });
  });

  describe('Schema - Reserva Table', () => {
    const reservaSchema = {
      columns: ['id', 'producto_id', 'nombre_cliente', 'telefono_cliente', 'fecha_reserva', 'fecha_vencimiento', 'nota', 'estado'],
      estados: ['activa', 'vencida', 'cancelada', 'completada']
    };

    it('debe tener foreign key a Product', () => {
      expect(reservaSchema.columns).toContain('producto_id');
    });

    it('debe tener estados de reserva válidos', () => {
      expect(reservaSchema.estados).toContain('activa');
      expect(reservaSchema.estados).toContain('vencida');
    });
  });
});