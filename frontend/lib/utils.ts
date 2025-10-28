import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrency(value: number): string {
  if (isNaN(value)) return '$0';
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });
}
export function formatNumberInputCOP(value: string): string {
  // Quita todo lo que no sea dígito
  const numericValue = value.replace(/\D/g, '');
  if (!numericValue) return '';

  // Convierte a número y aplica formato con puntos
  return Number(numericValue).toLocaleString('es-CO');
}
