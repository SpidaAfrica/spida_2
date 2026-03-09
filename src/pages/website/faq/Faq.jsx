import React from "react";

import Nav from "../../../components/Header/Nav";
import FaqItem from "./FaqItem";
import ReadyToConnect from "../../../components/ready_to_connect/ReadyToConnect";
import Footer from "../../../components/Footer/Footer";
import vector from "../../../assets/images/hero_vector.png";

import "./faq.css";

const Faq = () => {
  const faqItems = [
    {
      id: 1,
      question: "How can farmers benefit from SPIDA?",
      answer:
        "Farmers can list and update their produce, receive real-time weather updates, manage orders, and track sales analytics to plan better. With SPIDA, farmers also enjoy secure payments, offline services for rural areas, and opportunities to connect with businesses for consistent demand and higher earnings.",
    },
    {
      id: 2,
      question: "What features are available for buyers on SPIDA?",
      answer: "",
    },
    {
      id: 3,
      question: "How does SPIDA ensure secure transactions?",
      answer: "",
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: "",
    },
    {
      id: 5,
      question: "Is my payment information secure?",
      answer: "",
    },
    {
      id: 6,
      question: "What is the role of logistics providers on SPIDA?",
      answer: "",
    },
    {
      id: 7,
      question: "Can farmers use SPIDA in areas with limited internet access?",
      answer: "",
    },
    {
      id: 8,
      question: "How does SPIDA ensure product quality and timely delivery?",
      answer: "",
    },
  ];

  return (
    <div>
      <Nav />

      <section className="faq_section">
        <div className="faq_header">
          <h1>Frequently Asked Questions (FAQs)</h1>
          <img src={vector} alt="" />
        </div>
        {faqItems.map((faq, index) => (
          <FaqItem key={index} faq={faq} />
        ))}
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

export default Faq;
