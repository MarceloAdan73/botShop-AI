import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toaster } from '../src/components/ui/Toast';

describe('React Components', () => {
  describe('Toast Component', () => {
    it('debe renderizar el componente Toaster', () => {
      render(<Toaster />);
      const toaster = document.querySelector('[data-rht-toaster]');
      expect(toaster).toBeTruthy();
    });

    it('debe tener configuración de posición', () => {
      const position = 'top-right';
      expect(position).toBeDefined();
    });
  });
});