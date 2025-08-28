import React from "react";
import { Link } from "react-router-dom";

import Nav from "../../../components/Header/Nav";
import heroImg from "../../../assets/images/hero-img.png";
import vector from "../../../assets/images/hero_vector.png";
import flower from "../../../assets/images/hero_flower.png";
import deliveryvan from "../../../assets/images/icons/delivery.png";
import support from "../../../assets/images/icons/support.png";
import secure from "../../../assets/images/icons/payment.png";
import farmer from "../../../assets/images/farmer.png";
import buyer from "../../../assets/images/buyer.png";
import logistics from "../../../assets/images/logistics.png";
import phone from "../../../assets/images/icons/phone.png";
import reliable from "../../../assets/images/icons/reliable.png";
import rely from "../../../assets/images/icons/rely.png";
import control from "../../../assets/images/icons/control.png";

import "./home.css";
import ImageTextRow from "../../../components/row/ImageTextButtonRow";
import ReadyToConnect from "../../../components/ready_to_connect/ReadyToConnect";
import Footer from "../../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="">
      <div className="">
        <Nav />
      </div>
      <section className="hero_section">
        <img src={heroImg} alt="hero_img" />
        <div className="hero_section_content">
          <div className="content">
            <h3>
              From farm to consumer <span>Simplified</span>
            </h3>
            <img className="vector" src={vector} alt="" />
            <img className="flower" src={flower} alt="" />
            <Link className="cta" to="/register">
              <button>Get Started</button>
            </Link>
          </div>
        </div>
      </section>
      <section className="section_1_deliveries">
        <div className="">
          <img src={deliveryvan} alt="" />
          <div className="other_info">
            <h3>Swift Delivery</h3>
            <p>Instant access to support</p>
          </div>
        </div>
        <div className="">
          <img src={support} alt="" />
          <div className="other_info">
            <h3>Customer Support 24/7</h3>
            <p>Instant access to support</p>
          </div>
        </div>
        <div className="">
          <img src={secure} alt="" />
          <div className="other_info">
            <h3>100% Secure Payment</h3>
            <p>We ensure your money is save</p>
          </div>
        </div>
      </section>
      <section className="row_section">
        <ImageTextRow
          h3="Farmers: Manage Your Produce"
          h1="Looking to showcase your harvest?"
          p="Easily list, update, and track your farm produce with SPIDA’s tools for profile management, analytics, and real-time weather updates."
          buttonText="Get Started"
          img={farmer}
          buttonDestination="/register"
          rowDirection="forward"
        />
        <ImageTextRow
          h3="Buyers: Shop Fresh, Buy Direct"
          h1="Want fresh produce delivered to you?"
          p="Explore a marketplace of farm-fresh products, place orders, and track deliveries with secure payment options."
          buttonText="Shop Now"
          img={buyer}
          buttonDestination="/marketplace"
          rowDirection="backward"
        />
        <ImageTextRow
          h3="Logistics: Deliver with Confidence"
          h1="Ready to connect orders with your fleet?"
          p="Accept delivery requests, track routes with GPS, and ensure smooth handoffs for timely deliveries."
          buttonText="Sign Up"
          img={logistics}
          buttonDestination="/"
          rowDirection="forward"
        />
      </section>
      <section className="why_spider">
        <div className="why_header">
          <h1>
            Why <span>SPIDA?</span>
          </h1>
          <h1>Discover the benefits</h1>
        </div>
        <div className="why_body">
          <div className="why_item">
            <img src={phone} alt="" />
            <h3>Convenience at Your Fingertips</h3>
            <p>
              SPIDA connects farmers directly with consumers and businesses,
              cutting out middlemen to ensure fair pricing and better profits
              for farmers.
            </p>
          </div>
          <div className="why_item">
            <img src={reliable} alt="" />
            <h3>Secure and Reliable Transactions</h3>
            <p>
              Payments are safely managed on the platform and released only
              after delivery confirmation, protecting both sellers and buyers
            </p>
          </div>
          <div className="why_item">
            <img src={control} alt="" />
            <h3>Stay in Control</h3>
            <p>
              Real-time tracking and verified logistics ensure smooth delivery
              from farm to final destination, with no guesswork.
            </p>
          </div>
          <div className="why_item">
            <img src={rely} alt="" />
            <h3>Support You Can Rely On</h3>
            <p>
              Our 24/7 customer support is always here to assist, ensuring
              you're never left stranded.
            </p>
          </div>
        </div>
      </section>
      <section className="ready_section">
        <ReadyToConnect />
      </section>
      <section className="footer_section">
        <Footer />
      </section>
    </div>
  );
};

export default Home;
