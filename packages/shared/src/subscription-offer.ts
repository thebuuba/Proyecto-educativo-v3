/** Oferta aprobada; DOP es una referencia fechada, nunca la moneda del cargo. */
export const SUBSCRIPTION_OFFER = {
  amountMinor: 799,
  currency: 'USD',
  interval: 'month',
  intervalCount: 1,
  trial: { interval: 'month', intervalCount: 1, requiresCard: true },
  dopReference: {
    rate: 61.6788,
    date: '2026-10-14',
    sourceUrl: 'https://bancentral.gov.do/',
  },
} as const
