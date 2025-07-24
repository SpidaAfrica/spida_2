/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import productImage from "../../../assets/images/productImage.jpeg";
import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";
import productItems from "../../../data/productList";

import "./myFarm.css";

const MyFarm = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page

  // Calculate the products to display for the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = productItems.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Total pages
  const totalPages = Math.ceil(productItems.length / itemsPerPage);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNewProduce = () => {
    navigate("/farmer/my-farm/new-produce");
  };

  return (
    <div className="my_farm_page">
      <h1>Farm Produce</h1>

      <div className="my_farm_products">
        {currentProducts.map((product) => (
          <div className="product" key={product.id}>
            <img src={product.photo} alt={product.name} />
            <div className="my_product_details">
              <label htmlFor="organic-cert">Organic Certification</label>
              <div>
                <h2>{product.name}</h2>
                <p>Harvest Date: {product.harvestDate}</p>
              </div>
              <div>
                <h2>
                  #{product.price} per {product.unit}
                </h2>
                <p>
                  Available Quantity: {product.available} {product.unit}s | MOQ:{" "}
                  {product.moq} {product.unit}s
                </p>
              </div>
              <div>
                <h2>{product.region}</h2>
                <p>Pickup: {product.farmAddress}</p>
              </div>
              <button>REMOVE FROM LIST</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <img src={prev} alt="" />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "active" : ""}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <img src={next} alt="" />
          </button>
        </div>
      </div>

      <div className="new_produce">
        <button onClick={handleNewProduce}>ADD NEW FARM PRODUCE</button>
      </div>
    </div>
  );
};

export default MyFarm;
*/



import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";

import "./myFarm.css";

const MyFarm = () => {
  const navigate = useNavigate();
  const { farmId } = useParams(); // Get farm ID from the URL params
  const [products, setProducts] = useState([]); // Store produce data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch farm produce from the backend
  useEffect(() => {
    const fetchFarmProduce = async () => {
      try {
        const response = await fetch(`https://api.spida.africa/farmer/get_farm_produce.php?farm_id=${farmId}`);
        const data = await response.json();

        if (data) {
          setProducts(data);
          console.log(data);
        } else {
          throw new Error("Failed to fetch farm produce.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmProduce();
  }, [farmId]);

  // Pagination logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleNewProduce = () => navigate(`/farmer/my-farm/${farmId}/new-produce`);

  if (loading) return <div className="loading">Loading farm produce...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my_farm_page">
      <h1>Farm Produce</h1>

      {products.length === 0 ? (
        <p className="no_produce">No produce found for this farm.</p>
      ) : (
        <>
          <div className="my_farm_products">
            {currentProducts.map((product) => (
              <div className="product" key={product.id}>
                <img src={`https://api.spida.africa/farmer/${product.product_image}`} alt={product.produce_name} style={{ width: "100px" }} />
                <div className="my_product_details">
                  <label>Organic Certification</label>
                  <div>
                    <h2>{product.produce_name}</h2>
                    <p>Harvest Date: {product.harvest_date}</p>
                  </div>
                  <div>
                    <h2>₦{product.price_per_unit} per unit</h2>
                    <p>Available: {product.available} bags | MOQ: {product.quantity_moq} units</p>
                  </div>
                  <div>
                    <h2>{product.region}</h2>
                    <p>Pickup: {product.pickup_location}</p>
                  </div>
                  <button>REMOVE FROM LIST</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <span onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <img src={prev} alt="Previous" />
            </span>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <span key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : ""}>
                {page}
              </span>
            ))}

            <span onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <img src={next} alt="Next" />
            </span>
          </div>
        </>
      )}

      <div className="new_produce">
        <button onClick={handleNewProduce}>ADD NEW FARM PRODUCE</button>
      </div>
    </div>
  );
};

export default MyFarm;

