export type FossilSource = 'coal' | 'lignite' | 'gas' | 'diesel';
export type NonFossilSource = 'solar' | 'wind' | 'small_hydro' | 'large_hydro' | 'biomass' | 'nuclear';
export type EnergySource = FossilSource | NonFossilSource;
export type EnergyCategory = 'fossil' | 'non_fossil';

export type OwnershipType = 'central_psu' | 'state_psu' | 'private';

export type StateCode =
  | 'AP' | 'AR' | 'AS' | 'BR' | 'CG' | 'GA' | 'GJ' | 'HR'
  | 'HP' | 'JH' | 'KA' | 'KL' | 'MP' | 'MH' | 'MN' | 'ML'
  | 'MZ' | 'NL' | 'OD' | 'PB' | 'RJ' | 'SK' | 'TN' | 'TS'
  | 'TR' | 'UK' | 'UP' | 'WB'
  | 'AN' | 'CH' | 'DN' | 'DD' | 'DL' | 'JK' | 'LA' | 'LD' | 'PY';

export interface TimePeriodFilter {
  startYear: number;
  endYear: number;
  granularity: 'annual' | 'quarterly' | 'monthly';
  quarter?: 1 | 2 | 3 | 4;
  month?: number;
}

export interface FilterState {
  timePeriod: TimePeriodFilter;
  energySources: EnergySource[];
  ownershipTypes: OwnershipType[];
  states: StateCode[];
}

export const ALL_FOSSIL_SOURCES: FossilSource[] = ['coal', 'lignite', 'gas', 'diesel'];
export const ALL_NON_FOSSIL_SOURCES: NonFossilSource[] = ['solar', 'wind', 'small_hydro', 'large_hydro', 'biomass', 'nuclear'];
export const ALL_ENERGY_SOURCES: EnergySource[] = [...ALL_FOSSIL_SOURCES, ...ALL_NON_FOSSIL_SOURCES];
export const ALL_OWNERSHIP_TYPES: OwnershipType[] = ['central_psu', 'state_psu', 'private'];
