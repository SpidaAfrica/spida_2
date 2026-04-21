import { useEffect, useState } from "react";
import "./SplashScreen.css";
import logo from "../../assets/images/logo2.png";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade"), 2000);
    const t2 = setTimeout(() => onDone?.(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`splash ${phase === "fade" ? "splash-fade" : ""}`}>
      <div className="splash-inner">
        <div className="splash-logo-wrap">
          <img src={logo} alt="Spida Tractors" className="splash-logo-img" />
        </div>

        <div className="splash-tagline">Mechanized farming, made easy</div>

        <div className="splash-loader">
          <div className="splash-loader-bar" />
        </div>
      </div>
    </div>
  );
}
