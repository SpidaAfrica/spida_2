import { useEffect, useMemo, useState } from "react";
import EquipmentCard from "./EquipmentCard";
import img1 from "../../../../assets/images/spitractors/image 1.png";
import img2 from "../../../../assets/images/spitractors/image 4.png";
import img3 from "../../../../assets/images/spitractors/image 5.png";
import img4 from "../../../../assets/images/spitractors/image 6.png";
import img5 from "../../../../assets/images/spitractors/image 7.png";
import img6 from "../../../../assets/images/spitractors/image 8.png";
import { spiTractorsApi } from "../../api/spiTractorsApi";

const fallbackImages = [img1, img2, img3, img4, img5, img6];

export default function EquipmentGrid() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    spiTractorsApi
      .myTractors()
      .then((res) => {
        setEquipment(res?.data || []);
      })
      .catch(() => setEquipment([]));
  }, []);

  const mapped = useMemo(() => {
    return equipment.map((e, idx) => ({
      name: e.name,
      reg: e.registration_id,
      completed: 0,
      status: e.status,
      image: fallbackImages[idx % fallbackImages.length],
    }));
  }, [equipment]);

  return (
    <div className="eq-grid">
      {mapped.map((e) => (
        <EquipmentCard key={e.reg} item={e} />
      ))}
    </div>
  );
}
