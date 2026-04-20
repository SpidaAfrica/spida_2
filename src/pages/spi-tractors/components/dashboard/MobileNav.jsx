import { NavLink } from "react-router-dom";
import "./MobileNav.css";

import home    from "../../../../assets/images/category.png";
import req     from "../../../../assets/images/message-2.png";
import booking from "../../../../assets/images/elements (6).png";
import earning from "../../../../assets/images/elements (7).png";
import equip   from "../../../../assets/images/elements (8).png";

const TABS = [
  { to: "/Spi_Tractors-Dashboard",              icon: home,    label: "Home"      },
  { to: "/Spi_Tractors-Dashboard-Requests",     icon: req,     label: "Requests"  },
  { to: "/Spi_Tractors-Dashboard-Bookings",     icon: booking, label: "Bookings"  },
  { to: "/Spi_Tractors-Dashboard-Earnings",     icon: earning, label: "Earnings"  },
  { to: "/Spi_Tractors-Dashboard-Manage-Equipment", icon: equip, label: "Equipment" },
];

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            "mobile-nav-item" + (isActive ? " active" : "")
          }
          end={tab.to === "/Spi_Tractors-Dashboard"}
        >
          <img src={tab.icon} alt={tab.label} className="mobile-nav-icon" />
          <span className="mobile-nav-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
