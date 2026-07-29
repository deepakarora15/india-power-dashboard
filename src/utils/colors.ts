import { EnergySource, FossilSource, NonFossilSource } from '@/types/filters';

interface SourceColorConfig {
  color: string;
  hue: number;
}

// ICICI-themed color palette
const FOSSIL_COLORS: Record<FossilSource, SourceColorConfig> = {
  coal: { color: '#B02A30', hue: 357 },
  lignite: { color: '#D4464C', hue: 357 },
  gas: { color: '#F99D27', hue: 35 },
  diesel: { color: '#FBBD6A', hue: 35 },
};

const NON_FOSSIL_COLORS: Record<NonFossilSource, SourceColorConfig> = {
  solar: { color: '#F99D27', hue: 35 },
  wind: { color: '#005B75', hue: 192 },
  small_hydro: { color: '#007A9E', hue: 193 },
  large_hydro: { color: '#003D50', hue: 195 },
  biomass: { color: '#4CAF50', hue: 122 },
  nuclear: { color: '#7B1FA2', hue: 282 },
};

const FOSSIL_SOURCES: FossilSource[] = ['coal', 'lignite', 'gas', 'diesel'];

/**
 * Get the color for an energy source.
 */
export function getSourceColor(source: EnergySource): string {
  if (FOSSIL_SOURCES.includes(source as FossilSource)) {
    return FOSSIL_COLORS[source as FossilSource].color;
  }
  return NON_FOSSIL_COLORS[source as NonFossilSource].color;
}

/**
 * Get the hue for an energy source.
 */
export function getSourceHue(source: EnergySource): number {
  if (FOSSIL_SOURCES.includes(source as FossilSource)) {
    return FOSSIL_COLORS[source as FossilSource].hue;
  }
  return NON_FOSSIL_COLORS[source as NonFossilSource].hue;
}

/**
 * Get category color.
 */
export function getCategoryColor(category: 'fossil' | 'non_fossil'): string {
  return category === 'fossil' ? '#B02A30' : '#005B75';
}

/**
 * Get ownership color — ICICI themed.
 */
export function getOwnershipColor(ownership: string): string {
  const colors: Record<string, string> = {
    central_psu: '#005B75',
    state_psu: '#B02A30',
    private: '#F99D27',
  };
  return colors[ownership] || '#757575';
}

/**
 * ICICI-themed chart colors array for various visualizations.
 */
export const CHART_COLORS = [
  '#B02A30', '#005B75', '#F99D27', '#D4464C', '#007A9E',
  '#FBBD6A', '#8B1A1F', '#003D50', '#4CAF50', '#7B1FA2',
];
