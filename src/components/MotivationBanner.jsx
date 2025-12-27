import { useState, useEffect } from "react";

const MotivationBanner = () => {
  const quotes = [
    "consistency is the key to success!",
    "Small steps every day lead to big results.",
    "Stay focused and never give up!",
    "Your effort today build your tomorrow.",
    "Make each day count!✨✨"

  ];
  const [quote,setQuotes] = useState("");
  useEffect(() => {
    const changeQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuotes(quotes[randomIndex]);
  };
changeQuote();
const interval = setInterval(changeQuote, 3000);
return () => clearInterval(interval);
},[]);
  return (
    <div className="gradient-bg from-blue-400 to-purple-500 text-white p-6 rounded-2xl shadow-xl mb-6 max-w-3xl mx-auto text-center transition-all duration-700 hover:scale-105">
      <p className="text-xl italic mb-2 aninmate-pulse">"{quote}"</p>
      <p className="tetx-sm mt-2 opacity-90 animate-fadeIn">Start your day with smart plannig and build consistent study habits!</p>
    </div>
  )
}
export default MotivationBanner;