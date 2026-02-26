whats wrong here in the syntax import { useEffect, useMemo, useState } from "react";
import EquipmentCard from "./EquipmentCard";
import img1 from "../../../../assets/images/spitractors/image 1.png";
import img2 from "../../../../assets/images/spitractors/image 4.png";
import img3 from "../../../../assets/images/spitractors/image 5.png";
import img4 from "../../../../assets/images/spitractors/image 6.png";
import img5 from "../../../../assets/images/spitractors/image 7.png";
import img6 from "../../../../assets/images/spitractors/image 8.png";
import { spiTractorsApi } from "../../api/spiTractorsApi";

const fallbackImages = [img1, img2, img3, img4, img5, img6];

import { forwardRef, useImperativeHandle } from "react";

const EquipmentGrid = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    reload: load,
  }));
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await spiTractorsApi.myTractors();
      setEquipment(Array.isArray(res?.data) ? res.data : []);
    } catch {
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const mapped = useMemo(() => {
    return equipment.map((e, idx) => ({
      id: e.id,
      name: e.name,
      reg: e.registration_id,
      completed: Number(e.completed_jobs || 0),
      status: e.availability_status || "Available",
      image: fallbackImages[idx % fallbackImages.length],
    }));
  }, [equipment]);

  if (loading && mapped.length === 0) return <div style={{ padding: 12 }}>Loading...</div>;

  return (
    <div className="eq-grid">
      {mapped.map((e) => (
        <EquipmentCard key={e.reg} item={e} onSaved={load} />
      ))}
    </div>
  );
} export default EquipmentGrid;
