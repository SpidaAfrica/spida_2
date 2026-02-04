import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const handleSubmit = async () => {
    if (loading) return;

    // Basic frontend validation
    if (!full_name || !email || !phone || !password) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("full_name", full_name);
    formData.append("date_of_birth", date_of_birth); // YYYY-MM-DD
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("id_type", id_type);
    formData.append("id_number", id_number);
    formData.append("city", city);
    formData.append("home_address", home_address);

    if (utilityBill) {
      formData.append("utility_bill", utilityBill);
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://api.spida.africa/spi_tractors/signup.php",
        {
          method: "POST",
          body: formData, // IMPORTANT: no headers here
        }
      );

      const data = await res.json();

      if (data.success) {
        navigate("/Spi_Tractors-Verify-Email/", {
          state: { email: data.email },
        });
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Back Arrow */}
      <div className="back-btn" onClick={() => navigate(-1)}>←</div>

      <div className="signup-container">
        <h1>Create Your Spida Account</h1>
        <p className="subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
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
              <label>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email Address"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your Phone Number"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
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

          {/* Upload */}
          <div className="upload-box">
            <label className="upload-label">
              Upload your Utility Bill
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setUtilityBill(e.target.files[0])}
              />
            </label>
            {utilityBill && <small>{utilityBill.name}</small>}
          </div>

          <button className="submit-btn" type="button" onClick={handleSubmit}>
            {loading ? "Processing..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Spi_Tractors_Signup;
