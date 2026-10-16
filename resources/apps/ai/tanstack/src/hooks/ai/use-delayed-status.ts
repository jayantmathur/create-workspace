import type { ChatClientState } from "@tanstack/ai-client";
import { useState, useEffect } from "react";

export function useDelayedStatus(status: ChatClientState, delay: number) {
  const [delayedStatus, setDelayedStatus] = useState(status);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        setDelayedStatus(status);
      },
      status === "submitted" ? delay : 0,
    );

    return () => window.clearTimeout(timeout);
  }, [delay, status]);

  return delayedStatus;
}
