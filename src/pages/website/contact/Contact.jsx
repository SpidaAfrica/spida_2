import React from "react";

import Nav from "../../../components/Header/Nav";
import ReadyToConnect from "../../../components/ready_to_connect/ReadyToConnect";
import Footer from "../../../components/Footer/Footer";
import vector from "../../../assets/images/hero_vector.png";
import whatsapp from "../../../assets/images/icons/whatsapp.png";
import locationicon from "../../../assets/images/icons/locationicon2.png";
import emailicon from "../../../assets/images/icons/emailicon2.png";
import callicon from "../../../assets/images/icons/callicon2.png";

import "./contact.css";


const Contact = () => {
  return (
    <div className="">
      <Nav />

      <section className="contact_section">
        <div className="contact_item contact_info">
          <div className="contact_header">
            <h3>Contact Us</h3>
            <h1>
              Get in Touch with <span>SPIDA</span>
            </h1>
            <img src={vector} alt="" />
          </div>
          <div className="sub_items">
            <div className="sub_item">
              <img src={whatsapp} alt="" />
              <div className="name">
                <h4>WhatsApp</h4>
                <p>+234 810 123 4567</p>
              </div>
            </div>
            <div className="sub_item">
              <img src={callicon} alt="" />
              <div className="name">
                <h4>Call/SMS</h4>
                <p>+234 810 123 4567</p>
              </div>
            </div>
            <div className="sub_item">
              <img src={emailicon} alt="" />
              <div className="name">
                <h4>Email Address</h4>
                <p>admin@spida.com</p>
              </div>
            </div>
            <div className="sub_item">
              <img src={locationicon} alt="" />
              <div className="name">
                <h4>Office Address</h4>
                <p>57, Oluwole Street, Ikeja, Lagos.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact_item ">
          <div className="contact_form">
            <form action="">
              <div className="">
                <div className="form_field">
                  <div>
                    <label htmlFor="">Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="">E-mail Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                <div className="form_field">
                  <div className="">
                    <label htmlFor="">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNumber"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Enter the subject of your message"
                    />
                  </div>
                </div>
                <div className="form_field">
                  <div>
                    <label htmlFor="">Message</label>
                    <textarea
                      placeholder="Enter your message"
                      name="message"
                      id=""
                      cols="30"
                      rows="10"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button>Submit</button>
            </form>
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

export default Contact;
