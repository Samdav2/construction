/**
 * Dynamic API and WebSocket URL configuration.
 *
 * Prevents production deployments from ever falling back to localhost:5000.
 * Automatically resolves the backend URL from:
 *   1. Build-time environment variable (VITE_API_URL, BACKEND_URL, or API_URL)
 *   2. Runtime window.__ENV__ injection (if available)
 *   3. Dynamic window.location detection:
 *      - Railway: e.g. cprohub-web-production.up.railway.app -> cprohub-api-production.up.railway.app/api/v1
 *      - Custom domains (cpromark.com, cprohub.com): https://d12e8wwao0hlhx.cloudfront.net/api/v1
 *      - Localhost / 127.0.0.1: http://localhost:5000/api/v1
 *      - Fallback: window.location.origin/api/v1
 */

const normalizeApiUrl = (url: string): string => {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
};

export const getApiBaseUrl = (): string => {
  // 1. Explicit Vite build environment variable
  const buildEnvUrl = import.meta.env.VITE_API_URL;
  if (buildEnvUrl && typeof buildEnvUrl === 'string' && buildEnvUrl.trim() !== '') {
    return normalizeApiUrl(buildEnvUrl);
  }

  // 2. Runtime window injection (allows runtime override without rebuilding)
  if (typeof window !== 'undefined') {
    const winEnv = (window as any).__ENV__?.VITE_API_URL || (window as any).__ENV__?.API_URL;
    if (winEnv && typeof winEnv === 'string' && winEnv.trim() !== '') {
      return normalizeApiUrl(winEnv);
    }

    const { hostname, origin } = window.location;

    // 3. Local development only
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return 'http://localhost:5000/api/v1';
    }

    // 4. Railway deployment automatic pairing:
    // If the frontend domain contains "-web-", "-web.", or ends with "web"
    // derive the sibling API service domain (e.g. cprohub-web-production -> cprohub-api-production)
    if (hostname.includes('railway.app')) {
      if (hostname.includes('-web-')) {
        const apiHost = hostname.replace('-web-', '-api-');
        return `https://${apiHost}/api/v1`;
      }
      if (hostname.includes('web-')) {
        const apiHost = hostname.replace('web-', 'api-');
        return `https://${apiHost}/api/v1`;
      }
      if (hostname.includes('-web.')) {
        const apiHost = hostname.replace('-web.', '-api.');
        return `https://${apiHost}/api/v1`;
      }
    }

    // 5. Production custom domains
    if (hostname.includes('cpromark.com') || hostname.includes('cprohub.com')) {
      return 'https://d12e8wwao0hlhx.cloudfront.net/api/v1';
    }

    // 6. Same-origin fallback (for unified deployments or reverse proxies)
    return `${origin}/api/v1`;
  }

  return 'http://localhost:5000/api/v1';
};

export const getSocketUrl = (): string => {
  // 1. Explicit Vite build environment variable
  const buildSocketUrl = import.meta.env.VITE_SOCKET_URL;
  if (buildSocketUrl && typeof buildSocketUrl === 'string' && buildSocketUrl.trim() !== '') {
    return buildSocketUrl.trim().replace(/\/+$/, '');
  }

  // 2. Runtime window injection
  if (typeof window !== 'undefined') {
    const winSocket = (window as any).__ENV__?.VITE_SOCKET_URL || (window as any).__ENV__?.SOCKET_URL;
    if (winSocket && typeof winSocket === 'string' && winSocket.trim() !== '') {
      return winSocket.trim().replace(/\/+$/, '');
    }

    const { hostname, origin } = window.location;

    // 3. Local development only
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return origin.replace(/:\d+$/, ':5000');
    }

    // 4. Derive from API Base URL root origin
    const apiUrl = getApiBaseUrl();
    try {
      const parsed = new URL(apiUrl);
      return `${parsed.protocol}//${parsed.host}`;
    } catch {
      return origin;
    }
  }

  return 'http://localhost:5000';
};

