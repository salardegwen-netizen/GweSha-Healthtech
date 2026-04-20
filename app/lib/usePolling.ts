import { useEffect, useRef } from 'react';

/**
 * Custom hook for polling data at regular intervals
 * Executes a callback periodically to simulate real-time updates
 */
export function usePolling(
  callback: () => void | Promise<void>,
  interval: number = 10000,
  enabled: boolean = true
) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    // Execute immediately
    const executeCallback = async () => {
      if (isRunningRef.current) return; // Skip if already running
      isRunningRef.current = true;
      try {
        const result = callback();
        if (result && typeof result.then === 'function') {
          await result;
        }
      } catch (error) {
        console.error('Polling error:', error);
      } finally {
        isRunningRef.current = false;
      }
    };

    executeCallback();

    // Set up interval - only execute if previous call finished
    intervalRef.current = setInterval(() => {
      executeCallback();
    }, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, interval, enabled]);
}


