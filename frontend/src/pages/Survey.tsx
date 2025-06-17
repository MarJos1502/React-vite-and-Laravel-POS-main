import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

interface SurveyProps {
  paymentId?: string;
}

export default function Survey({ paymentId }: SurveyProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/survey", {
        payment_id: paymentId,
        rating,
        comment,
      });
      setMessage("Thank you for your feedback!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setMessage("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light" style={{ marginTop: '-56px', paddingTop: '56px' }}>
      <div className="container p-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Customer Feedback</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Rate your experience:</label>
                    <select
                      className="form-select form-select-lg"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} - {["Poor", "Fair", "Good", "Very Good", "Excellent"][n - 1]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Comments (optional):</label>
                    <textarea
                      className="form-control form-control-lg"
                      rows={5}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us more about your experience..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100">
                    Submit Feedback
                  </button>

                  {message && (
                    <div
                      className={`alert mt-3 text-center ${
                        message.includes("Thank") ? "alert-success" : "alert-danger"
                      }`}
                      role="alert"
                    >
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
