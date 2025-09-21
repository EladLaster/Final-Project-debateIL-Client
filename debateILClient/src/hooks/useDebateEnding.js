import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { finishDebate } from "../services/serverApi"; // ← ייבוא סטטי במקום await import

/**
 * Custom hook for managing debate ending functionality
 * Handles both manual and automatic debate ending
 */
export function useDebateEnding(
  debateId,
  debateStatus,
  currentUser,
  user1,
  user2
) {
  const navigate = useNavigate();
  const [autoEndTimer, setAutoEndTimer] = useState(null);
  const [timeUntilAutoEnd, setTimeUntilAutoEnd] = useState(null);

  // Common function to end debate
  const endDebate = useCallback(
    async (endReason) => {
      try {
        // Check if debate is already finished
        if (debateStatus === "finished") {
          return;
        }

        // Call API to end the debate using serverApi
        const updatedDebate = await finishDebate(debateId, {
          // The server expects current scores, not endReason
          // We'll let the server use the current scores from the database
        });

        // No need to check response.ok since serverApi handles errors

        // Clear auto-end timer
        if (autoEndTimer) {
          clearTimeout(autoEndTimer);
          setAutoEndTimer(null);
        }

        // Show success message
        if (endReason === "user_ended") {
          alert("Debate ended successfully!");
        } else if (endReason === "inactivity_timeout") {
          alert("Debate ended due to inactivity (15 minutes without activity)");
        } else if (endReason === "admin_ended") {
          alert("Debate ended by admin");
        }

        // Navigate to replay page to show final results
        navigate(`/replay/${debateId}`);

        return updatedDebate;
      } catch (error) {
        alert(`Failed to end debate: ${error.message}`);
        throw error;
      }
    },
    [debateId]
  );

  // Handle manual ending by user
  const handleEndDebate = useCallback(async () => {
    if (!currentUser) {
      alert("Please log in to end debate");
      return;
    }

    // Only debate participants can end the debate
    if (currentUser.id !== user1?.id && currentUser.id !== user2?.id) {
      alert("Only debate participants can end the debate");
      return;
    }

    // Confirm ending the debate
    const confirmEnd = window.confirm(
      "Are you sure you want to end this debate? This action cannot be undone."
    );

    if (!confirmEnd) return;

    await endDebate("user_ended");
  }, [currentUser, user1?.id, user2?.id, endDebate]);

  // Handle auto-ending debate due to inactivity
  const handleAutoEndDebate = useCallback(async () => {
    await endDebate("inactivity_timeout");
  }, [endDebate]);

  // Check if user can end debate
  const canEndDebate = useCallback(() => {
    if (!currentUser || !debateStatus) return false;
    return currentUser.id === user1?.id || currentUser.id === user2?.id;
  }, [currentUser, user1?.id, user2?.id]);

  // Auto-end timer for inactive debates
  useEffect(() => {
    if (debateStatus === "live") {
      // Clear existing timer
      if (autoEndTimer) {
        clearTimeout(autoEndTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        handleAutoEndDebate();
      }, 15 * 60 * 1000); // 15 minutes

      setAutoEndTimer(timer);

      return () => {
        clearTimeout(timer);
      };
    } else {
      // Clear timer if debate is not live
      if (autoEndTimer) {
        clearTimeout(autoEndTimer);
        setAutoEndTimer(null);
      }
    }
  }, [debateStatus, handleAutoEndDebate]);

  // Reset auto-end timer on activity
  useEffect(() => {
    if (debateStatus === "live" && autoEndTimer) {
      // Clear existing timer
      if (autoEndTimer) {
        clearTimeout(autoEndTimer);
      }

      // Set new timer
      const timer = setTimeout(() => {
        handleAutoEndDebate();
      }, 15 * 60 * 1000); // 15 minutes

      setAutoEndTimer(timer);
    }
  }, [debateStatus, handleAutoEndDebate]); // Remove autoEndTimer to prevent infinite loop

  // Countdown timer display
  useEffect(() => {
    if (debateStatus === "live" && autoEndTimer) {
      const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const endTime = now + 15 * 60 * 1000; // 15 minutes from now
        const timeLeft = Math.max(0, endTime - now);

        if (timeLeft > 0) {
          const minutes = Math.floor(timeLeft / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          setTimeUntilAutoEnd(
            `${minutes}:${seconds.toString().padStart(2, "0")}`
          );
        } else {
          setTimeUntilAutoEnd(null);
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    } else {
      setTimeUntilAutoEnd(null);
    }
  }, [debateStatus, autoEndTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoEndTimer) {
        clearTimeout(autoEndTimer);
      }
    };
  }, [autoEndTimer]);

  return {
    // Functions
    endDebate,
    handleEndDebate,
    handleAutoEndDebate,
    canEndDebate,

    // State
    timeUntilAutoEnd,
    isAutoEndActive: !!autoEndTimer,
  };
}
