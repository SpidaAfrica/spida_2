import { useRef } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

import EquipmentHeader from "../components/equipment/EquipmentHeader";
import EquipmentGrid from "../components/equipment/EquipmentGrid";

import "./Equipment.css";

export default function SpiTractorManageEquipment() {
  const gridRef = useRef(null);

  return (
    <div className="eq-shell">
      <Sidebar />

      <main className="eq-main">
        <Topbar />

        <div className="eq-content">
          <EquipmentHeader onCreated={() => gridRef.current?.reload?.()} />
          <EquipmentGrid ref={gridRef} />
        </div>
      </main>
    </div>
  );
}
