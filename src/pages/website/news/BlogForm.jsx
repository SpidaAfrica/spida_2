import { useState } from "react";
import "./BlogForm.css"; // Import the CSS file

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    label: "",
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("body", formData.body);
    formDataToSend.append("label", formData.label);
    if (image) {
      formDataToSend.append("image", image);
    }

    try {
      const response = await fetch("https://api.spida.africa/add_blog.php", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Blog post added successfully!");
        setFormData({ title: "", body: "", label: "" });
        setImage(null);
      } else {
        setMessage(result.error || "Failed to add blog post.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="blog-form-container">
      <h2>Create Blog Post</h2>
      {message && <p className="blog-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Body:</label>
        <textarea name="body" value={formData.body} onChange={handleChange} required></textarea>

        <label>Image:</label>
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />

        <label>Label (Category):</label>
        <input type="text" name="label" value={formData.label} onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BlogForm;
