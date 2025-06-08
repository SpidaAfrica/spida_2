import React from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import locationicon from "../../assets/images/icons/locationicon.png";
import emailicon from "../../assets/images/icons/emailicon.png";
import callicon from "../../assets/images/icons/callicon.png";
import facebook from "../../assets/images/icons/facebook.png"
import twitter from "../../assets/images/icons/twitter.png"
import ig from "../../assets/images/icons/ig.png"
import linkedin from "../../assets/images/icons/linkedin.png"
import youtube from "../../assets/images/icons/youtube.png"

import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer_items">
        <div className="footer_item logo_address">
          <img src={logo} alt="" />
          <div className="address">
            <div className="address_item">
              <img src={locationicon} alt="" />
              <p>
                Germany
              </p>
            </div>
            <div className="address_item">
              <img src={emailicon} alt="" />
              <p>info@spida.africa</p>
            </div>
            <div className="address_item">
              <img src={callicon} alt="" />
              <p>+49 163 7926797</p>
            </div>
          </div>
          <div className="social_media">
            <a href="https://www.facebook.com/">
              <img src={facebook} alt="" />
            </a>
            <a href="https://www.twitter.com/">
              <img src={twitter} alt="" />
            </a>
            <a href="https://www.instagram.com/">
              <img src={ig} alt="" />
            </a>
            <a href="https://www.linkedin.com/">
              <img src={linkedin} alt="" />
            </a>
            <a href="https://www.youtube.com/">
              <img src={youtube} alt="" />
            </a>
          </div>
        </div>
        <div className="footer_item footer_quick_links">
            <div className="quick_links">
                <h4>Home</h4>
                <ul>
                    <li>
                        <Link to="/marketplace">Available Products</Link>
                    </li>
                    <li>
                        <Link to="/">Features</Link>
                    </li>
                    <li>
                        <Link to="/">How it works</Link>
                    </li>
                </ul>
            </div>
            <div className="quick_links">
                <h4>Company</h4>
                <ul>
                    <li>
                        <Link to="/about">About Us</Link>
                    </li>
                    <li>
                        <Link to="/">Privacy Policy</Link>
                    </li>
                    <li>
                        <Link to="/">Terms of Service</Link>
                    </li>
                </ul>
            </div>
            <div className="quick_links">
                <h4>Support</h4>
                <ul>
                    <li>
                        <Link to="/faqs">FAQs</Link>
                    </li>
                    <li>
                        <Link to="/">Customer Support</Link>
                    </li>
                    <li>
                        <Link to="/contact">Contact Us</Link>
                    </li>
                </ul>
            </div>
        </div>
      </div>
      <span>©2025 Spida. All rights reserved.</span>
    </footer>
  );
};

export default Footer;
