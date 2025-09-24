import { useState } from "react";
import { createDebate } from "../../../services/serverApi";
import PrimaryButton from "../../ui/PrimaryButton";
import ContentCard from "../../ui/ContentCard";

export default function CreateDebateModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topic.trim()) {
      newErrors.topic = "Debate topic is required";
    } else if (formData.topic.length < 10) {
      newErrors.topic = "Topic must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Set start time to current time and end time to 1 hour later
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60 * 60000); // 1 hour = 60 minutes

      const debateData = {
        topic: formData.topic,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        status: "scheduled",
      };

      const newDebate = await createDebate(debateData);

      // Reset form
      setFormData({
        topic: "",
      });

      onSuccess?.(newDebate);
      onClose();
    } catch (error) {
      setErrors({ general: error.message || "Failed to create debate" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      topic: "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <ContentCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              🎯 Create New Debate
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Topic */}
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Debate Topic *
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.topic ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Should AI replace human teachers?"
              />
              {errors.topic && (
                <p className="text-red-500 text-sm mt-1">{errors.topic}</p>
              )}
            </div>

            {/* Auto-scheduled info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Auto-scheduled Debate
                  </h3>
                  <div className="mt-1 text-sm text-blue-700">
                    <p>
                      This debate will start immediately and run for 1 hour.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <PrimaryButton
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Creating..." : "🎯 Create Debate"}
              </PrimaryButton>

              <PrimaryButton
                type="button"
                variant="outline"
                size="large"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </PrimaryButton>
            </div>
          </form>
        </div>
      </ContentCard>
    </div>
  );
}
