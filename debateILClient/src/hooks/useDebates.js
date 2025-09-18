import { useState, useEffect } from "react";
import { getDebates } from "../services/serverApi";

// Custom hook for managing debates data
export const useDebates = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDebates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDebates();
      setDebates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load debates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebates();

    // Optional: Auto-refresh every 30 seconds for live updates
    const interval = setInterval(fetchDebates, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    debates,
    loading,
    error,
    refetch: fetchDebates,
  };
};
