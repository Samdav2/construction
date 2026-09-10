export interface CountryOption {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  phonePrefix: string;
  suggestedAmounts: number[];
}

export const ALL_COUNTRIES: CountryOption[] = [
  // Central Africa (CEMAC - XAF)
  { code: 'CM', name: 'Cameroon', currency: 'XAF', currencySymbol: 'FCFA', flag: '🇨🇲', phonePrefix: '+237', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'GA', name: 'Gabon', currency: 'XAF', currencySymbol: 'FCFA', flag: '🇬🇦', phonePrefix: '+241', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'CG', name: 'Congo (Brazzaville)', currency: 'XAF', currencySymbol: 'FCFA', flag: '🇨🇬', phonePrefix: '+242', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'TD', name: 'Chad', currency: 'XAF', currencySymbol: 'FCFA', flag: '🇹🇩', phonePrefix: '+235', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'CF', name: 'Central African Republic', currency: 'XAF', currencySymbol: 'FCFA', flag: '🇨🇫', phonePrefix: '+236', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'GQ', name: 'Equatorial Guinea', currency: 'XAF', currencySymbol: 'FCFA', flag: '🇬🇶', phonePrefix: '+240', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },

  // West Africa (WAEMU / UEMOA - XOF)
  { code: 'CI', name: "Côte d'Ivoire", currency: 'XOF', currencySymbol: 'FCFA', flag: '🇨🇮', phonePrefix: '+225', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'SN', name: 'Senegal', currency: 'XOF', currencySymbol: 'FCFA', flag: '🇸🇳', phonePrefix: '+221', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'BJ', name: 'Benin', currency: 'XOF', currencySymbol: 'FCFA', flag: '🇧🇯', phonePrefix: '+229', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'BF', name: 'Burkina Faso', currency: 'XOF', currencySymbol: 'FCFA', flag: '🇧🇫', phonePrefix: '+226', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'ML', name: 'Mali', currency: 'XOF', currencySymbol: 'FCFA', flag: '🇲🇱', phonePrefix: '+223', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'TG', name: 'Togo', currency: 'XOF', currencySymbol: 'FCFA', flag: '🇹🇬', phonePrefix: '+228', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'NE', name: 'Niger', currency: 'XOF', currencySymbol: 'FCFA', flag: '🇳🇪', phonePrefix: '+227', suggestedAmounts: [2500, 5000, 10000, 25000, 50000, 100000] },
  { code: 'GN', name: 'Guinea', currency: 'GNF', currencySymbol: 'FG', flag: '🇬🇳', phonePrefix: '+224', suggestedAmounts: [50000, 100000, 250000, 500000, 1000000] },

  // Anglophone / Major African Markets
  { code: 'NG', name: 'Nigeria', currency: 'NGN', currencySymbol: '₦', flag: '🇳🇬', phonePrefix: '+234', suggestedAmounts: [5000, 10000, 25000, 50000, 100000, 200000] },
  { code: 'GH', name: 'Ghana', currency: 'GHS', currencySymbol: 'GH₵', flag: '🇬🇭', phonePrefix: '+233', suggestedAmounts: [50, 100, 200, 500, 1000, 2000] },
  { code: 'KE', name: 'Kenya', currency: 'KES', currencySymbol: 'KSh', flag: '🇰🇪', phonePrefix: '+254', suggestedAmounts: [500, 1000, 2500, 5000, 10000, 25000] },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', currencySymbol: 'R', flag: '🇿🇦', phonePrefix: '+27', suggestedAmounts: [100, 250, 500, 1000, 2000, 5000] },
  { code: 'EG', name: 'Egypt', currency: 'EGP', currencySymbol: 'E£', flag: '🇪🇬', phonePrefix: '+20', suggestedAmounts: [200, 500, 1000, 2000, 5000, 10000] },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', currencySymbol: 'FRw', flag: '🇷🇼', phonePrefix: '+250', suggestedAmounts: [5000, 10000, 25000, 50000, 100000] },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', currencySymbol: 'TSh', flag: '🇹🇿', phonePrefix: '+255', suggestedAmounts: [10000, 25000, 50000, 100000, 250000] },
  { code: 'UG', name: 'Uganda', currency: 'UGX', currencySymbol: 'USh', flag: '🇺🇬', phonePrefix: '+256', suggestedAmounts: [20000, 50000, 100000, 200000, 500000] },
  { code: 'CD', name: 'DR Congo', currency: 'USD', currencySymbol: '$', flag: '🇨🇩', phonePrefix: '+243', suggestedAmounts: [10, 25, 50, 100, 250, 500] },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', currencySymbol: 'Br', flag: '🇪🇹', phonePrefix: '+251', suggestedAmounts: [500, 1000, 2500, 5000, 10000] },
  { code: 'MA', name: 'Morocco', currency: 'MAD', currencySymbol: 'DH', flag: '🇲🇦', phonePrefix: '+212', suggestedAmounts: [100, 250, 500, 1000, 2500] },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', currencySymbol: 'ZK', flag: '🇿🇲', phonePrefix: '+260', suggestedAmounts: [200, 500, 1000, 2500, 5000] },
  { code: 'ZW', name: 'Zimbabwe', currency: 'USD', currencySymbol: '$', flag: '🇿🇼', phonePrefix: '+263', suggestedAmounts: [10, 25, 50, 100, 250, 500] },

  // International / Global
  { code: 'US', name: 'United States', currency: 'USD', currencySymbol: '$', flag: '🇺🇸', phonePrefix: '+1', suggestedAmounts: [10, 25, 50, 100, 250, 500] },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', flag: '🇬🇧', phonePrefix: '+44', suggestedAmounts: [10, 25, 50, 100, 200, 400] },
  { code: 'CA', name: 'Canada', currency: 'CAD', currencySymbol: 'CA$', flag: '🇨🇦', phonePrefix: '+1', suggestedAmounts: [15, 30, 75, 150, 300] },
  { code: 'FR', name: 'France', currency: 'EUR', currencySymbol: '€', flag: '🇫🇷', phonePrefix: '+33', suggestedAmounts: [10, 25, 50, 100, 200, 500] },
  { code: 'DE', name: 'Germany', currency: 'EUR', currencySymbol: '€', flag: '🇩🇪', phonePrefix: '+49', suggestedAmounts: [10, 25, 50, 100, 200, 500] },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', currencySymbol: 'AED', flag: '🇦🇪', phonePrefix: '+971', suggestedAmounts: [50, 100, 200, 500, 1000] },
  { code: 'CN', name: 'China', currency: 'CNY', currencySymbol: '¥', flag: '🇨🇳', phonePrefix: '+86', suggestedAmounts: [100, 200, 500, 1000, 2000] },
  { code: 'IN', name: 'India', currency: 'INR', currencySymbol: '₹', flag: '🇮🇳', phonePrefix: '+91', suggestedAmounts: [500, 1000, 2500, 5000, 10000] },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', currencySymbol: 'SR', flag: '🇸🇦', phonePrefix: '+966', suggestedAmounts: [50, 100, 250, 500, 1000] },
  { code: 'BE', name: 'Belgium', currency: 'EUR', currencySymbol: '€', flag: '🇧🇪', phonePrefix: '+32', suggestedAmounts: [10, 25, 50, 100, 200] },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', currencySymbol: '€', flag: '🇳🇱', phonePrefix: '+31', suggestedAmounts: [10, 25, 50, 100, 200] },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', currencySymbol: 'CHF', flag: '🇨🇭', phonePrefix: '+41', suggestedAmounts: [10, 25, 50, 100, 200] },
  { code: 'IT', name: 'Italy', currency: 'EUR', currencySymbol: '€', flag: '🇮🇹', phonePrefix: '+39', suggestedAmounts: [10, 25, 50, 100, 200] },
  { code: 'ES', name: 'Spain', currency: 'EUR', currencySymbol: '€', flag: '🇪🇸', phonePrefix: '+34', suggestedAmounts: [10, 25, 50, 100, 200] },
  { code: 'AU', name: 'Australia', currency: 'AUD', currencySymbol: 'A$', flag: '🇦🇺', phonePrefix: '+61', suggestedAmounts: [15, 30, 75, 150, 300] },
  { code: 'BR', name: 'Brazil', currency: 'BRL', currencySymbol: 'R$', flag: '🇧🇷', phonePrefix: '+55', suggestedAmounts: [50, 100, 250, 500, 1000] },
  { code: 'TR', name: 'Turkey', currency: 'TRY', currencySymbol: '₺', flag: '🇹🇷', phonePrefix: '+90', suggestedAmounts: [250, 500, 1000, 2500, 5000] },
];

export const getCountryByCode = (code?: string): CountryOption => {
  if (!code) return ALL_COUNTRIES[0];
  const found = ALL_COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || ALL_COUNTRIES[0];
};

export const getCountryByName = (name?: string): CountryOption => {
  if (!name) return ALL_COUNTRIES[0];
  const found = ALL_COUNTRIES.find((c) => c.name.toLowerCase() === name.toLowerCase());
  return found || ALL_COUNTRIES[0];
};

