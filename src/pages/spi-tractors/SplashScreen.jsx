import { useEffect, useState } from "react";
import "./SplashScreen.css";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("show"); // show | fade

  useEffect(() => {
    // Hold splash for 2 seconds then fade out
    const t1 = setTimeout(() => setPhase("fade"), 2000);
    const t2 = setTimeout(() => onDone?.(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`splash ${phase === "fade" ? "splash-fade" : ""}`}>
      <div className="splash-inner">
        {/* Logo / icon */}
        <div className="splash-logo">
          <svg viewBox="0 0 80 80" width="80" height="80" fill="none">
            <circle cx="40" cy="40" r="40" fill="#16a34a" />
            {/* Tractor wheel */}
            <circle cx="28" cy="52" r="12" stroke="#fff" strokeWidth="3" fill="none"/>
            <circle cx="28" cy="52" r="4"  fill="#fff"/>
            {/* Tractor wheel small */}
            <circle cx="54" cy="56" r="8"  stroke="#fff" strokeWidth="3" fill="none"/>
            <circle cx="54" cy="56" r="3"  fill="#fff"/>
            {/* Tractor body */}
            <rect x="28" y="36" width="30" height="18" rx="3" fill="#fff" opacity="0.9"/>
            {/* Cab */}
            <rect x="42" y="28" width="16" height="12" rx="3" fill="#fff" opacity="0.9"/>
            {/* Exhaust */}
            <rect x="55" y="22" width="4" height="10" rx="2" fill="#fff" opacity="0.7"/>
          </svg>
        </div>

        <div className="splash-name">Spida Tractors</div>
        <div className="splash-tagline">Mechanized farming, made easy</div>

        <div className="splash-loader">
          <div className="splash-loader-bar" />
        </div>
      </div>
    </div>
  );
}
