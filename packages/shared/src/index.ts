export const DOMAIN_MAP = {
  main: 'mooooonk.space',
  cobaltblue: 'cobaltblue.fun',
  counterexample: 'counterexample.motorcycles',
  acdc: 'acdc.work',
  wagtail: 'wagtail.run',
  ecoli: 'ecoli.tech',
} as const satisfies Record<string, string>;

export type SiteKey = keyof typeof DOMAIN_MAP;

export const SITE_NAMES: Record<SiteKey, string> = {
  main: 'Mooooonk',
  cobaltblue: 'Cobalt Blue',
  counterexample: 'Counterexample',
  acdc: 'AC/DC Works',
  wagtail: 'Wagtail Run',
  ecoli: 'E. coli Tech',
};
