
import { Bar } from "react-chartjs-2";

const PriorityBarChart = ({ high, medium, low }) => {
  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks",
        data: [high, medium, low],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        spacing:2,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 10,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
  barPercentage:0.9,
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          stepSize: 1,
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className=" rounded-xl p-6 h-[300px] flex flex-col mt-2">
      <h3 className="text-center font-semibold text-gray-700 mb-2">
        Task Priority
      </h3>
  
<div className="flex flex-1 justify-center items-center">
<div className="w-full max-w-md mx-auto p-4">
  <Bar data={data} options={options} />
</div>
</div>
    </div>
  );
};

export default PriorityBarChart;
