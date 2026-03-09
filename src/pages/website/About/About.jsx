import React from "react";
import { Link } from "react-router-dom";

import Nav from "../../../components/Header/Nav";
import ReadyToConnect from "../../../components/ready_to_connect/ReadyToConnect";
import Footer from "../../../components/Footer/Footer";
import FoundersComponent from "../../../components/forms/FoundersComponent";
import aboutImg from "../../../assets/images/aboutImg.png";
import userimg from "../../../assets/images/userimg.png";
import daniel from "../../../assets/images/daniel.jpeg";
import marvin from "../../../assets/images/marvin.jpeg";
import triumph from "../../../assets/images/triumph.jpeg";
import floatimg from "../../../assets/images/about-fixed-img.png";
import reviewflower from "../../../assets/images/reviewflower.png";
import phone from "../../../assets/images/icons/phone2.png";
import reliable from "../../../assets/images/icons/reliable2.png";
import rely from "../../../assets/images/icons/rely2.png";
import control from "../../../assets/images/icons/control2.png";
import quote from "../../../assets/images/icons/quote.png";

import "./about.css";

const About = () => {
  return (
    <div className="about_page">
      <Nav />
      <section className="about_banner">
        <img src={aboutImg} alt="hero_img" />
        <div className="about_banner_content">
          <div className="banner_content">
            <button>About Us</button>
            <h3>More than a Marketplace - Your Farm, Your Future.</h3>
          </div>
        </div>
      </section>
      <section className="about_us_section">
        <div className="about_header">
          <h3>ABOUT US</h3>
        </div>
        <div className="about_items">
          <div className="about_item">
            <h2>
              <span className="mission">Our mission</span> is to connect farmers
              with consumers and businesses,{" "}
              <span className="simplify">
                simplifying the supply chain with secure transactions and
                reliable logistics.
              </span>
            </h2>
          </div>
          <div className="about_item">
            <p>
              At SPIDA, we empower farmers by connecting them directly with
              consumers and businesses, creating a seamless farm-to-market
              supply chain. We enhance trust, transparency, and security at
              every step—from product listing to final delivery—through a
              reliable logistics network. By simplifying transactions and
              providing real-time tracking, we aim to build a future where
              fresh, local produce reaches more people efficiently and
              sustainably.
            </p>
          </div>
        </div>
      </section>

      {/*  <section className="our_team">
        <div className="">
          <div className="team_header">
            <h3>OUR TEAM</h3>
          </div>
          <div className="team_items">
            <div className="team_item">
              <div className="img">
              <img src={daniel} alt="" />
              </div>
              <h4>Daniel Agbojo</h4>
              <p>Founder</p>
            </div>
            <div className="team_item">
              <div className="img">
                <img src={marvin} alt="" />
              </div>
              <h4>Marvin Daniels</h4>
              <p>Co-Founder</p>
            </div>
            <div className="team_item">
              <div className="img">
                <img src={triumph} alt="" />
              </div>
              <h4>Triumphant Babalola</h4>
              <p>Technical Co-founder</p>
            </div>
          </div>
        </div>
        <div className="float_img">
          <img src={floatimg} alt="" />
        </div>
      </section>*/}
      <FoundersComponent/>

      <section className="why_spider about">
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
{/*
      <section className="user_reviews">
        <div className="review_content">
          <h1>
            <img src={reviewflower} alt="review flower" />
            What <span>our users</span> are saying
          </h1>

          <div className="review_items">
            <div className="review_item">
              <div className="user_img_quote">
                <div className="user_img_name">
                  <img src={userimg} alt="" />
                  <div className="name">
                    <h3>Ibrahim Yaro</h3>
                    <p>Farmer</p>
                  </div>
                </div>
                <img src={quote} alt="quote_img" />
              </div>
              <p>
                Spida has revolutionized the way I manage my farming business.
                The direct connection to consumers has boosted my sales, and the
                reliable logistics make delivery seamless{" "}
              </p>
            </div>
            <div className="review_item">
              <div className="user_img_quote">
                <div className="user_img_name">
                  <img src={userimg} alt="" />
                  <div className="name">
                    <h3>Ibrahim Yaro</h3>
                    <p>Farmer</p>
                  </div>
                </div>
                <img src={quote} alt="quote_img" />
              </div>
              <p>
                {" "}
                Spida has revolutionized the way I manage my farming business.
                The direct connection to consumers has boosted my sales, and the
                reliable logistics make delivery seamless{" "}
              </p>
            </div>
            <div className="review_item">
              <div className="user_img_quote">
                <div className="user_img_name">
                  <img src={userimg} alt="" />
                  <div className="name">
                    <h3>Ibrahim Yaro</h3>
                    <p>Farmer</p>
                  </div>
                </div>
                <img src={quote} alt="quote_img" />
              </div>
              <p>
                Spida has revolutionized the way I manage my farming business.
                The direct connection to consumers has boosted my sales, and the
                reliable logistics make delivery seamless{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
*/}
      <section className="ready_section">
        <ReadyToConnect />
      </section>
      <section className="footer_section">
        <Footer />
      </section>
    </div>
  );
};

export default About;
