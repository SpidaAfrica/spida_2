import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { saveSession, spiTractorsApi } from "../api/spiTractorsApi";

const Spi_Tractors_Signup = () => {
  const navigate = useNavigate();

  const [full_name, setFullName] = useState("");
  const [date_of_birth, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [id_type, setIdType] = useState("Government Issued ID");
  const [id_number, setIdNumber] = useState("");
  const [city, setCity] = useState("");
  const [home_address, setHomeAddress] = useState("");
  const [utilityBill, setUtilityBill] = useState(null);
  const [loading, setLoading] = useState(false);

  const onPickFile = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setUtilityBill(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(f.type)) {
      alert("Utility bill must be JPG, PNG, or PDF.");
      e.target.value = "";
      setUtilityBill(null);
      return;
    }

    // optional: 5MB limit
    const maxBytes = 5 * 1024 * 1024;
    if (f.size > maxBytes) {
      alert("Utility bill must be 5MB or less.");
      e.target.value = "";
      setUtilityBill(null);
      return;
    }

    setUtilityBill(f);
  };

const handleSubmit = async () => {
  if (loading) return;

  if (!full_name || !email || !phone || !password) {
    alert("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);

    const form = new FormData();
    form.append("email", email.trim());
    form.append("password", password);
    form.append("role", "TRACTOR_OWNER");
    form.append("full_name", full_name.trim());
    form.append("phone", phone.trim());

    if (date_of_birth) form.append("date_of_birth", date_of_birth);
    if (id_type) form.append("id_type", id_type);
    if (id_number) form.append("id_number", id_number.trim());
    if (city) form.append("city", city.trim());
    if (home_address) form.append("home_address", home_address.trim());

    if (utilityBill) form.append("utility_bill", utilityBill);

    const res = await spiTractorsApi.register(form);

    const user = res?.data?.user;
    const token = res?.data?.token;
    const emailVerifyToken = res?.data?.email_verification_token;

    if (!res?.success || !user || !token) {
      throw new Error(res?.message || "Registration failed.");
    }

    saveSession(user, token, emailVerifyToken);

    navigate("/Spi_Tractors-Verify-Email/", {
      state: { email: user?.email || email.trim() },
    });
  } catch (err) {
    alert(err?.message || "Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="signup-page">
      <div className="back-btn" onClick={() => navigate(-1)}>
        ←
      </div>

      <div className="signup-container">
        <h1>Create Your Spida Account</h1>
        <p className="subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your Full Name"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={date_of_birth}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email Address"
                type="email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone Number"
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label>Identity Verification</label>
              <select value={id_type} onChange={(e) => setIdType(e.target.value)}>
                <option>Government Issued ID</option>
              </select>
            </div>

            <div className="form-group">
              <label>Identity Verification Number</label>
              <input
                value={id_number}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Enter Identification Number"
              />
            </div>

            <div className="form-group">
              <label>Location (City)</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your City"
              />
            </div>

            <div className="form-group">
              <label>Home Address</label>
              <input
                value={home_address}
                onChange={(e) => setHomeAddress(e.target.value)}
                placeholder="Enter Home Address"
              />
            </div>
          </div>

          <div className="upload-box">
            <label className="upload-label">
              Upload your Utility Bill (JPG/PNG/PDF)
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={onPickFile}
              />
            </label>

            {utilityBill ? (
              <small>
                {utilityBill.name} • {(utilityBill.size / 1024 / 1024).toFixed(2)}MB
              </small>
            ) : (
              <small>No file selected</small>
            )}
          </div>

          <button
            className="submit-btn"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Spi_Tractors_Signup;
