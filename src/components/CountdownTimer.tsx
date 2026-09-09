import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: number; // Timestamp in milliseconds
  onExpire?: () => void;
}

export default function CountdownTimer({ endTime, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        if (onExpire) onExpire();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onExpire]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
      <Clock className="w-4 h-4 text-red-600" />
      <div className="flex items-center gap-1 text-red-700 font-bold">
        {timeLeft.days > 0 && (
          <>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm min-w-[30px] text-center">
              {timeLeft.days}
            </span>
            <span className="text-xs">يوم</span>
          </>
        )}
        {timeLeft.hours > 0 && (
          <>
            <span className="bg-red-600 text-white px-2 py-1 rounded text-sm min-w-[30px] text-center">
              {timeLeft.hours}
            </span>
            <span className="text-xs">س</span>
          </>
        )}
        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm min-w-[30px] text-center">
          {timeLeft.minutes}
        </span>
        <span className="text-xs">د</span>
        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm min-w-[30px] text-center">
          {timeLeft.seconds}
        </span>
        <span className="text-xs">ث</span>
      </div>
    </div>
  );
}
