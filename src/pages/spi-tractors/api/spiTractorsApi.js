const API_BASE_URL = process.env.REACT_APP_SPI_TRACTORS_API_BASE_URL || "http://officialtransitapp.com/Spida_Api/";
const TOKEN_KEY = "spiTractorsToken";
const USER_KEY = "spiTractorsUser";

function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(auth ? getAuthHeaders() : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data.success === false) {
    throw new Error(data.error || data.message || `Request failed: ${res.status}`);
  }

  return data;
}

export function saveSession(user, token) {
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  localStorage.setItem(TOKEN_KEY, token || "");
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export const spiTractorsApi = {
  baseUrl: API_BASE_URL,

  health: () => request("/health"),

  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/auth/me", { auth: true }),
  sendVerifyEmailCode: () => request("/auth/verify-email/send", { method: "POST", auth: true }),
  confirmVerifyEmail: (token) =>
    request("/auth/verify-email/confirm", { method: "POST", body: { token } }),
  forgotPassword: (email) =>
    request("/auth/password/forgot", { method: "POST", body: { email } }),
  resetPassword: (payload) => request("/auth/password/reset", { method: "POST", body: payload }),

  createRequest: (payload) => request("/requests", { method: "POST", body: payload, auth: true }),
  searchRequestMatches: (requestId) =>
    request(`/requests/${requestId}/search`, { method: "POST", auth: true }),
  requestTracking: (requestId) => request(`/requests/${requestId}/tracking`, { auth: true }),

  createTractor: (payload) => request("/tractors", { method: "POST", body: payload, auth: true }),
  myTractors: () => request("/tractors/me", { auth: true }),

  ownerSummary: () => request("/dashboard/owner/summary", { auth: true }),

  paymentEstimate: (payload) =>
    request("/payments/estimate", { method: "POST", body: payload, auth: true }),
  paymentIntent: (payload) => request("/payments/intent", { method: "POST", body: payload, auth: true }),
  paymentWebhookDemo: (payload) =>
    request("/webhooks/payments", { method: "POST", body: payload }),

  walletMe: () => request("/wallet/me", { auth: true }),
  myNotifications: () => request("/notifications/me", { auth: true }),
  adminUsers: () => request("/admin/users", { auth: true }),
};
