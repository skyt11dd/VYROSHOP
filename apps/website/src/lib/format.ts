/**
 * Deterministic price formatter to avoid hydration mismatches between SSR and Client
 */
export function formatPrice(price: number): string {
  if (typeof price !== 'number' || isNaN(price)) return '0';
  return Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
