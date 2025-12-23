const AnalyticsCards = ({total,completed,pending,high}) => {
const cards = [
  {
    title:"Total Tasks",
    value:total,
    color:" text-blue-600",
    bg:"bg-blue-100",
  },
  {
    title:"Completed",
    value:completed,
    color:"text-green-600",
     bg:"bg-green-100"
  },
  {
    title:"Pending",
    value:pending,
    color:" text-red-600",
     bg:"bg-red-100"
  },
  {
    title:"High Priority",
    value:high,
    color:"text-orange-600",
    bg:"bg-orange-100"
  }
];
return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
{cards.map((card,index) => (
<div
key= {index}
className={`rounded-xl shadow-sm border p-5 flex  flex-col gap-2 ${card.bg}`}
>
<p className="text-sm text-gray-500">{card.title}</p>
<p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
</div>
))}
  </div>
);
};
export default AnalyticsCards;
// const AnalyticsCards = ({title,value,color}) => {
// return (
//   <div className="bg-white rounded-xl shadow-md p-5 border-1-4" style = {{borderColor:color}}>
// <p className="tetx-sm text-gray-500">{title}</p>
// <p className="text-3xl font-bold mt-2" style={{color}}>{value}</p>
//   </div>
// );
// }
// export default AnalyticsCards;