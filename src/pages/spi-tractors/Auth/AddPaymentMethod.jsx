import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPaymentMethod.css";

export default function AddPaymentMethod() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountName: "",
    bank: "",
    accountNumber: "",
    bvn: "",
    releaseYear: "",
  });

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSave = () => {
    // TODO: send to backend
    navigate("/Spi_Tractors-Dashboard"); // change to next onboarding page
  };

  const onSkip = () => {
    navigate("/Spi_Tractors-Dashboard"); // change to next onboarding page
  };

  return (
    <div className="apm-page">
      <div className="apm-container">
        <h1 className="apm-title">Add Payment method</h1>
        <p className="apm-subtitle">
          Sign up to access affordable mechanization services and optimize your farming.
        </p>

        <h2 className="apm-section">Payment Details:</h2>

        <div className="apm-form">
          <div className="apm-field">
            <label>Account Name</label>
            <input
              value={form.accountName}
              onChange={onChange("accountName")}
              placeholder="e.g Adisa Jairo Yusuf"
            />
          </div>

          <div className="apm-field">
            <label>Bank</label>
            <input
              value={form.bank}
              onChange={onChange("bank")}
              placeholder="e.g Spida Bank"
            />
          </div>

          <div className="apm-field">
            <label>Account Number</label>
            <input
              value={form.accountNumber}
              onChange={onChange("accountNumber")}
              placeholder="e.g 238985409"
            />
          </div>

          <div className="apm-field">
            <label>BVN</label>
            <input
              value={form.bvn}
              onChange={onChange("bvn")}
              placeholder="e.g 43798325235"
            />
          </div>

          {/* Full width row */}
          <div className="apm-field full">
            <label>Release Year</label>
            <input
              value={form.releaseYear}
              onChange={onChange("releaseYear")}
              placeholder="e.g 2020"
            />
          </div>
        </div>

        <button className="apm-primary" onClick={onSave}>
          Save &amp; Continue
        </button>

        <button className="apm-secondary" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}
