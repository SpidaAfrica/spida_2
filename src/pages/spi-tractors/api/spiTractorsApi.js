const RAW_BASE =
  process.env.REACT_APP_SPI_TRACTORS_API_BASE_URL || "https://api.spida.africa";

// PHP endpoints live in /api/*.php
export const API_BASE_URL = RAW_BASE.replace(/\/$/, "") + "/api";

export const TOKEN_KEY = "spiTractorsToken";
export const USER_KEY = "spiTractorsUser";
export const VERIFY_TOKEN_KEY = "spiTractorsEmailVerifyToken";

export function getCurrentToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function getAuthHeaders() {
  const token = getCurrentToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function isFormData(val) {
  return typeof FormData !== "undefined" && val instanceof FormData;
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = {
    Accept: "application/json",
    ...(auth ? getAuthHeaders() : {}),
  };

  let payload;
  if (body !== undefined && body !== null) {
    if (isFormData(body)) {
      payload = body; // don't set content-type
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const res = await fetch(url, { method, headers, body: payload });
  const data = await res.json().catch(() => ({}));

  // Expected: { success: true/false, message, data }
  if (!res.ok || data?.success === false) {
    throw new Error(
      data?.error || data?.message || `Request failed: ${res.status}`
    );
  }

  return data;
}

/** Optional: if you ever want to inspect raw response quickly */
export async function requestRaw(path, opts = {}) {
  return request(path, opts);
}

export function saveSession(user, token, emailVerifyToken) {
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  localStorage.setItem(TOKEN_KEY, token || "");

  if (emailVerifyToken) {
    localStorage.setItem(VERIFY_TOKEN_KEY, emailVerifyToken);
  }
}

export function setEmailVerifyToken(emailVerifyToken) {
  if (emailVerifyToken) localStorage.setItem(VERIFY_TOKEN_KEY, emailVerifyToken);
}

export function getEmailVerifyToken() {
  return localStorage.getItem(VERIFY_TOKEN_KEY) || "";
}

export function clearSession() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VERIFY_TOKEN_KEY);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * API methods mapped to PHP endpoints
 */
export const spiTractorsApi = {
  baseUrl: API_BASE_URL,

  health: () => request("/health.php"),

  // ✅ REGISTER (supports FormData for utility_bill)
  register: (formDataOrObject) =>
    request("/register.php", { method: "POST", body: formDataOrObject }),

  // placeholders (create in PHP when ready)
  login: (payload) => request("/login.php", { method: "POST", body: payload }),
  me: () => request("/me.php", { auth: true }),

  // resend verify code (if you build it)
  sendVerifyEmailCode: () =>
    request("/verify_email_send.php", { method: "POST", auth: true }),

  /**
   * ✅ Confirm verify email
   * I’m sending { token } because that's what we discussed.
   * If you later change backend to accept plain string, just change body to token.
   */
  confirmVerifyEmail: (token) =>
    request("/verify_email_confirm.php", {
      method: "POST",
      body: { token: String(token || "").trim() },
      auth: true,
    }),

  forgotPassword: (email) =>
    request("/password_forgot.php", { method: "POST", body: { email } }),

  resetPassword: (payload) =>
    request("/password_reset.php", { method: "POST", body: payload }),

  // domain features placeholders
  createRequest: (payload) =>
    request("/requests_create.php", { method: "POST", body: payload, auth: true }),

  searchRequestMatches: (requestId) =>
    request(`/requests_${requestId}_search.php`, { method: "POST", auth: true }),

  requestTracking: (requestId) =>
    request(`/requests_${requestId}_tracking.php`, { auth: true }),

  createTractor: (payload) =>
    request("/tractors_create.php", { method: "POST", body: payload, auth: true }),

  myTractors: () => request("/tractors_me.php", { auth: true }),

  ownerSummary: () => request("/dashboard_owner_summary.php", { auth: true }),

  paymentEstimate: (payload) =>
    request("/payments_estimate.php", { method: "POST", body: payload, auth: true }),

  paymentIntent: (payload) =>
    request("/payments_intent.php", { method: "POST", body: payload, auth: true }),

  paymentWebhookDemo: (payload) =>
    request("/webhooks_payments.php", { method: "POST", body: payload }),

  walletMe: () => request("/wallet_me.php", { auth: true }),
  myNotifications: () => request("/notifications_me.php", { auth: true }),
  adminUsers: () => request("/admin_users.php", { auth: true }),
};
