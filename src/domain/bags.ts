import type { BagCount, BagSize } from './types';

export const BAG_SIZES: readonly BagSize[] = ['small', 'medium', 'large'];

export function totalBags(bags: BagCount): number {
  return bags.small + bags.medium + bags.large;
}

