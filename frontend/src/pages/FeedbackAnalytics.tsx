import { useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function FeedbackAnalytics() {
  const [ratingsData] = useState({
    labels: ["Excellent", "Good", "Average", "Poor"],
    datasets: [
      {
        label: "Customer Ratings",
        data: [45, 30, 15, 10],
        backgroundColor: ["#28a745", "#17a2b8", "#ffc107", "#dc3545"],
      },
    ],
  });

  const [satisfactionTrend] = useState({
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Satisfaction (%)",
        data: [75, 80, 70, 85],
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  });

  return (
    <div className="container py-5">
      <h2 className="mb-4">Feedback Analytics</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow rounded-3 p-3">
            <h5 className="card-title">Customer Ratings</h5>
            <Pie data={ratingsData} options={{ responsive: true }} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow rounded-3 p-3">
            <h5 className="card-title">Satisfaction Trend</h5>
            <Line data={satisfactionTrend} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}
