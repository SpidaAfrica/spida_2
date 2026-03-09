import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./NewsBlog.css"; // Import CSS file\
import Nav from "../../../components/Header/Nav";
import Footer from "../../../components/Footer/Footer";

const NewsBlog = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://api.spida.africa/get_blog.php")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  return (
    <div>
        <Nav />
    <section className="news_blog_marketplace">
      <div className="marketplace_news_blog_header">
        <h1>News Blog</h1>
      </div>
      <div className="related_content_items">
        {posts.length === 0 ? (
          <p>No blog posts available.</p>
        ) : (
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
        )}
      </div>
    </section>
    <section className="footer_section">
        <Footer />
      </section>
  </div>
  );
};

export default NewsBlog;
