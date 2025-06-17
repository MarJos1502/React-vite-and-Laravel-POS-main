import { useState } from "react";
import { Bar } from "react-chartjs-2";
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

export default function Reports() {
  const [reportData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (₱)",
        data: [12000, 15000, 10000, 17000, 14000, 16000],
        backgroundColor: "rgba(40,167,69,0.6)",
        borderRadius: 4,
      },
      {
        label: "Expenses (₱)",
        data: [8000, 9000, 7500, 10000, 9500, 11000],
        backgroundColor: "rgba(220,53,69,0.6)",
        borderRadius: 4,
      },
    ],
  });

  return (
    <div className="container py-5">
      <h2 className="mb-4">Reports</h2>
      <div className="card shadow rounded-3 p-4">
        <h5 className="card-title">Monthly Financial Overview</h5>
        <Bar data={reportData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
