import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPaymentMethod.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function AddPaymentMethod() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    accountName: "",
    bankName: "",
    bankCode: "",       // ✅ paystack bank code (optional but recommended)
    accountNumber: "",
    bvn: "",
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSave = async () => {
    if (loading) return;

    if (!form.accountName.trim() || !form.bankName.trim() || !form.accountNumber.trim()) {
      alert("Account Name, Bank, and Account Number are required.");
      return;
    }

    try {
      setLoading(true);

      await spiTractorsApi.savePayoutMethod({
        account_name: form.accountName.trim(),
        bank_name: form.bankName.trim(),
        bank_code: form.bankCode.trim(), // if empty, backend won't call paystack
        account_number: form.accountNumber.trim(),
        bvn: form.bvn.trim(),
      });

      navigate("/Spi_Tractors-Dashboard");
    } catch (e) {
      alert(e?.message || "Unable to save payment method");
    } finally {
      setLoading(false);
    }
  };

  const onSkip = () => navigate("/Spi_Tractors-Dashboard");

  return (
    <div className="apm-page">
      <div className="apm-container">
        <h1 className="apm-title">Add Payment method</h1>
        <p className="apm-subtitle">
          Add your payout details so you can receive payments.
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
            <label>Bank Name</label>
            <input
              value={form.bankName}
              onChange={onChange("bankName")}
              placeholder="e.g Access Bank"
            />
          </div>

          <div className="apm-field">
            <label>Bank Code (Paystack)</label>
            <input
              value={form.bankCode}
              onChange={onChange("bankCode")}
              placeholder="e.g 044"
            />
            <small style={{ opacity: 0.8 }}>
              Optional, but recommended. If provided, we create a Paystack transfer recipient.
            </small>
          </div>

          <div className="apm-field">
            <label>Account Number</label>
            <input
              value={form.accountNumber}
              onChange={onChange("accountNumber")}
              placeholder="e.g 0123456789"
              inputMode="numeric"
            />
          </div>

          <div className="apm-field">
            <label>BVN (Optional)</label>
            <input
              value={form.bvn}
              onChange={onChange("bvn")}
              placeholder="e.g 22123456789"
              inputMode="numeric"
            />
          </div>
        </div>

        <button className="apm-primary" onClick={onSave} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>

        <button className="apm-secondary" onClick={onSkip} disabled={loading}>
          Skip
        </button>
      </div>
    </div>
  );
}
