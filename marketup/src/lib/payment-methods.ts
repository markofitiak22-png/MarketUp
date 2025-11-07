export type PaymentMethod = 
  | 'stripe_card'      // Visa/Mastercard через Stripe
  | 'paypal'           // PayPal
  | 'apple_pay'        // Apple Pay
  | 'klarna'           // Klarna
  | 'swish'            // Swish
  | 'syriatel_cash'    // Syriatel Cash (Syria)
  | 'zain_cash'        // Zain Cash (Jordan)
  | 'iban_transfer';   // IBAN Transfer (Turkey)

export interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  requiresReceipt?: boolean; // Для ручних платежів
  countrySpecific?: string[]; // Країни, де метод найбільш популярний
}

export const PAYMENT_METHODS: Record<PaymentMethod, PaymentMethodInfo> = {
  stripe_card: {
    id: 'stripe_card',
    name: 'Visa / Mastercard',
    description: 'Pay with your credit or debit card',
    icon: '💳',
    available: true,
    countrySpecific: ['SE', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'DK', 'NO', 'FI', 'PL', 'CZ', 'IE', 'PT', 'GR']
  },
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay securely with PayPal',
    icon: '🔵',
    available: true,
    countrySpecific: ['SE', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH']
  },
  apple_pay: {
    id: 'apple_pay',
    name: 'Apple Pay',
    description: 'Pay with Apple Pay',
    icon: '🍎',
    available: true,
    countrySpecific: ['SE', 'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'DK', 'NO', 'FI']
  },
  klarna: {
    id: 'klarna',
    name: 'Klarna',
    description: 'Buy now, pay later with Klarna',
    icon: '🛒',
    available: true,
    countrySpecific: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'NL', 'BE']
  },
  swish: {
    id: 'swish',
    name: 'Swish',
    description: 'Pay instantly with Swish',
    icon: '📱',
    available: true,
    countrySpecific: ['SE']
  },
  syriatel_cash: {
    id: 'syriatel_cash',
    name: 'Syriatel Cash',
    description: 'Pay with Syriatel Cash mobile wallet',
    icon: '📲',
    available: true,
    requiresReceipt: true,
    countrySpecific: ['SY']
  },
  zain_cash: {
    id: 'zain_cash',
    name: 'Zain Cash',
    description: 'Pay with Zain Cash wallet',
    icon: '💼',
    available: true,
    countrySpecific: ['JO']
  },
  iban_transfer: {
    id: 'iban_transfer',
    name: 'Bank Transfer (IBAN)',
    description: 'Transfer money via IBAN and upload receipt',
    icon: '🏦',
    available: true,
    requiresReceipt: true,
    countrySpecific: ['TR']
  }
};

// Визначення доступних методів на основі країни
export function getAvailablePaymentMethods(country?: string | null): PaymentMethodInfo[] {
  // Якщо країна не вказана, показуємо всі методи
  if (!country) {
    return Object.values(PAYMENT_METHODS);
  }

  // Для країн Близького Сходу показуємо всі методи + локальні
  const middleEastCountries = ['SY', 'JO', 'LB', 'IQ', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'YE'];
  const isMiddleEast = middleEastCountries.includes(country.toUpperCase());

  // Для Європи та Швеції - показуємо європейські методи
  const europeanCountries = ['SE', 'NO', 'DK', 'FI', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'PL', 'CZ', 'IE', 'PT', 'GR', 'GB'];
  const isEuropean = europeanCountries.includes(country.toUpperCase());

  // Для Туреччини - IBAN + всі інші
  const isTurkey = country.toUpperCase() === 'TR';

  // Фільтруємо методи
  return Object.values(PAYMENT_METHODS).filter(method => {
    // Завжди показуємо основні міжнародні методи
    if (['stripe_card', 'paypal', 'apple_pay'].includes(method.id)) {
      return true;
    }

    // Для Близького Сходу - показуємо локальні методи
    if (isMiddleEast && ['syriatel_cash', 'zain_cash'].includes(method.id)) {
      return true;
    }

    // Для Європи - показуємо європейські методи
    if (isEuropean && ['klarna', 'swish'].includes(method.id)) {
      return true;
    }

    // Для Туреччини - показуємо IBAN
    if (isTurkey && method.id === 'iban_transfer') {
      return true;
    }

    // Для інших країн - показуємо тільки основні міжнародні
    return false;
  });
}

// Отримання інформації про метод оплати
export function getPaymentMethodInfo(methodId: PaymentMethod): PaymentMethodInfo | undefined {
  return PAYMENT_METHODS[methodId];
}

