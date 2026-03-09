import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Nav from "../../../components/Header/Nav";
import ReadyToConnect from "../../../components/ready_to_connect/ReadyToConnect";
import ProductItem from "../../../components/productItem/ProductItem";
import productItems from "../../../data/productList";
import posts from "../../../data/posts";
import marketplacebanner from "../../../assets/images/marketplacebanner.png";
import bannerfruit from "../../../assets/images/banner_fruit.png";
import arrowRight from "../../../assets/images/icons/arrow-right.png";
import bulkImg from "../../../assets/images/bulkImg.png";
import star1 from "../../../assets/images/icons/1star.png";
import star2 from "../../../assets/images/icons/2star.png";
import star3 from "../../../assets/images/icons/3star.png";
import star4 from "../../../assets/images/icons/4star.png";
import vector from "../../../assets/images/hero_vector.png";
import Footer from "../../../components/Footer/Footer";

import "./marketplace.css";

const Marketplace = () => {
  const [posts, setPosts] = useState([]);
/*
  const categories = [
    "Grains",
    "Pulses",
    "Tuber Crops",
    "Fruits",
    "Vegetables",
    "Oil Crops",
    "Cash Crops",
    "Fibre Crops",
    "Spices",
    "Beverage Crops",
    "Livestock Feeds",
    "Medicinal Plants",
  ];

  const quantities = [
    "1 - 10Kg",
    "11 - 20Kg",
    "21 - 50Kg",
    "50Kg and above",
    "1 bag - 10 bags",
    "11 bags - 20 bags",
    "21 bags - 30 bags",
    "31 bags - 40 bags",
    "41 bags - 50 bags",
    "50 bags and above",
  ];

  const prices = [
    "#5,000 - #50,000",
    "#51,000 - #100,000",
    "#101,000 and above",
  ];

  const qualities = [
    "Premium Quality",
    "Grade A",
    "Grade B",
    "Grade C",
    "Fair Trade Quality",
    "Organic Quality",
    "Processing Quality",
    "Local Market Quality",
    "Utility Grade",
    "Non-Standard",
  ];
*/
const [selectedProductId, setSelectedProductId] = useState(null);
const [productItems, setProductItems] = useState([]);
const [filters, setFilters] = useState({
  category: "",
  min_price: "",
  max_price: "",
  rating: "",
  location: "",
  search: "",
  sort: "price_asc",
  page: 1,
});
const [totalPages, setTotalPages] = useState(1);
const [locations, setLocations] = useState([]);

// Fetch Unique Locations for Filtering
useEffect(() => {
  fetch("https://api.spida.africa/farmer/farm_location.php")
    .then(response => response.json())
    .then(data => setLocations(data))
    .catch(error => console.error("Error fetching locations:", error));
}, []);

// Fetch Products based on filters
const fetchProducts = () => {
  let url = `https://api.spida.africa/individual/individual_marketplace.php?`;

  Object.keys(filters).forEach(key => {
    if (filters[key]) url += `${key}=${filters[key]}&`;
  });

  fetch(url)
    .then(response => response.json())
    .then(data => {
      setProductItems(data.products);
      setTotalPages(data.total_pages || 1);
    })
    .catch(error => console.error("Error fetching produce:", error));
};

useEffect(() => {
  fetchProducts();
}, [filters]);

const handleFilterChange = (e) => {
  const { name, value } = e.target;
  setFilters(prevFilters => ({ ...prevFilters, [name]: value, page: 1 }));
};

const handlePageChange = (newPage) => {
  setFilters(prevFilters => ({ ...prevFilters, page: newPage }));
};

/*Ope's Code*/
  const ratings = [star4, star3, star2, star1];

  const recentlyViewedProducts = productItems.slice(0, 8);

  const handleSelectProduct = (id) => {
    setSelectedProductId(id === selectedProductId ? null : id);
  };

  useEffect(() => {
    fetch("https://api.spida.africa/get_blog.php")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);
return (
  <div>
    <Nav />
    <section className="marketplace">
      <div className="banner">
        <img className="banner_img" src={marketplacebanner} alt="Marketplace banner" />
        <img className="float_fruit" src={bannerfruit} alt="Floating fruit" />
      </div>
    </section>

    <section className="products_list_container">
      <div className="sort_parameters">
        <div className="parameters">
          {/* Search */}
          <div>
            <h3>Search Product</h3>
            <input type="text" name="search" placeholder="Search..." onChange={handleFilterChange} />
          </div>

          {/* Categories */}
          <div>
            <h3>Category</h3>
            <select name="category" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="Grains">Grains</option>
              <option value="Pulses">Pulses</option>
              <option value="Fruits">Fruits</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <h3>Price</h3>
            <input type="number" name="min_price" placeholder="Min Price" onChange={handleFilterChange} />
            <input type="number" name="max_price" placeholder="Max Price" onChange={handleFilterChange} />
          </div>

          {/* Ratings */}
          <div>
            <h3>Rating</h3>
            <select name="rating" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="4">4 & up</option>
              <option value="3">3 & up</option>
              <option value="2">2 & up</option>
              <option value="1">1 & up</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <h3>Location</h3>
            <select name="location" onChange={handleFilterChange}>
              <option value="">All</option>
              {locations.map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div>
            <h3>Sort By</h3>
            <select name="sort" onChange={handleFilterChange}>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="products_list">
        <div className="product_items">
          {productItems.map(item => (
            <ProductItem key={item.id} product={item} isSelected={selectedProductId === item.id} onSelect={handleSelectProduct} />
          ))}
        </div>
        <div className="spider_helps">
          <div className="help_item text">
            <h2>SPIDA helps you get your orders in Bulk</h2>
            <p>
              SPIDA simplifies your shopping experience by connecting you with
              trusted bulk sellers and ensuring seamless order processing, all
              in one place.
            </p>
            <Link to="/">
              <button>Get Bulk</button>
            </Link>
          </div>
          <div className="help_item">
            <img src={bulkImg} alt="" />
          </div>
        </div>
      </div>
    </section>
    <section className="marketplace">
      <div className="products_list">
        
      </div>
    </section>
    <section className="ready_section">
        <ReadyToConnect />
      </section>
    <section className="news_blog_marketplace">
        <div className="marketplace_news_blog_header">
          <h1>News Blog</h1>
          <img src={vector} alt="" />
        </div>
        <div className="related_content_items">
          {posts.length === 0 ? (
            <p>No blog posts available.</p>
          ) : posts.length <= 6 ? (  // ✅ Fixed syntax
            posts.map((post) => {
              const paragraphs = post.body.split("\n").filter((paragraph) => paragraph.trim() !== "");

              return (
                <div className="related_item" key={post.id}>
                  <div className="item_img">
                    <img src={`https://api.spida.africa/${post.imgSrc}`} alt={post.title} />
                    <h3 className="post_label">{post.label}</h3>
                  </div>
                  <div className="item_content">
                    <p>{post.date}</p>
                    <h2>{post.title}</h2>
                    {paragraphs.slice(0, 2).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    <Link to={`/news/${post.id}`}>
                      Read more
                    </Link>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>

    </section>

    <section className="footer_section">
      <Footer />
    </section>
  </div>
);
};

export default Marketplace;
