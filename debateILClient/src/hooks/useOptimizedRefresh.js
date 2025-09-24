import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Optimized Auto-Refresh Hook
 * Provides intelligent auto-refresh with:
 * - Visibility detection (only refresh when tab is active)
 * - Adaptive intervals (faster for live content, slower for static)
 * - Debouncing to prevent excessive requests
 * - Error handling with exponential backoff
 */
export function useOptimizedRefresh(refreshFunction, options = {}) {
  const {
    interval = 5000, // Default 5 seconds
    enabled = true,
    immediate = false,
    maxRetries = 3,
    backoffMultiplier = 2,
    minInterval = 1000,
    maxInterval = 30000,
  } = options;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastRefreshRef = useRef(0);
  const retryTimeoutRef = useRef(null);

  // Visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Optimized refresh function with debouncing
  const performRefresh = useCallback(async () => {
    if (!enabled || isRefreshing) return;

    // Debounce: Don't refresh if last refresh was less than 1 second ago
    const now = Date.now();
    if (now - lastRefreshRef.current < 1000) {
      return;
    }

    setIsRefreshing(true);
    setError(null);
    lastRefreshRef.current = now;

    try {
      await refreshFunction();
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      setError(err.message);

      // Exponential backoff for retries
      if (retryCount < maxRetries) {
        const backoffDelay = Math.min(
          minInterval * Math.pow(backoffMultiplier, retryCount),
          maxInterval
        );

        retryTimeoutRef.current = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          performRefresh();
        }, backoffDelay);
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [
    enabled,
    isRefreshing,
    refreshFunction,
    retryCount,
    maxRetries,
    backoffMultiplier,
    minInterval,
    maxInterval,
  ]);

  // Adaptive interval based on content type
  const getAdaptiveInterval = useCallback(
    (baseInterval) => {
      if (!isVisible) {
        return baseInterval * 3; // Slower when tab is not visible
      }

      // Faster refresh for live content, slower for static
      return baseInterval;
    },
    [isVisible]
  );

  // Set up interval
  useEffect(() => {
    if (!enabled) return;

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const adaptiveInterval = getAdaptiveInterval(interval);

      intervalRef.current = setInterval(() => {
        if (isVisible) {
          performRefresh();
        }
      }, adaptiveInterval);
    };

    // Start immediately if requested
    if (immediate) {
      performRefresh();
    }

    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [
    enabled,
    interval,
    isVisible,
    performRefresh,
    immediate,
    getAdaptiveInterval,
  ]);

  // Manual refresh function
  const manualRefresh = useCallback(() => {
    performRefresh();
  }, [performRefresh]);

  // Force refresh (ignores debouncing)
  const forceRefresh = useCallback(async () => {
    if (!enabled) return;

    setIsRefreshing(true);
    setError(null);
    lastRefreshRef.current = Date.now();

    try {
      await refreshFunction();
      setRetryCount(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, [enabled, refreshFunction]);

  return {
    isRefreshing,
    error,
    isVisible,
    retryCount,
    manualRefresh,
    forceRefresh,
  };
}

export default useOptimizedRefresh;
