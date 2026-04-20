import { useEffect, useMemo, useState, forwardRef, useImperativeHandle } from "react";
import EquipmentCard from "./EquipmentCard";
import img1 from "../../../../assets/images/spitractors/image 1.png";
import img2 from "../../../../assets/images/spitractors/image 4.png";
import img3 from "../../../../assets/images/spitractors/image 5.png";
import img4 from "../../../../assets/images/spitractors/image 6.png";
import img5 from "../../../../assets/images/spitractors/image 7.png";
import img6 from "../../../../assets/images/spitractors/image 8.png";
import { spiTractorsApi } from "../../api/spiTractorsApi";

const fallbackImages = [img1, img2, img3, img4, img5, img6];

const EquipmentGrid = forwardRef((props, ref) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading]     = useState(false);

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

  useImperativeHandle(ref, () => ({ reload: load }));

  useEffect(() => { load(); }, []);

  const mapped = useMemo(() => {
    return equipment.map((e, idx) => ({
      // Identity
      id:   e.id,
      name: e.name,
      reg:  e.registration_id,

      // Detail fields
      model:         e.model,
      brand:         e.brand,
      spec:          e.spec,
      release_year:  e.release_year,
      travel_speed:  e.travel_speed,
      base_rate:     e.base_rate_per_hour,
      daily_capacity:e.daily_capacity,
      city:          e.city,
      lat:           e.lat,
      lng:           e.lng,

      // Card meta
      completed: Number(e.completed_jobs || 0),
      status:    e.availability_status || "Available",
      image:     fallbackImages[idx % fallbackImages.length],
    }));
  }, [equipment]);

  if (loading && mapped.length === 0)
    return <div style={{ padding: 12 }}>Loading...</div>;

  if (!loading && mapped.length === 0)
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
        No equipment found. Add your first tractor above.
      </div>
    );

  return (
    <div className="eq-grid">
      {mapped.map((e) => (
        <EquipmentCard key={e.reg || e.id} item={e} onSaved={load} />
      ))}
    </div>
  );
});

export default EquipmentGrid;
