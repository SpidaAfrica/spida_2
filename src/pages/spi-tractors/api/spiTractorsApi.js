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
  ownerInbox: () => request("/requests_owner_new.php", { auth: true }),
  // placeholders (create in PHP when ready)
  login: (payload) => request("/login.php", { method: "POST", body: payload }),
  me: () => request("/me.php", { auth: true }),
  ownerNewRequests: () => request("/requests_owner_new.php", { auth: true }),
  ownerRequestAction: (payload) =>
    request("/requests_owner_action.php", { method: "POST", body: payload, auth: true }),
  // resend verify code (if you build it)
  sendVerifyEmailCode: () =>
    request("/verify_email_send.php", { method: "POST", auth: true }),
otpSend: (payload) => request("/otp_send.php", { method: "POST", body: payload }),
otpVerify: (payload) => request("/otp_verify.php", { method: "POST", body: payload }),
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
forgotPassword: (payload) => request("/forgot_password.php", { method: "POST", body: payload }),
resetPassword: (payload) => request("/reset_password.php", { method: "POST", body: payload }),
ownerUpcomingBookings: () => request("/dashboard_owner_bookings.php", { auth: true }),
  // domain features placeholders
createRequest: (payload) =>
  request("/requests_create.php", { method: "POST", body: payload, auth: true }),
addTractor: (payload) =>
  request("/add_tractor.php", { method: "POST", body: payload, auth: true }),
searchRequestMatches: (requestId) =>
  request("/requests_search.php", { method: "POST", body: { request_id: requestId }, auth: true }),
ownerEarningsRecent: () => request("/dashboard_owner_earnings_recent.php", { auth: true }),
 requestTracking: (requestId) =>
  request(`/requests_tracking.php?request_id=${requestId}`, { auth: true }),
ongoingRequests: () => request("/requests_ongoing.php", { auth: true }),
ownerUpcoming: () => request("/dashboard_owner_upcoming.php", { auth: true }),
requestSetStatus: (payload) =>
  request("/requests_set_status.php", { method: "POST", body: payload, auth: true }),
ownerEarnings: () => request("/dashboard_owner_earnings.php", { auth: true }),
requestCancel: (payload) =>
  request("/requests_cancel.php", { method: "POST", body: payload, auth: true }),
createTractor: (payload) =>
  request("/tractors_create.php", { method: "POST", body: payload, auth: true }),
updateTractorCapability: (payload) =>
  request("/tractors_capability_update.php", { method: "POST", body: payload, auth: true }),
  updateTractorAvailable: (payload) =>
  request("/tractors_update_availability.php", { method: "POST", body: payload, auth: true }),
myTractors: () => request("/tractors_me.php", { auth: true }),
  updateTractorAvailability: (payload) =>
    request("/tractors_availability_update.php", { method: "POST", body: payload, auth: true }),
  ownerSummary: () => request("/dashboard_owner_summary.php", { auth: true }),
  savePayoutMethod: (payload) =>
    request("/payout_method_save.php", { method: "POST", body: payload, auth: true }),
  paymentEstimate: (payload) =>
    request("/payments_estimate.php", { method: "POST", body: payload, auth: true }),
  getPaystackBanks: () =>
    request("/paystack_banks.php", { method: "GET" }),
  paymentIntent: (payload) =>
    request("/payments_intent.php", { method: "POST", body: payload, auth: true }),
  paystackInitialize: (payload) =>
  request("/paystack_initialize.php", { method: "POST", body: payload, auth: true }),
  paymentVerify: (reference) =>
    request("/payments_verify.php", { method: "POST", body: { reference }, auth: true }),
paystackVerify: async (reference) => {
  const res = await fetch(`${API_BASE_URL}/paystack_verify.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("spiTractorsToken") || ""}`,
    },
    body: JSON.stringify({ reference }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "Verification failed");
  return json;
},
  paymentWebhookDemo: (payload) =>
    request("/webhooks_payments.php", { method: "POST", body: payload }),
  ownerRequestStats: () => request("/requests_owner_stats.php", { auth: true }),
  walletMe: () => request("/wallet_me.php", { auth: true }),
  myNotifications: () => request("/notifications_me.php", { auth: true }),
  adminUsers: () => request("/admin_users.php", { auth: true }),
};
