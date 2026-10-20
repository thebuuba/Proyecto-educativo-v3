import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('Polymet utility overrides', () => {
  it('lets original dialog spacing and later font sizes override their defaults', () => {
    expect(cn('flex flex-col space-y-1.5', 'space-y-1')).toBe('flex flex-col space-y-1');
    expect(cn('text-lg leading-none', 'text-lg')).toBe('text-lg');
    expect(cn('sm:leading-none text-lg', 'sm:text-lg leading-tight')).toBe('text-lg sm:text-lg leading-tight');
  });
  it('lets the timetable place a relative block absolutely without changing responsive positions', () => {
    expect(cn('relative flex', 'absolute grid', 'sm:relative')).toBe('absolute grid sm:relative');
    expect(cn('static inline-flex', 'sticky block', 'fixed hidden')).toBe('fixed hidden');
  });
  it('preserves shadow size alongside its color and merges each independently', () => {
    expect(cn('shadow-md shadow-primary/20', 'shadow-lg shadow-destructive/10')).toBe('shadow-lg shadow-destructive/10');
    expect(cn('shadow-md', 'shadow-primary/20')).toBe('shadow-md shadow-primary/20');
  });
  it('preserves ring widths, colors and offsets independently', () => {
    expect(cn('ring-1 ring-foreground/5 ring-offset-2 ring-offset-background', 'ring-2 ring-primary/20')).toBe('ring-offset-2 ring-offset-background ring-2 ring-primary/20');
    expect(cn('focus:ring-1 focus:ring-border', 'focus:ring-2')).toBe('focus:ring-border focus:ring-2');
  });
  it('distinguishes border width, color, style and side modifiers', () => {
    expect(cn('border border-input border-dashed border-l-2 border-l-primary', 'border-0 border-transparent border-solid border-l-4 border-l-muted')).toBe('border-0 border-transparent border-solid border-l-4 border-l-muted');
    expect(cn('border-b border-border', 'border-b-2 border-b-primary')).toBe('border-border border-b-2 border-b-primary');
  });
});
