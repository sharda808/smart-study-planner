
import { useEffect, useState, useRef } from "react";

const FocusSession = ({ onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); 
  const[showPopup, setShowPopup] = useState(false);
  const audioRef = useRef(null);
useEffect(() => {
  if(timeLeft === 0){
    setShowPopup(true);
   setTimeout(() =>setShowPopup(false), 3000);
  }
})
 
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(0);              
      audioRef.current?.play().catch(err => console.error("Audio error:", err));     
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl text-center shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4">Focus Session</h2>

        <p className="text-4xl font-mono mb-4">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </p>

        {timeLeft === 0 ? (
          <p className="text-green-600 font-semibold">
            Session Complete! Great job!
          </p>
        ) : (
          <p className="text-gray-600">Stay Focused. No distractions 📵</p>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Close
        </button>

     
     <audio ref={audioRef} src="/sound/focus-complete.mp3" preload="auto" />


      </div>
    </div>
  );
};

export default FocusSession;

  

