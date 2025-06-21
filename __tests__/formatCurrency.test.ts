import { formatCurrency } from '@/lib/utils';

test('formata número em BRL', () => {
  expect(formatCurrency(1234.5)).toBe('R$\u00A01.234,50');
});
