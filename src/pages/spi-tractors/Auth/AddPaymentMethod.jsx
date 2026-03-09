import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddPaymentMethod.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function AddPaymentMethod() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);

  const [form, setForm] = useState({
    accountName: "",
    bankName: "",
    bankCode: "",
    accountNumber: "",
    bvn: "",
  });

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  // 🔥 Fetch Paystack banks
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const res = await spiTractorsApi.getPaystackBanks();
        setBanks(res?.data?.banks || []);
      } catch (e) {
        alert("Unable to load banks");
      }
    };
    loadBanks();
  }, []);

  const onBankSelect = (e) => {
    const code = e.target.value;
    const bank = banks.find((b) => b.code === code);
    setForm((p) => ({
      ...p,
      bankCode: code,
      bankName: bank?.name || "",
    }));
  };

  const onSave = async () => {
    if (loading) return;

    if (!form.accountName || !form.bankCode || !form.accountNumber) {
      alert("Please fill Account Name, Bank, and Account Number.");
      return;
    }

    try {
      setLoading(true);

      await spiTractorsApi.savePayoutMethod({
        account_name: form.accountName.trim(),
        bank_name: form.bankName,
        bank_code: form.bankCode,
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
            <label>Bank</label>
            <select value={form.bankCode} onChange={onBankSelect}>
              <option value="">Select your bank</option>
              {banks.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
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

        <button className="apm-secondary" onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}
