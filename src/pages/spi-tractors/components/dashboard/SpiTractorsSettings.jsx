import { useEffect, useState } from "react";
import "./Settings.css";
import { spiTractorsApi } from "../api/spiTractorsApi";

export default function SpiTractorsSettings() {
  const [loading, setLoading] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);

  const [banks, setBanks] = useState([]);

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
  });

  const [pwd, setPwd] = useState({
    current_password: "",
    new_password: "",
  });

  const [payout, setPayout] = useState({
    account_name: "",
    bank_name: "",
    bank_code: "",
    account_number: "",
    bvn: "",
  });

  const onP = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));
  const onPwd = (k) => (e) => setPwd((p) => ({ ...p, [k]: e.target.value }));
  const onPay = (k) => (e) => setPayout((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const [meRes, payoutRes, banksRes] = await Promise.all([
          spiTractorsApi.me(),
          spiTractorsApi.settingsGet(),      // backend below
          spiTractorsApi.getPaystackBanks(),
        ]);

        const u = meRes?.data?.user || meRes?.data || {};
        setProfile({
          full_name: u.full_name || u.name || "",
          phone: u.phone || "",
        });

        const s = payoutRes?.data || {};
        setPayout({
          account_name: s?.payout?.account_name || "",
          bank_name: s?.payout?.bank_name || "",
          bank_code: s?.payout?.bank_code || "",
          account_number: s?.payout?.account_number || "",
          bvn: s?.payout?.bvn || "",
        });

        setBanks(banksRes?.data?.banks || []);
      } catch (e) {
        // ignore for now; your auth layer will redirect elsewhere if needed
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const onSelectBank = (e) => {
    const code = e.target.value;
    const bank = banks.find((b) => b.code === code);
    setPayout((p) => ({
      ...p,
      bank_code: code,
      bank_name: bank?.name || "",
    }));
  };

  const saveProfile = async () => {
    if (savingProfile) return;
    if (!profile.full_name.trim()) return alert("Full name is required.");

    try {
      setSavingProfile(true);
      await spiTractorsApi.settingsUpdateProfile({
        full_name: profile.full_name.trim(),
        phone: profile.phone.trim(),
      });
      alert("Profile updated");
    } catch (e) {
      alert(e?.message || "Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (savingPwd) return;
    if (!pwd.current_password || !pwd.new_password) return alert("Fill both password fields.");
    if (pwd.new_password.length < 6) return alert("New password must be at least 6 characters.");

    try {
      setSavingPwd(true);
      await spiTractorsApi.settingsChangePassword({
        current_password: pwd.current_password,
        new_password: pwd.new_password,
      });
      setPwd({ current_password: "", new_password: "" });
      alert("Password updated");
    } catch (e) {
      alert(e?.message || "Unable to change password");
    } finally {
      setSavingPwd(false);
    }
  };

  const savePayout = async () => {
    if (savingPayout) return;
    if (!payout.account_name.trim() || !payout.bank_code || !payout.account_number.trim()) {
      return alert("Account name, bank and account number are required.");
    }

    try {
      setSavingPayout(true);
      await spiTractorsApi.savePayoutMethod({
        account_name: payout.account_name.trim(),
        bank_name: payout.bank_name,
        bank_code: payout.bank_code,
        account_number: payout.account_number.trim(),
        bvn: payout.bvn.trim(),
      });
      alert("Payout method saved");
    } catch (e) {
      alert(e?.message || "Unable to save payout method");
    } finally {
      setSavingPayout(false);
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading settings…</div>;

  return (
    <div className="stg-page">
      <h1 className="stg-title">Settings</h1>

      <div className="stg-grid">
        {/* Profile */}
        <section className="stg-card">
          <h2>Profile</h2>

          <label>Full name</label>
          <input value={profile.full_name} onChange={onP("full_name")} placeholder="Your name" />

          <label>Phone</label>
          <input value={profile.phone} onChange={onP("phone")} placeholder="e.g 08012345678" />

          <button className="stg-btn" onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </section>

        {/* Password */}
        <section className="stg-card">
          <h2>Change password</h2>

          <label>Current password</label>
          <input type="password" value={pwd.current_password} onChange={onPwd("current_password")} />

          <label>New password</label>
          <input type="password" value={pwd.new_password} onChange={onPwd("new_password")} />

          <button className="stg-btn" onClick={changePassword} disabled={savingPwd}>
            {savingPwd ? "Updating..." : "Update password"}
          </button>
        </section>

        {/* Payout */}
        <section className="stg-card stg-span">
          <h2>Payout details</h2>

          <div className="stg-row">
            <div>
              <label>Account name</label>
              <input value={payout.account_name} onChange={onPay("account_name")} />
            </div>

            <div>
              <label>Bank</label>
              <select value={payout.bank_code} onChange={onSelectBank}>
                <option value="">Select bank</option>
                {banks.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="stg-row">
            <div>
              <label>Account number</label>
              <input value={payout.account_number} onChange={onPay("account_number")} inputMode="numeric" />
            </div>
            <div>
              <label>BVN (optional)</label>
              <input value={payout.bvn} onChange={onPay("bvn")} inputMode="numeric" />
            </div>
          </div>

          <button className="stg-btn" onClick={savePayout} disabled={savingPayout}>
            {savingPayout ? "Saving..." : "Save payout details"}
          </button>
        </section>
      </div>
    </div>
  );
}
