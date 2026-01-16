/// <reference types="vite/client" />

const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

export const API_URLS = {
  // If GATEWAY_URL is set (Production/Nginx), use path-based routing.
  // Otherwise (Local), use distinct ports.
  AUTH: GATEWAY_URL ? `${GATEWAY_URL}/auth` : 'http://localhost:8001/api/auth',
  PRODUCT: GATEWAY_URL ? `${GATEWAY_URL}/products` : 'http://localhost:8002',
  ORDER: GATEWAY_URL ? `${GATEWAY_URL}/orders` : 'http://localhost:8003',
  AI: GATEWAY_URL ? `${GATEWAY_URL}/ai` : 'http://localhost:8004/api',
  ADMIN: GATEWAY_URL ? `${GATEWAY_URL}/admin` : 'http://localhost:8005/api',
  BLOG: GATEWAY_URL ? `${GATEWAY_URL}/blog` : 'http://localhost:8008/api',
  NOTIFICATION: GATEWAY_URL ? `${GATEWAY_URL}/notifications` : 'http://localhost:8006/api',
  PAYMENT: GATEWAY_URL ? `${GATEWAY_URL}/payments` : 'http://localhost:8007/api'
};
