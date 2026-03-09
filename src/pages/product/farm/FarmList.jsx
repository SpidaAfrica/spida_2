/*
import React from "react";
import { useNavigate } from "react-router-dom";

import farmImg from "../../../assets/images/farmimg.png";

import "./farm.css";

const FarmList = () => {
  const navigate = useNavigate()

  const handleAddNewFarm = () => {
    navigate("/farmer/my-farm/new");
  }
  return (
    <div className="all_farms">
      <h1>List of Farms</h1>

      <div className="farm_items">
        <div className="farm_item">
          <h3>1</h3>
          <div className="item_img">
            <img src={farmImg} alt="" />
            <div className="item_name">
              <h3>Name of Farm</h3>
              <p>Adisa Farm</p>
            </div>
          </div>
          <div className="item_loc">
            <h3>Farm Location</h3>
            <p>Ogun State</p>
          </div>
          <div className="item_size">
            <h3>Farm Size</h3>
            <p>200 Acres</p>
          </div>
          <div className="item_crops">
            <h3>Crops Grown</h3>
            <p>Beans, Rice, Millet</p>
          </div>
        </div>
        <div className="farm_item">
          <h3>2</h3>
          <div className="item_img">
            <img src={farmImg} alt="" />
            <div className="item_name">
              <h3>Name of Farm</h3>
              <p>Adisa Farm</p>
            </div>
          </div>
          <div className="item_loc">
            <h3>Farm Location</h3>
            <p>Ogun State</p>
          </div>
          <div className="item_size">
            <h3>Farm Size</h3>
            <p>200 Acres</p>
          </div>
          <div className="item_crops">
            <h3>Crops Grown</h3>
            <p>Beans, Rice, Millet</p>
          </div>
        </div>
        <div className="farm_item">
          <h3>1</h3>
          <div className="item_img">
            <img src={farmImg} alt="" />
            <div className="item_name">
              <h3>Name of Farm</h3>
              <p>Adisa Farm</p>
            </div>
          </div>
          <div className="item_loc">
            <h3>Farm Location</h3>
            <p>Ogun State</p>
          </div>
          <div className="item_size">
            <h3>Farm Size</h3>
            <p>200 Acres</p>
          </div>
          <div className="item_crops">
            <h3>Crops Grown</h3>
            <p>Beans, Rice, Millet</p>
          </div>
        </div>
        <div className="farm_item">
          <h3>2</h3>
          <div className="item_img">
            <img src={farmImg} alt="" />
            <div className="item_name">
              <h3>Name of Farm</h3>
              <p>Adisa Farm</p>
            </div>
          </div>
          <div className="item_loc">
            <h3>Farm Location</h3>
            <p>Ogun State</p>
          </div>
          <div className="item_size">
            <h3>Farm Size</h3>
            <p>200 Acres</p>
          </div>
          <div className="item_crops">
            <h3>Crops Grown</h3>
            <p>Beans, Rice, Millet</p>
          </div>
        </div>
        <div className="farm_item">
          <h3>1</h3>
          <div className="item_img">
            <img src={farmImg} alt="" />
            <div className="item_name">
              <h3>Name of Farm</h3>
              <p>Adisa Farm</p>
            </div>
          </div>
          <div className="item_loc">
            <h3>Farm Location</h3>
            <p>Ogun State</p>
          </div>
          <div className="item_size">
            <h3>Farm Size</h3>
            <p>200 Acres</p>
          </div>
          <div className="item_crops">
            <h3>Crops Grown</h3>
            <p>Beans, Rice, Millet</p>
          </div>
        </div>
        <div className="farm_item">
          <h3>2</h3>
          <div className="item_img">
            <img src={farmImg} alt="" />
            <div className="item_name">
              <h3>Name of Farm</h3>
              <p>Adisa Farm</p>
            </div>
          </div>
          <div className="item_loc">
            <h3>Farm Location</h3>
            <p>Ogun State</p>
          </div>
          <div className="item_size">
            <h3>Farm Size</h3>
            <p>200 Acres</p>
          </div>
          <div className="item_crops">
            <h3>Crops Grown</h3>
            <p>Beans, Rice, Millet</p>
          </div>
        </div>
      </div>

      <div className="add_new_farm">
        <button onClick={handleAddNewFarm}>Add new farm</button>
      </div>
    </div>
  );
};

export default FarmList;
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import farmImg from "../../../assets/images/farmimg.png";
import "./farm.css";


const FarmList = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /*
  useEffect(() => {
    const farmer_id = localStorage.getItem('userId');
    fetch(`https://api.spida.africa/farmer/farm.php?farmer_id=${farmer_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setFarms(data.farms);
          console.log(data.farms);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  */

  useEffect(() => {
      const fetchFarmData = async () => {
        try {
          const farmer_id = sessionStorage.getItem("farmerId"); // Get user ID from localStorage
          if (!farmer_id) {
            throw new Error("User not logged in");
          }
  
          const statsResponse = await fetch(`https://api.spida.africa/farmer/farm.php?farmer_id=${farmer_id}`);
  
          const statsData = await statsResponse.json();
  
          setFarms(statsData.farms);
          console.log(statsData.farms.farm_id);
  
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchFarmData();
    }, []);

  const handleAddNewFarm = () => {
    navigate("/farmer/my-farm/new");
  };
  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  const produceList = (farmId) =>{
    navigate(`/farmer/my-farm/${farmId}/produce-list`);
  }
  return (
    <div className="all_farms">
      <h1>List of Farms</h1>

      <div className="farm_items">
        {farms.length > 0 ? (
          farms.map((farm, index) => (
            <div className="farm_item" key={farm.id} onClick={() => produceList(farm.farm_id)} style={{cursor:"pointer"}}>
              <h3>{index + 1}</h3>
              <div className="item_img">
                <img src={`https://api.spida.africa/farmer/${farm.farm_images}` || farmImg} alt="Farm" style={{width:100}} />
                <div className="item_name">
                  <h3>Name of Farm</h3>
                  <p>{farm.farm_name}</p>
                </div>
              </div>
              <div className="item_loc">
                <h3>Farm Location</h3>
                <p>{farm.farm_location}</p>
              </div>
              <div className="item_size">
                <h3>Farm Size</h3>
                <p>{farm.farm_size}</p>
              </div>
              <div className="item_crops">
                <h3>Crops Grown</h3>
                <p>{farm.crop_type}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No farms found.</p>
        )}
      </div>

      <div className="add_new_farm">
        <button onClick={handleAddNewFarm}>Add new farm</button>
      </div>
    </div>
  );
};

export default FarmList;
