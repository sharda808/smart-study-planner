import {Pie} from "react-chartjs-2"

const TaskPieChart = ({completed,pending}) => {
const data = {
labels:["Completed", "Pending"],
datasets:[
  {
    data:[completed, pending],
    backgroundColor:["#22c55e", "#ef4444"],
  }
]
};
const options = {
  plugins:{
    legend:{
      position:"bottom",
      labels:{
        boxWidth:14,
        padding:16,
      }
    }
  },
  maintainAspectRatio:false,
};
return (
 <div className="rounded-xl p-4 h-[300px] flex flex-col" >
<h3 className="text-center font-semibold text-gray-700 mb-2">Task Status</h3>
  <div className="flex-1 relative">
        <Pie data={data} options={options} />
      </div>
 </div>
);
}
export default TaskPieChart;