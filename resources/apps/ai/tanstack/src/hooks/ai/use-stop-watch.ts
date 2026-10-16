import { useRef, useState, useEffect } from "react";

export function useStopWatch(running: boolean): number | null {
  const submittedAt = useRef<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!running) {
      if (submittedAt.current !== null) {
      setDuration(performance.now() - submittedAt.current);
      submittedAt.current = null;
      }
      return;
    }

    submittedAt.current = performance.now();
    setDuration(0);

    const intervalId = window.setInterval(() => {
      if (submittedAt.current !== null) {
        setDuration(performance.now() - submittedAt.current);
      }
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [running]);

  return duration;
}
