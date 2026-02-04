import EquipmentCard from "./EquipmentCard";
import img1 from "../../../../assets/images/spitractors/image 1.png"
import img2 from "../../../../assets/images/spitractors/image 4.png"
import img3 from "../../../../assets/images/spitractors/image 5.png"
import img4 from "../../../../assets/images/spitractors/image 6.png"
import img5 from "../../../../assets/images/spitractors/image 7.png"
import img6 from "../../../../assets/images/spitractors/image 8.png"

// Put these images in: public/equipment/
//  public/equipment/tractor1.jpg ... tractor6.jpg
const equipment = [
  {
    name: "Greenfield 6060X",
    reg: "ABC-456ZT",
    completed: 15,
    status: "Available",
    image: img1,
  },
  {
    name: "FarmMaster 7075Z",
    reg: "DEF-789LM",
    completed: 25,
    status: "Available",
    image: img2,
  },
  {
    name: "AgriPro 8080Y",
    reg: "GHI-012QR",
    completed: 30,
    status: "Under maintenance",
    image: img3,
  },
  {
    name: "HarvestKing 9095W",
    reg: "JKL-345OP",
    completed: 10,
    status: "Available",
    image: img4,
  },
  {
    name: "FieldRanger 5050T",
    reg: "MNO-678UV",
    completed: 22,
    status: "Available",
    image: img5,
  },
  {
    name: "CropStar 6065V",
    reg: "PQR-901WX",
    completed: 18,
    status: "Available",
    image: img6,
  },
];

export default function EquipmentGrid() {
  return (
    <div className="eq-grid">
      {equipment.map((e) => (
        <EquipmentCard key={e.reg} item={e} />
      ))}
    </div>
  );
}
