import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
  }
}

interface UserOptions {
  head?: any[][];
  body?: any[][];
  startY?: number;
  styles?: {
    fontSize?: number;
    [key: string]: any;
  };
  headStyles?: {
    fillColor?: number[];
    [key: string]: any;
  };
  [key: string]: any;
}

export {};
