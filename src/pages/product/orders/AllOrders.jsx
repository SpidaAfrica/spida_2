import React, { useState } from "react";

import prev from "../../../assets/images/icons/prev.png";
import next from "../../../assets/images/icons/next.png";
import orders from "../../../data/orders";
import FarmerOrders from "./FarmerOrders";

const AllOrders = () => {
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 10; // Number of products per page

  const userType = "logistics";

  // Calculate the products to display for the current page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstProduct, indexOfLastProduct);

  // Total pages
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="recent_orders pickup_summaries all_orders_page">
      <FarmerOrders
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        currentOrders={currentOrders}
      />
    </div>
  );
};

export default AllOrders;
