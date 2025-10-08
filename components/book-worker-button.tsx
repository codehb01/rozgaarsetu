"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiDollarSign,
  FiCheck,
} from "react-icons/fi";
import SmartDateTimePicker from "@/components/ui/smart-date-time-picker";
import OpenStreetMapInput from "@/components/ui/openstreetmap-input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X as XIcon, AlertCircle as AlertCircleIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ClickSpark from "@/components/ClickSpark";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  workerId: string;
  className?: string;
};

// Step configuration inspired by Worker Profile Setup
const STEPS = [
  {
    id: 0,
    title: "Job Details",
    subtitle: "What work needs to be done",
    icon: FiFileText,
  },
  { id: 1, title: "Schedule", subtitle: "When you need it", icon: FiCalendar },
  { id: 2, title: "Location", subtitle: "Where the work is", icon: FiMapPin },
  {
    id: 3,
    title: "Pricing",
    subtitle: "Your proposed budget",
    icon: FiDollarSign,
  },
];

export default function BookWorkerButton({ workerId, className }: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Single source of truth for all form data
  const [booking, setBooking] = useState({
    description: "",
    details: "",
    datetime: "",
    location: "",
    locationLat: "",
    locationLng: "",
    charge: "",
  });

  // Track which steps are completed
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Geolocation badge component
  function GeoBadge() {
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
      "idle"
    );
    const [label, setLabel] = useState("Use current location");

    const handleGeolocate = async () => {
      if (!navigator.geolocation) {
        setStatus("error");
        setLabel("Geolocation unavailable");
        return;
      }

      setStatus("loading");
      setLabel("Locating…");

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let locationText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
            );
            if (resp.ok) {
              const data = await resp.json();
              if (data.display_name) {
                locationText = data.display_name;
                setLabel(data.display_name.split(",").slice(0, 2).join(", "));
              }
            }
          } catch (e) {
            console.warn("Reverse geocoding failed", e);
          }

          setBooking((prev) => ({
            ...prev,
            location: locationText,
            locationLat: String(lat),
            locationLng: String(lng),
          }));
          setStatus("done");
        },
        (err) => {
          setStatus("error");
          setLabel("Permission denied");
          console.error("Geolocation error", err);
        },
        { enableHighAccuracy: false, timeout: 10000 }
      );
    };

    return (
      <button
        type="button"
        onClick={handleGeolocate}
        disabled={status === "loading"}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
          status === "done"
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-white border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600"
        } ${status === "loading" ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <FiMapPin className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  }

  // Validation for current step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0:
        if (!booking.description || booking.description.trim().length < 3) {
          setError("Please enter a job title (at least 3 characters)");
          return false;
        }
        break;
      case 1:
        if (!booking.datetime) {
          setError("Please select date and time");
          return false;
        }
        const dt = new Date(booking.datetime);
        if (isNaN(dt.getTime())) {
          setError("Invalid date/time selected");
          return false;
        }
        if (dt.getTime() <= Date.now()) {
          setError("Please choose a future date and time");
          return false;
        }
        break;
      case 2:
        if (!booking.location || booking.location.trim().length === 0) {
          setError("Please enter or select a location");
          return false;
        }
        break;
      case 3:
        const charge = Number(booking.charge);
        if (!booking.charge || charge <= 0) {
          setError("Please enter a valid price greater than 0");
          return false;
        }
        break;
    }
    setError(null);
    return true;
  };

  // Navigate to next step
  const handleNext = () => {
    if (!validateCurrentStep()) return;

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  // Navigate to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  // Submit booking
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Creating booking:", { workerId, ...booking });

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId,
          description: booking.description,
          details: booking.details,
          datetime: booking.datetime,
          location: booking.location,
          charge: Number(booking.charge),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle usage limit exceeded (403)
        if (res.status === 403) {
          const isLimitError =
            data.error?.toLowerCase().includes("limit") ||
            data.error?.toLowerCase().includes("exceeded") ||
            data.details?.toLowerCase().includes("limit") ||
            data.details?.toLowerCase().includes("exceeded");

          if (isLimitError) {
            // Close dialog first
            setOpen(false);
            resetForm();

            // Show toast notification
            toast.error("Monthly booking limit reached!", {
              description:
                "Upgrade to continue booking workers. Redirecting to pricing...",
              duration: 4000,
            });

            // Redirect to pricing page after a brief delay
            setTimeout(() => {
              router.push("/pricing");
            }, 2000);

            return; // Exit early to avoid further error handling
          }
        }

        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || `Failed to create booking (status ${res.status})`;
        throw new Error(errorMsg);
      }

      console.log("Booking created successfully:", data);

      // Success! Show success toast and navigate to bookings page
      toast.success("Booking request sent!", {
        description: "The worker will confirm your booking soon.",
      });

      setOpen(false);
      resetForm();
      window.location.href = "/customer/bookings";
    } catch (err: unknown) {
      console.error("Booking error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setBooking({
      description: "",
      details: "",
      datetime: "",
      location: "",
      locationLat: "",
      locationLng: "",
      charge: "",
    });
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setError(null);
  };

  // Open dialog
  const openDialog = () => {
    if (!isSignedIn) {
      window.location.href = "/sign-in";
      return;
    }
    resetForm();
    setOpen(true);
  };

  return (
    <>
      <ClickSpark sparkColor="#60a5fa" sparkCount={10} sparkRadius={20}>
        <Button
          onClick={openDialog}
          className={`${
            className ?? ""
          } bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all`}
        >
          Book
        </Button>
      </ClickSpark>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          backdrop="blur"
          className="max-w-5xl lg:max-w-6xl xl:max-w-7xl w-[96vw] max-h-[92vh] overflow-y-auto p-0 bg-white dark:bg-gray-900"
        >
          {/* Header */}
          <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-b dark:border-gray-700 sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Book this Worker
                </DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  Provide job details and schedule. The worker will confirm your
                  booking.
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <XIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Progress Steps - Clean Minimal Design */}
            <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isActive = idx === currentStep;
                const isCompleted = completedSteps.has(idx);
                const isClickable =
                  idx < currentStep || completedSteps.has(idx);

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => isClickable && setCurrentStep(idx)}
                    disabled={!isClickable}
                    className={`group relative flex flex-col items-center text-center p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500 ring-offset-2"
                        : isCompleted
                        ? "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md cursor-pointer border border-gray-200"
                        : "bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 border-gray-200 cursor-not-allowed opacity-60"
                    }`}
                  >
                    {/* Connector Line */}
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`hidden sm:block absolute top-8 -right-4 md:-right-5 w-4 md:w-5 h-0.5 transition-colors ${
                          isCompleted ? "bg-blue-500" : "bg-gray-200"
                        }`}
                      />
                    )}

                    {/* Icon Circle */}
                    <div className="relative mb-2 sm:mb-3">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                            : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isCompleted && !isActive ? (
                          <FiCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                        ) : (
                          <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>

                      {/* Active Pulse */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
                      )}
                    </div>

                    {/* Text */}
                    <div
                      className={`text-xs sm:text-sm font-bold transition-colors ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`hidden sm:block text-[10px] sm:text-xs mt-0.5 transition-colors ${
                        isActive ? "text-blue-500" : "text-gray-400"
                      }`}
                    >
                      {step.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
                <AlertCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-400 text-xs sm:text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="min-h-[280px] sm:min-h-[320px]">
              {/* Step 0: Job Details */}
              {currentStep === 0 && (
                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 sm:mb-2"
                    >
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="description"
                      value={booking.description}
                      onChange={(e) =>
                        setBooking({ ...booking, description: e.target.value })
                      }
                      placeholder="e.g., Fix leaking kitchen sink"
                      className="text-sm sm:text-base py-3 sm:py-4 md:py-6"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5">
                      Briefly describe the work you need done
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="details"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 sm:mb-2"
                    >
                      Additional Details (Optional)
                    </label>
                    <Textarea
                      id="details"
                      value={booking.details}
                      onChange={(e) =>
                        setBooking({ ...booking, details: e.target.value })
                      }
                      placeholder="Add any specific requirements, materials needed, or other context..."
                      rows={4}
                      className="resize-none text-sm"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5">
                      Provide more context to help the worker prepare
                    </p>
                  </div>
                </div>
              )}

              {/* Step 1: Schedule */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 sm:mb-2">
                      When do you need this done?{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <SmartDateTimePicker
                      value={
                        booking.datetime
                          ? new Date(booking.datetime)
                          : undefined
                      }
                      onChange={(date: Date) =>
                        setBooking({ ...booking, datetime: date.toISOString() })
                      }
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Type naturally (e.g., &ldquo;tomorrow at 2pm&rdquo;) or
                      use the calendar picker
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>💡 Tip:</strong> The worker will confirm
                      availability. Flexible timing increases chances of
                      acceptance.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 sm:mb-2">
                      Work Location <span className="text-red-500">*</span>
                    </label>
                    <OpenStreetMapInput
                      onSelect={(sel) => {
                        const display = sel?.displayName || "";
                        const lat = sel?.coords?.lat || "";
                        const lng = sel?.coords?.lng || "";
                        setBooking({
                          ...booking,
                          location: display,
                          locationLat: String(lat),
                          locationLng: String(lng),
                        });
                      }}
                      inputClassName="text-base py-6"
                    />
                    {booking.location && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                          📍 {booking.location}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Or use your current location:
                    </p>
                    <GeoBadge />
                  </div>
                </div>
              )}

              {/* Step 3: Pricing */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
                  <div>
                    <label
                      htmlFor="charge"
                      className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5 sm:mb-2"
                    >
                      Your Proposed Budget (₹){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                        ₹
                      </span>
                      <Input
                        id="charge"
                        type="number"
                        step="0.01"
                        min="0"
                        value={booking.charge}
                        onChange={(e) =>
                          setBooking({ ...booking, charge: e.target.value })
                        }
                        placeholder="500"
                        className="pl-10 py-6 text-lg"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                      You can negotiate the final price with the worker
                    </p>
                  </div>

                  {/* Review Summary */}
                  <div className="mt-4 sm:mt-6 md:mt-8 p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 border-gray-200 rounded-lg">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 mb-3 sm:mb-4">
                      Booking Summary
                    </h4>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Job:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {booking.description || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">When:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {booking.datetime
                            ? new Date(booking.datetime).toLocaleString()
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-gray-900 dark:text-white text-right max-w-xs truncate">
                          {booking.location || "Not set"}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 sm:pt-3 border-t border-gray-300">
                        <span className="text-gray-600 font-semibold text-xs sm:text-sm">
                          Proposed Price:
                        </span>
                        <span className="font-bold text-blue-600 text-base sm:text-lg">
                          ₹{booking.charge || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm border-t dark:border-gray-700 flex items-center justify-between sticky bottom-0">
            <div>
              {currentStep > 0 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  variant="outline"
                  className="px-3 sm:px-4 md:px-6 text-xs sm:text-sm"
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                variant="ghost"
                className="px-3 sm:px-4 md:px-6 text-xs sm:text-sm"
                disabled={loading}
              >
                Cancel
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="px-4 sm:px-6 md:px-8 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                >
                  Next
                </Button>
              ) : (
                <ClickSpark
                  sparkColor="#22c55e"
                  sparkCount={12}
                  sparkRadius={25}
                >
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 sm:px-6 md:px-8 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md text-xs sm:text-sm"
                  >
                    {loading ? "Creating..." : "Confirm & Book"}
                  </Button>
                </ClickSpark>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
