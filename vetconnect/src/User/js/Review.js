import { useState } from "react";
import "../styles/Review.css";
import { FaPen } from "react-icons/fa";

const Review = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    review: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    // For now, we'll just log it and show a success message
    console.log("Review submitted:", formData);

    // In a real app, you would send this to your API:
    // fetch('/api/reviews', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // .then(response => {
    //   if (response.ok) {
    //     setSubmitted(true);
    //     setFormData({ name: "", email: "", review: "" });
    //   }
    // });

    setSubmitted(true);
    setFormData({ name: "", email: "", review: "" });
  };

  return (
    <div className="review-section" style={{ width: "100%" }}>
      <h2 className="review-title">Write a Review</h2>

      {submitted ? (
        <div className="review-success">
          <p>Thank you for your review! It has been submitted for approval.</p>
          <button
            className="review-another-btn"
            onClick={() => setSubmitted(false)}
          >
            Write Another Review
          </button>
        </div>
      ) : (
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="left-fields">
            <div className="form-group">
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=""
                required
              />
            </div>
          </div>

          <div className="right-field">
            <div className="form-group">
              <label htmlFor="review">
                Write your Review*{" "}
                <FaPen style={{ marginLeft: "5px", color: "#0d3b5f" }} />
              </label>
              <textarea
                id="review"
                name="review"
                value={formData.review}
                onChange={handleChange}
                placeholder="Write your review here..."
                required
              />
            </div>
            <button type="submit" className="submit-review-btn">
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Review;
