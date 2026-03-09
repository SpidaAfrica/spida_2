import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
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
const form = useRef();

const sendEmail = (e) => {
  e.preventDefault();

  emailjs.sendForm(
    "service_wupx2nf",     // Replace with your actual EmailJS service ID
    "template_aubwrzw",    // Replace with your template ID
    form.current,
    "bswxk6e-b-vZP8C8f"      // Replace with your EmailJS public key
  ).then(
    () => {
      alert("Message sent successfully!");
      form.current.reset();
    },
    (error) => {
      alert("Failed to send message. Please try again.");
      console.error(error);
    }
  );
};

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
                <p>+49 163 7926797</p>
              </div>
            </div>
            <div className="sub_item">
              <img src={callicon} alt="" />
              <div className="name">
                <h4>Call/SMS</h4>
                <p>+49 163 7926797</p>
              </div>
            </div>
            <div className="sub_item">
              <img src={emailicon} alt="" />
              <div className="name">
                <h4>Email Address</h4>
                <p>info@spida.africa</p>
              </div>
            </div>
            <div className="sub_item">
              <img src={locationicon} alt="" />
              <div className="name">
                <h4>Office Address</h4>
                <p>Germany</p>
              </div>
            </div>
          </div>
        </div>
        <div className="contact_item ">
          <div className="contact_form">
            <form ref={form} onSubmit={sendEmail}>
              <div className="">
                <div className="form_field">
                  <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="user_name" placeholder="Enter your name" required />
                  </div>
                  <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="user_email" placeholder="Enter your email address" required />
                  </div>
                </div>
            
                <div className="form_field">
                  <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" name="phone_number" placeholder="Enter your phone number" />
                  </div>
                  <div>
                    <label htmlFor="subject">Subject</label>
                    <input type="text" name="subject" placeholder="Enter the subject of your message" />
                  </div>
                </div>
            
                <div className="form_field">
                  <div>
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" placeholder="Enter your location" required />
                  </div>
                  <div>
                    <label htmlFor="role">Who You Are</label>
                    <select name="role" required>
                      <option value="" disabled selected>Select your role</option>
                      <option>Farmer</option>
                      <option>Financial Partner</option>
                      <option>Tractor Providers</option>
                      <option>Logistics Companies</option>
                      <option>Individual Buyers</option>
                      <option>Food Processor</option>
                      <option>Restaurants</option>
                      <option>Market Women</option>
                      <option>Agribusiness</option>
                      <option>Government</option>
                      <option>NGO</option>
                    </select>
                  </div>
                </div>
            
                <div className="form_field">
                  <div>
                    <label htmlFor="message">Message</label>
                    <textarea name="message" placeholder="Enter your message" cols="30" rows="10" required></textarea>
                  </div>
                </div>
              </div>
              <button type="submit">Submit</button>
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
