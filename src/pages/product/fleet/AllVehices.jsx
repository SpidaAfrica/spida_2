/*import React from "react";

import vehImg from "../../../assets/images/vehImg.png";
import { useNavigate } from "react-router-dom";

const AllVehicles = () => {
  const navigate = useNavigate();

  const handleRegisterNewVehicle = () => {
    navigate("/logistics/fleet/new");
  };

  return (
    <div className="all_vehicles_page">
      <div className="all_farms">
        <h1>List of Available Vehicles</h1>

        <div className="farm_items">
          <div className="farm_item">
            <h3>1</h3>
            <div className="item_img">
              <img src={vehImg} alt="" />
              <div className="item_name">
                <h3>Type of vehicle</h3>
                <p>Van</p>
              </div>
            </div>
            <div className="item_loc">
              <h3>Vehicle Registration Number</h3>
              <p>KJA-123XY</p>
            </div>
            <div className="item_size">
              <h3>Capacity of Vehicle</h3>
              <p>1,200 Kilograms</p>
            </div>
            <div className="item_crops">
              <h3>Vehicle made and model</h3>
              <p>Toyota HiAce Van</p>
            </div>
          </div>
          <div className="farm_item">
            <h3>1</h3>
            <div className="item_img">
              <img src={vehImg} alt="" />
              <div className="item_name">
                <h3>Type of vehicle</h3>
                <p>Van</p>
              </div>
            </div>
            <div className="item_loc">
              <h3>Vehicle Registration Number</h3>
              <p>KJA-123XY</p>
            </div>
            <div className="item_size">
              <h3>Capacity of Vehicle</h3>
              <p>1,200 Kilograms</p>
            </div>
            <div className="item_crops">
              <h3>Vehicle made and model</h3>
              <p>Toyota HiAce Van</p>
            </div>
          </div><div className="farm_item">
            <h3>1</h3>
            <div className="item_img">
              <img src={vehImg} alt="" />
              <div className="item_name">
                <h3>Type of vehicle</h3>
                <p>Van</p>
              </div>
            </div>
            <div className="item_loc">
              <h3>Vehicle Registration Number</h3>
              <p>KJA-123XY</p>
            </div>
            <div className="item_size">
              <h3>Capacity of Vehicle</h3>
              <p>1,200 Kilograms</p>
            </div>
            <div className="item_crops">
              <h3>Vehicle made and model</h3>
              <p>Toyota HiAce Van</p>
            </div>
          </div><div className="farm_item">
            <h3>1</h3>
            <div className="item_img">
              <img src={vehImg} alt="" />
              <div className="item_name">
                <h3>Type of vehicle</h3>
                <p>Van</p>
              </div>
            </div>
            <div className="item_loc">
              <h3>Vehicle Registration Number</h3>
              <p>KJA-123XY</p>
            </div>
            <div className="item_size">
              <h3>Capacity of Vehicle</h3>
              <p>1,200 Kilograms</p>
            </div>
            <div className="item_crops">
              <h3>Vehicle made and model</h3>
              <p>Toyota HiAce Van</p>
            </div>
          </div><div className="farm_item">
            <h3>1</h3>
            <div className="item_img">
              <img src={vehImg} alt="" />
              <div className="item_name">
                <h3>Type of vehicle</h3>
                <p>Van</p>
              </div>
            </div>
            <div className="item_loc">
              <h3>Vehicle Registration Number</h3>
              <p>KJA-123XY</p>
            </div>
            <div className="item_size">
              <h3>Capacity of Vehicle</h3>
              <p>1,200 Kilograms</p>
            </div>
            <div className="item_crops">
              <h3>Vehicle made and model</h3>
              <p>Toyota HiAce Van</p>
            </div>
          </div>
        </div>

        <div className="add_new_farm">
          <button onClick={handleRegisterNewVehicle}>Register new vehicle</button>
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import vehImg from "../../../assets/images/vehImg.png";

const AllVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const logistics_id = sessionStorage.getItem("logisticsId");

  // Fetch vehicles from API
  useEffect(() => {
    fetch(`https://api.spida.africa/logistics/get_vehicles.php?logistics_id=${logistics_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setVehicles(data.vehicles);
        } else {
          console.error("Failed to fetch vehicles");
        }
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, []);

  return (
    <div className="all_vehicles_page">
      <div className="all_farms">
        <h1>List of Available Vehicles</h1>

        <div className="farm_items">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <div className="farm_item" key={vehicle.id}>
                <h3>{index + 1}</h3>
                <div className="item_img">
                  <img src={`https://api.spida.africa/logistics/${vehicle.vehicle_img}` || vehImg} alt="Vehicle" style={{ width: "100px" }}/>
                  <div className="item_name">
                    <h3>Type of vehicle</h3>
                    <p>{vehicle.vehicle_type}</p>
                  </div>
                </div>
                <div className="item_loc">
                  <h3>Vehicle Registration Number</h3>
                  <p>{vehicle.vehicle_number}</p>
                </div>
                <div className="item_size">
                  <h3>Capacity of Vehicle</h3>
                  <p>{vehicle.vehicle_capacity} Kilograms</p>
                </div>
                <div className="item_crops">
                  <h3>Vehicle make and model</h3>
                  <p>{vehicle.vehicle_model}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No vehicles available</p>
          )}
        </div>

        <div className="add_new_farm">
          <button onClick={() => navigate("/logistics/fleet/new")}>
            Register new vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;

