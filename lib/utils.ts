import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatRupiah = (value: string | number): string => {
  const number = typeof value === 'string' ? value.replace(/\D/g, '') : value;
  return new Intl.NumberFormat('id-ID').format(Number(number));
};

export const parseRupiah = (value: string): string => {
  return value.replace(/\D/g, '');
};
