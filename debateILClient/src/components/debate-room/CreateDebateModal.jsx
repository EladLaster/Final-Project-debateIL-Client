import { useState } from "react";
import { createDebate } from "../../stores";
import PrimaryButton from "../basic-ui/PrimaryButton";
import ContentCard from "../basic-ui/ContentCard";

export default function CreateDebateModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    topic: "",
    start_time: "",
    duration: 60, // minutes
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
    } else if (formData.topic.length < 5) {
      newErrors.topic = "Topic must be at least 5 characters";
    }

    if (!formData.start_time) {
      newErrors.start_time = "Start time is required";
    } else {
      const startTime = new Date(formData.start_time);
      const now = new Date();
      if (startTime <= now) {
        newErrors.start_time = "Start time must be in the future";
      }
    }

    if (formData.duration < 15 || formData.duration > 180) {
      newErrors.duration = "Duration must be between 15 and 180 minutes";
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
      // Calculate end time
      const startTime = new Date(formData.start_time);
      const endTime = new Date(startTime.getTime() + formData.duration * 60000);

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
        start_time: "",
        duration: 60,
      });

      onSuccess?.(newDebate);
      onClose();
    } catch (error) {
      console.error("Error creating debate:", error);
      setErrors({ general: error.message || "Failed to create debate" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      topic: "",
      start_time: "",
      duration: 60,
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

            {/* Start Time and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.start_time ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.start_time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.start_time}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Duration (minutes) *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
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
