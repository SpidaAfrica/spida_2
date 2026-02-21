const RAW_BASE =
  process.env.REACT_APP_SPI_TRACTORS_API_BASE_URL ||
  "https://api.spida.africa";

// our PHP endpoints live in /api/*.php
const API_BASE_URL = RAW_BASE.replace(/\/$/, "") + "/api";

const TOKEN_KEY = "spiTractorsToken";
const USER_KEY = "spiTractorsUser";
const VERIFY_TOKEN_KEY = "spiTractorsEmailVerifyToken";
function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function isFormData(val) {
  return typeof FormData !== "undefined" && val instanceof FormData;
}

async function request(
  path,
  { method = "GET", body, auth = false } = {}
) {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = {
    Accept: "application/json",
    ...(auth ? getAuthHeaders() : {}),
  };

  // If body is FormData, DO NOT set Content-Type (browser sets boundary)
  // If body is plain object, send JSON.
  let payload;
  if (body !== undefined && body !== null) {
    if (isFormData(body)) {
      payload = body;
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const res = await fetch(url, {
    method,
    headers,
    body: payload,
  });

  const data = await res.json().catch(() => ({}));

  // Our backend returns { success: true/false, message, data }
  if (!res.ok || data?.success === false) {
    throw new Error(
      data?.error || data?.message || `Request failed: ${res.status}`
    );
  }

  return data;
}
export function saveSession(user, token, emailVerifyToken) {
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
  localStorage.setItem(TOKEN_KEY, token || "");

  if (emailVerifyToken) {
    localStorage.setItem(VERIFY_TOKEN_KEY, emailVerifyToken);
  }
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
 * API methods mapped to our current PHP endpoints.
 * (Only register.php exists for sure based on what we’ve built so far.)
 */
export const spiTractorsApi = {
  baseUrl: API_BASE_URL,

  // Optional: create api/health.php later if you want
  health: () => request("/health.php"),

  /**
   * ✅ REGISTER (multipart/form-data supported)
   * - pass FormData from the refactored Signup
   */
  register: (formDataOrObject) =>
    request("/register.php", { method: "POST", body: formDataOrObject }),

  /**
   * The ones below are placeholders until you create them in PHP.
   * If you want, I can generate each corresponding PHP file.
   */
  login: (payload) => request("/login.php", { method: "POST", body: payload }),
  me: () => request("/me.php", { auth: true }),

  sendVerifyEmailCode: () =>
    request("/verify_email_send.php", { method: "POST", auth: true }),

  confirmVerifyEmail: (token) =>
    request("/verify_email_confirm.php", {
      method: "POST",
      body: { token },
      auth: true,
    }),

  forgotPassword: (email) =>
    request("/password_forgot.php", { method: "POST", body: { email } }),

  resetPassword: (payload) =>
    request("/password_reset.php", { method: "POST", body: payload }),

  // domain features (create these PHP endpoints when ready)
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
