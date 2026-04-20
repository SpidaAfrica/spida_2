const RAW_BASE =
  process.env.REACT_APP_SPI_TRACTORS_API_BASE_URL || "https://api.spida.africa";

// PHP endpoints live in /api/*.php
export const API_BASE_URL = RAW_BASE.replace(/\/$/, "") + "/api";

export const TOKEN_KEY        = "spiTractorsToken";
export const USER_KEY         = "spiTractorsUser";
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
      payload = body;
    } else {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    }
  }

  const res  = await fetch(url, { method, headers, body: payload });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.success === false) {
    throw new Error(
      data?.error || data?.message || `Request failed: ${res.status}`
    );
  }

  return data;
}

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

export const spiTractorsApi = {
  baseUrl: API_BASE_URL,

  logout:   () => request("/logout.php",   { method: "POST", auth: true }),
  health:   () => request("/health.php"),

  myNotifications:      () => request("/notifications_me.php",       { auth: true }),
  notificationsMarkRead:() => request("/notifications_mark_read.php", { method: "POST", auth: true }),

  settingsGet:            () => request("/settings_get.php",            { auth: true }),
  settingsUpdateProfile:  (p) => request("/settings_profile_update.php", { method: "POST", body: p, auth: true }),
  settingsChangePassword: (p) => request("/settings_password_change.php",{ method: "POST", body: p, auth: true }),

  register: (formDataOrObject) =>
    request("/register.php", { method: "POST", body: formDataOrObject }),

  login:  (p) => request("/login.php",  { method: "POST", body: p }),
  me:     ()  => request("/me.php",     { auth: true }),

  forgotPassword: (p) => request("/forgot_password.php", { method: "POST", body: p }),
  resetPassword:  (p) => request("/reset_password.php",  { method: "POST", body: p }),

  sendVerifyEmailCode: () =>
    request("/verify_email_send.php", { method: "POST", auth: true }),

  confirmVerifyEmail: (token) =>
    request("/verify_email_confirm.php", {
      method: "POST",
      body:   { token: String(token || "").trim() },
      auth:   true,
    }),

  otpSend:   (p) => request("/otp_send.php",   { method: "POST", body: p }),
  otpVerify: (p) => request("/otp_verify.php",  { method: "POST", body: p }),

  // ---- Requests ----
  createRequest:       (p) => request("/requests_create.php",  { method: "POST", body: p, auth: true }),
  requestCancel:       (p) => request("/requests_cancel.php",  { method: "POST", body: p, auth: true }),
  requestSetStatus:    (p) => request("/requests_set_status.php", { method: "POST", body: p, auth: true }),
  requestTracking: (requestId) =>
    request(`/requests_tracking.php?request_id=${requestId}`, { auth: true }),

  ongoingRequests: () => request("/requests_ongoing.php", { auth: true }),

  searchRequestMatches: (requestId) =>
    request("/requests_search.php", { method: "POST", body: { request_id: requestId }, auth: true }),

  getRequestStatus(requestId) {
    return request("/get_request_status.php", {
      method: "POST",
      body:   { request_id: requestId },
      auth:   true,
    });
  },

  // ---- Owner: single requests ----
  ownerInbox:        () => request("/requests_owner_new.php", { auth: true }),
  ownerNewRequests:  () => request("/requests_owner_new.php", { auth: true }),

  ownerNewRequestsSingle: () =>
    request("/requests_owner_new.php", { auth: true }),

  ownerRequestActionSingle: (p) =>
    request("/requests_owner_action.php", { method: "POST", body: p, auth: true }),

  ownerRequestStats: () => request("/requests_owner_stats.php", { auth: true }),

  // ---- Owner: pair group ----
  ownerNewRequestsPair: () =>
    request("/get_waiting_pair_group_for_tractor.php", { auth: true }),

  ownerAcceptPairGroup: (p) =>
    request("/tractor_accept_pair_group.php", { method: "POST", body: p, auth: true }),

  ownerDeclinePairGroup: (p) =>
    request("/tractor_decline_pair_group.php", { method: "POST", body: p, auth: true }),

  pairMatchEngine: () =>
    request("/pair_match_engine.php", { method: "POST", auth: true }),

  // ---- Bookings / Upcoming ----
  ownerUpcomingBookings: () => request("/dashboard_owner_bookings.php",  { auth: true }),
  ownerUpcoming:         () => request("/dashboard_owner_upcoming.php",  { auth: true }),
  ownerSummary:          () => request("/dashboard_owner_summary.php",   { auth: true }),

  // ---- Earnings ----
  // qs: optional query string, e.g. "view=daily&year=2025&month=4"
  ownerEarnings: (qs = "") =>
    request(`/dashboard_owner_earnings.php${qs ? `?${qs}` : ""}`, { auth: true }),

  ownerEarningsRecent: () =>
    request("/dashboard_owner_earnings_recent.php", { auth: true }),

  // ---- Tractors ----
  createTractor:    (p) => request("/tractors_create.php",              { method: "POST", body: p, auth: true }),
  addTractor:       (p) => request("/add_tractor.php",                  { method: "POST", body: p, auth: true }),
  myTractors:       ()  => request("/tractors_me.php",                  { auth: true }),

  updateTractorAvailable:     (p) => request("/tractors_update_availability.php", { method: "POST", body: p, auth: true }),
  updateTractorAvailability:  (p) => request("/tractors_availability_update.php", { method: "POST", body: p, auth: true }),
  updateTractorCapability:    (p) => request("/tractors_capability_update.php",   { method: "POST", body: p, auth: true }),

  getNearbyTractors: (p) =>
    request("/get-nearby-tractors.php", { method: "POST", body: p, auth: true }),

  // ---- Payments ----
  paymentEstimate:  (p) => request("/payment_estimate.php",    { method: "POST", body: p, auth: true }),
  paymentIntent:    (p) => request("/payments_intent.php",     { method: "POST", body: p, auth: true }),
  paymentVerify:    (ref)=> request("/payments_verify.php",    { method: "POST", body: { reference: ref }, auth: true }),

  paystackInitialize: (p) =>
    request("/paystack_initialize.php", { method: "POST", body: p, auth: true }),

  paystackVerify: async (reference) => {
    const res = await fetch(`${API_BASE_URL}/paystack_verify.php`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        Authorization:   `Bearer ${localStorage.getItem("spiTractorsToken") || ""}`,
      },
      body: JSON.stringify({ reference }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Verification failed");
    return json;
  },

  getPaystackBanks: () => request("/paystack_banks.php"),
  savePayoutMethod: (p) => request("/payout_method_save.php", { method: "POST", body: p, auth: true }),

  // ---- Misc ----
  adminUsers:        () => request("/admin_users.php",        { auth: true }),
  walletMe:          () => request("/wallet_me.php",          { auth: true }),
  paymentWebhookDemo:(p) => request("/webhooks_payments.php", { method: "POST", body: p }),
};
