import { writable } from 'svelte/store';

export interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const tools: Tool[] = [
  {
    id: 'calculator',
    name: 'Calculator',
    icon: '🧮',
    description: 'Simple calculator for basic arithmetic operations'
  },
  {
    id: 'converter',
    name: 'Unit Converter',
    icon: '⚖️',
    description: 'Convert between varying metric and imperial units'
  }
  // Add more tools here as needed
];

export const selectedTool = writable<string>('calculator');
