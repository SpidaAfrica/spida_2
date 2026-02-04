import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import EquipmentHeader from "../components/equipment/EquipmentHeader";
import EquipmentGrid from "../components/equipment/EquipmentGrid";

import "./Equipment.css";

export default function SpiTractorManageEquipment() {
  return (
    <div className="eq-shell">
      <Sidebar />

      <main className="eq-main">
        <Topbar />

        <div className="eq-content">
          <EquipmentHeader />
          <EquipmentGrid />
        </div>
      </main>
    </div>
  );
}
