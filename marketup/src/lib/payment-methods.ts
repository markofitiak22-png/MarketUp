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
  // Завжди показуємо всі методи оплати для всіх користувачів
  // (згідно з вимогами - всі методи мають бути видимі для підтримки професійного вигляду)
  return Object.values(PAYMENT_METHODS);
}

// Отримання інформації про метод оплати
export function getPaymentMethodInfo(methodId: PaymentMethod): PaymentMethodInfo | undefined {
  return PAYMENT_METHODS[methodId];
}

