/**
 * Swychr / AccountPe payment gateway service
 * -------------------------------------------
 * Authenticates once, refreshes the Bearer token every ~23 hours.
 * Exposes helpers:
 *   createPaymentLink   – redirect user to pay
 *   getPaymentLinkStatus – poll after callback
 *   convertToLocal      – USD → local currency via payin rate API
 *   verifySignature     – validate inbound webhooks
 */
import axios from 'axios';
import https from 'https';
import crypto from 'crypto';

// ─── Axios instances ──────────────────────────────────────────────
const ALLOW_INSECURE = process.env.SWYCHR_ALLOW_INSECURE_TLS === 'true';
const httpsAgent = ALLOW_INSECURE ? new https.Agent({ rejectUnauthorized: false }) : undefined;

const payinApi = axios.create({
  baseURL: 'https://api.accountpe.com/api/payin',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

const payoutApi = axios.create({
  baseURL: 'https://api.accountpe.com/api/payout',
  headers: { 'Content-Type': 'application/json' },
  timeout: 4000,
});

// ─── Auth token cache ─────────────────────────────────────────────
let authToken: string | null = null;
let tokenExpiresAt: Date | null = null;

const refreshToken = async () => {
  const apiKey = process.env.SWYCHR_API_KEY || process.env.SWYCHR_SECRET_KEY || process.env.SWYCHR_KEY;
  if (apiKey) {
    authToken = apiKey.trim();
    tokenExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    console.log('[Swychr] Using SWYCHR_API_KEY from environment.');
    return;
  }

  const email = process.env.SWYCHR_EMAIL?.trim();
  const password = process.env.SWYCHR_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error('SWYCHR credentials (SWYCHR_API_KEY or SWYCHR_EMAIL / SWYCHR_PASSWORD) are not configured.');
  }

  try {
    console.log(`[Swychr] Authenticating with email: ${email}`);
    const { data } = await payinApi.post('/admin/auth', { email, password }, { httpsAgent });
    console.log('[Swychr] Auth response:', JSON.stringify(data));
    const token = data?.token || data?.data?.token || data?.access_token || data?.data?.access_token;
    if (!token) throw new Error(data?.message || 'AccountPe/Swychr auth response did not include a token.');

    authToken = token;
    // Expire 1 hour early to avoid edge-case token reuse
    tokenExpiresAt = new Date(Date.now() + 22 * 60 * 60 * 1000);
    console.log('[Swychr] Auth token refreshed successfully.');
  } catch (err: any) {
    const errorDetails = err.response?.data ? JSON.stringify(err.response.data) : err.message;
    console.error('[Swychr] Auth failed:', errorDetails);
    throw new Error(`AccountPe/Swychr auth failed: ${err.response?.data?.message || err.message}`);
  }
};

const authInterceptor = async (config: any) => {
  if (config.url === '/admin/auth') return config;
  const apiKey = process.env.SWYCHR_API_KEY || process.env.SWYCHR_SECRET_KEY || process.env.SWYCHR_KEY;
  if (apiKey) {
    config.headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    config.headers['x-api-key'] = apiKey.trim();
    return config;
  }
  if (!authToken || !tokenExpiresAt || new Date() > tokenExpiresAt) {
    await refreshToken();
  }
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  return config;
};

payinApi.interceptors.request.use(authInterceptor, (e) => Promise.reject(e));
payoutApi.interceptors.request.use(authInterceptor, (e) => Promise.reject(e));

// ─── Public helpers ───────────────────────────────────────────────

export interface PaymentLinkPayload {
  country_code: string;
  currency: string;
  amount: number;
  name: string;
  email: string;
  phone_number?: string;
  mobile_number?: string;
  phone?: string;
  mobile?: string;
  transaction_id: string;
  description: string;
  pass_digital_charge?: boolean;
  callback_url: string;
}

/**
 * Format and return a valid mobile number for the specified country.
 */
export const getValidMobileNumber = (rawPhone: string | undefined, countryCode: string): string => {
  if (rawPhone && typeof rawPhone === 'string') {
    const cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (cleaned.length >= 8) return cleaned;
  }
  const DEFAULTS: Record<string, string> = {
    CM: '670000000',
    SN: '770000000',
    CI: '0700000000',
    NG: '08012345678',
    GH: '0241234567',
    KE: '0712345678',
    ZA: '0821234567',
    EG: '01012345678',
    US: '2025550123',
    GB: '7911123456',
  };
  return DEFAULTS[countryCode] || '670000000';
};

/**
 * Create a hosted payment link. Returns the URL string or throws.
 */
export const createPaymentLink = async (payload: PaymentLinkPayload): Promise<string> => {
  try {
    const mobile = getValidMobileNumber(
      payload.mobile_number || payload.phone_number || payload.phone || payload.mobile,
      payload.country_code
    );

    const formattedPayload = {
      ...payload,
      mobile_number: mobile,
      phone_number: mobile,
      phone: mobile,
      mobile: mobile,
    };

    console.log('[Swychr] Creating payment link with payload:', JSON.stringify(formattedPayload));
    const response = await payinApi.post('/create_payment_links', formattedPayload, {
      httpsAgent,
      headers: { 'Idempotency-Key': payload.transaction_id },
    });

    console.log('[Swychr] create_payment_links response:', JSON.stringify(response.data));

    const resData = response.data;
    const link =
      resData?.data?.payment_link ||
      resData?.data?.link ||
      resData?.data?.checkout_url ||
      resData?.data?.payment_url ||
      resData?.data?.url ||
      resData?.payment_link ||
      resData?.link ||
      resData?.checkout_url ||
      resData?.payment_url ||
      resData?.url;

    if (!link) {
      const errorMsg = resData?.message || resData?.error || resData?.data?.message || 'Swychr did not return a payment link.';
      throw new Error(errorMsg);
    }
    return link;
  } catch (error: any) {
    const errorDetails = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error('[Swychr] createPaymentLink error:', errorDetails);
    const msg = error.response?.data?.message || error.response?.data?.error || error.message;
    throw new Error(msg);
  }
};

/**
 * Poll the status of a previously created payment link.
 */
export const getPaymentLinkStatus = async (transactionId: string) => {
  const { data } = await payinApi.post(
    '/payment_link_status',
    { transaction_id: transactionId },
    { httpsAgent }
  );
  return data;
};

/**
 * Convert a USD amount to the local currency for a given country.
 */
export const convertToLocal = async (countryCode: string, usdAmount: number): Promise<{ amount: number; currency: string }> => {
  const FALLBACK_CURRENCY: Record<string, string> = {
    CM: 'XAF', SN: 'XOF', CI: 'XOF', BJ: 'XOF', BF: 'XOF', ML: 'XOF',
    NG: 'NGN', GH: 'GHS', KE: 'KES', ZA: 'ZAR', EG: 'EGP',
    US: 'USD', GB: 'GBP', EUR: 'EUR',
  };

  const FALLBACK_RATES: Record<string, number> = {
    XAF: 600, XOF: 600, NGN: 1600, GHS: 15, KES: 130, ZAR: 19, EGP: 48, USD: 1, EUR: 0.92, GBP: 0.79,
  };

  const defaultCurrency = FALLBACK_CURRENCY[countryCode] || 'XAF';

  try {
    const { data } = await payoutApi.post(
      '/pusd_to_fiat_rate',
      { country_code: countryCode, amount: usdAmount },
      { httpsAgent }
    );

    const localAmount = Number(
      data?.data?.local_amount ||
      data?.data?.amount ||
      data?.local_amount ||
      data?.amount
    );

    if (localAmount && !Number.isNaN(localAmount)) {
      const currency: string =
        data?.data?.currency ||
        data?.currency ||
        defaultCurrency;
      return { amount: Math.ceil(localAmount), currency };
    }
  } catch (err: any) {
    console.warn(`[Swychr] Rate conversion API endpoint notice for ${countryCode}: using calibrated fallback rate.`);
  }

  // Graceful fallback rate if remote rate endpoint is slow or temporarily unreachable
  const rate = FALLBACK_RATES[defaultCurrency] ?? 600;
  return { amount: Math.ceil(usdAmount * rate), currency: defaultCurrency };
};

/**
 * Verify an inbound Swychr webhook signature (HMAC-SHA256).
 * Returns true if the signature is valid (or if the secret is missing in dev).
 */
export const verifySignature = (rawBody: string, signature: string | undefined): boolean => {
  const secret = process.env.SWYCHR_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[Swychr] SWYCHR_WEBHOOK_SECRET not set — rejecting webhook.');
      return false;
    }
    console.warn('[Swychr] No webhook secret (dev mode — accepting unsigned webhooks).');
    return true;
  }
  if (!signature || !rawBody) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
};

export const isPaymentSuccessful = (status: unknown): boolean => {
  if (status === 1 || status === '1' || status === true) return true;
  if (typeof status === 'string') {
    const s = status.toLowerCase();
    return s === 'success' || s === 'successful' || s === 'completed' || s === 'paid';
  }
  return false;
};
