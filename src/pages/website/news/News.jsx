import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Nav from "../../../components/Header/Nav";
import ReadyToConnect from "../../../components/ready_to_connect/ReadyToConnect";
import posts from "../../../data/posts";
import Footer from "../../../components/Footer/Footer";
import postImg from "../../../assets/images/post-img.png";
import arrowRight from "../../../assets/images/icons/arrow-right.png";

import "./news.css";

const News = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`https://api.spida.africa/news.php/${id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const relatedPosts = posts.slice(0, 3);

  const selectedPost = relatedPosts.filter((post, index) => post.id == id)[0];

  return (
    <div className="news_container">
      <Nav />
      <section className="news_section_post_content">
        <div className="post_img">
          <img src={`https://api.spida.africa/${selectedPost?.imgSrc}`} alt="" />
          <h3 className="img_label">{selectedPost?.label}</h3>
        </div>
        <div className="post_title">
          <h1>{selectedPost?.title}</h1>
        </div>
        <div className="post_content">
          {selectedPost?.body
            .split("\n")
            .filter((paragraph) => paragraph.trim() !== "")
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          <h3>{selectedPost?.date}</h3>
        </div>
      </section>

      <section className="related_content">
        <h1>Related Contents</h1>
        <div className="related_content_items">
          {relatedPosts.map((post) => {
            const paragraphs = post.body
              .split("\n")
              .filter((paragraph) => paragraph.trim() !== "");

            return (
              <div className="related_item" key={post.id}>
                <div className="item_img">
                  <img src={post.imgSrc} alt="" />
                  <h3 className="post_label">{post.label}</h3>
                </div>
                <div className="item_content">
                  <p>{post.date}</p>
                  <h2>{post.title}</h2>
                  {paragraphs.slice(0, 2).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                  <Link to={"/news/" + post.id}>
                    Read more <img className="arrow" src={arrowRight} alt="" />
                  </Link>
                </div>
              </div>
            );
          })}
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

export default News;
