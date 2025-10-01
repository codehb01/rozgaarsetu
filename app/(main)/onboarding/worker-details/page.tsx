"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Loader2, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Wrench, 
  MapPin, 
  DollarSign,
  Camera,
  CheckCircle,
  Plus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkerFormData {
  aadharNumber: string;
  qualification: string;
  certificates: string[];
  skilledIn: string[];
  availableAreas: string[];
  yearsExperience: number;
  hourlyRate: number;
  minimumFee: number;
  profilePic: File[];
  bio: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic details about you",
    icon: User,
  },
  {
    id: 2,
    title: "Skills & Services",
    description: "What you specialize in",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Pricing",
    description: "Set your rates",
    icon: DollarSign,
  },
  {
    id: 4,
    title: "Location",
    description: "Where you work",
    icon: MapPin,
  },
  {
    id: 5,
    title: "Profile",
    description: "Complete your profile",
    icon: Camera,
  },
];

const popularSkills = [
  "Plumbing", "Electrical", "Carpentry", "Painting", "Cleaning",
  "Gardening", "AC Repair", "Appliance Repair", "Masonry", "Welding",
  "Roofing", "Flooring", "Pest Control", "Moving", "Handyman"
];

const experienceLevels = [
  { range: "0-1", label: "Beginner", description: "Just starting out" },
  { range: "2-5", label: "Experienced", description: "Good experience" },
  { range: "6-10", label: "Expert", description: "Highly skilled" },
  { range: "10+", label: "Master", description: "Industry veteran" }
];

export default function WorkerDetailsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<WorkerFormData>({
    defaultValues: {
      skilledIn: [],
      qualification: "",
      certificates: [],
      aadharNumber: "",
      yearsExperience: 0,
      hourlyRate: 0,
      minimumFee: 0,
      profilePic: [],
      bio: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      availableAreas: [],
    },
  });

  const currentStepData = steps.find(step => step.id === currentStep);
  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      setValue("skilledIn", updatedSkills);
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(updatedSkills);
    setValue("skilledIn", updatedSkills);
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof WorkerFormData)[] => {
    switch (step) {
      case 1:
        return ["aadharNumber", "qualification", "yearsExperience", "bio"];
      case 2:
        return ["skilledIn"];
      case 3:
        return ["hourlyRate", "minimumFee"];
      case 4:
        return ["address", "city", "state", "country", "postalCode"];
      case 5:
        return [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: WorkerFormData) => {
    setIsLoading(true);

    try {
      // Store form data in sessionStorage for later use
      sessionStorage.setItem("workerDetails", JSON.stringify(data));

      // Navigate to previous work page
      router.push("/onboarding/previous-work");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding")}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Role Selection
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Worker Profile Setup
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Let's create your professional profile
              </p>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                const StepIcon = step.icon;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                          isCompleted
                            ? "bg-blue-600 text-white"
                            : isActive
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-2 border-blue-600"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                        animate={{
                          scale: isActive ? 1.1 : 1,
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </motion.div>
                      <div className="text-center">
                        <div className={`text-sm font-medium ${
                          isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400 hidden sm:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-0.5 mx-4 transition-colors duration-300 ${
                        step.id < currentStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step Content */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Personal Information
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Tell us about your background and experience
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Aadhar Number
                            </label>
                            <Input
                              placeholder="Enter 12-digit Aadhar number"
                              {...register("aadharNumber", {
                                required: "Aadhar number is required",
                                pattern: {
                                  value: /^\d{12}$/,
                                  message: "Please enter a valid 12-digit Aadhar number"
                                }
                              })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.aadharNumber && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.aadharNumber.message}
                              </p>
                            )}
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Qualification
                            </label>
                            <Input
                              placeholder="e.g., ITI, Diploma, Graduate"
                              {...register("qualification", {
                                required: "Qualification is required"
                              })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.qualification && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.qualification.message}
                              </p>
                            )}
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-4"
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Experience Level
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {experienceLevels.map((level) => (
                              <motion.div
                                key={level.range}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  watch("yearsExperience").toString() === level.range
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                                onClick={() => setValue("yearsExperience", parseInt(level.range) || 10)}
                              >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {level.label}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {level.range} years
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {level.description}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tell us about yourself
                          </label>
                          <Textarea
                            placeholder="Describe your experience, specializations, and what makes you unique..."
                            {...register("bio", {
                              required: "Bio is required",
                              minLength: {
                                value: 50,
                                message: "Please write at least 50 characters"
                              }
                            })}
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-24"
                          />
                          <div className="flex justify-between items-center mt-1">
                            {errors.bio && (
                              <p className="text-red-500 text-sm">
                                {errors.bio.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 ml-auto">
                              {watch("bio")?.length || 0}/500
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Skills & Services
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            What services do you provide?
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Select your skills
                          </label>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                            {popularSkills.map((skill, index) => (
                              <motion.div
                                key={skill}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Badge
                                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                                  className={`cursor-pointer w-full justify-center py-2 transition-all duration-200 ${
                                    selectedSkills.includes(skill)
                                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                  }`}
                                  onClick={() => 
                                    selectedSkills.includes(skill) 
                                      ? removeSkill(skill) 
                                      : addSkill(skill)
                                  }
                                >
                                  {skill}
                                  {selectedSkills.includes(skill) && (
                                    <X className="h-3 w-3 ml-1" />
                                  )}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Input
                              placeholder="Add custom skill"
                              value={customSkill}
                              onChange={(e) => setCustomSkill(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            <Button
                              type="button"
                              onClick={addCustomSkill}
                              disabled={!customSkill.trim()}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          {selectedSkills.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-4"
                            >
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Selected skills ({selectedSkills.length}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {selectedSkills.map((skill) => (
                                  <Badge
                                    key={skill}
                                    variant="default"
                                    className="bg-blue-600 text-white"
                                  >
                                    {skill}
                                    <X 
                                      className="h-3 w-3 ml-1 cursor-pointer" 
                                      onClick={() => removeSkill(skill)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Set Your Rates
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Configure your pricing to attract customers
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                          >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Hourly Rate (₹)
                            </label>
                            <Input
                              placeholder="e.g., 500"
                              type="number"
                              {...register("hourlyRate", {
                                required: "Hourly rate is required",
                                min: { value: 100, message: "Minimum rate is ₹100/hour" },
                                valueAsNumber: true
                              })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.hourlyRate && (
                              <p className="text-red-500 text-sm">
                                {errors.hourlyRate.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Competitive rates in your area: ₹300-800/hour
                            </p>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                          >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Minimum Job Fee (₹)
                            </label>
                            <Input
                              placeholder="e.g., 1000"
                              type="number"
                              {...register("minimumFee", {
                                required: "Minimum fee is required",
                                min: { value: 200, message: "Minimum fee should be at least ₹200" },
                                valueAsNumber: true
                              })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.minimumFee && (
                              <p className="text-red-500 text-sm">
                                {errors.minimumFee.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              For small jobs regardless of time spent
                            </p>
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
                        >
                          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                            💡 Pricing Tips
                          </h3>
                          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• Start competitive and adjust based on demand</li>
                            <li>• Higher rates often signal quality to customers</li>
                            <li>• Consider rush job premiums</li>
                            <li>• Factor in travel time and materials</li>
                          </ul>
                        </motion.div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Service Location
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Where do you provide your services?
                          </p>
                        </div>

                        <div className="space-y-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Full Address
                            </label>
                            <Input
                              placeholder="Street address, building name, etc."
                              {...register("address", {
                                required: "Address is required"
                              })}
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                            {errors.address && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.address.message}
                              </p>
                            )}
                          </motion.div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                City
                              </label>
                              <Input
                                placeholder="Enter city name"
                                {...register("city", {
                                  required: "City is required"
                                })}
                                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                              {errors.city && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.city.message}
                                </p>
                              )}
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                State
                              </label>
                              <Input
                                placeholder="Enter state name"
                                {...register("state", {
                                  required: "State is required"
                                })}
                                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                              {errors.state && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.state.message}
                                </p>
                              )}
                            </motion.div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Country
                              </label>
                              <Input
                                placeholder="Enter country"
                                {...register("country", {
                                  required: "Country is required"
                                })}
                                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                              {errors.country && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.country.message}
                                </p>
                              )}
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Postal Code
                              </label>
                              <Input
                                placeholder="Enter postal code"
                                {...register("postalCode", {
                                  required: "Postal code is required"
                                })}
                                className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                              />
                              {errors.postalCode && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors.postalCode.message}
                                </p>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                            Complete Your Profile
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            Add a profile picture to build trust
                          </p>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="space-y-4"
                        >
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            Profile Picture (Optional)
                          </label>
                          
                          <Controller
                            name="profilePic"
                            control={control}
                            render={({ field }) => (
                              <FileUpload
                                onChange={(files) => field.onChange(files)}
                              />
                            )}
                          />
                          
                          <p className="text-xs text-gray-500 text-center">
                            Upload a clear, professional photo to increase your booking chances by 3x
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg"
                        >
                          <h3 className="font-medium text-green-900 dark:text-green-100 mb-3">
                            🎉 You're almost done!
                          </h3>
                          <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                            Your profile is looking great. Next, you'll be able to showcase your previous work and start receiving job requests.
                          </p>
                          <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                            <li>✓ Personal information completed</li>
                            <li>✓ Skills and services added</li>
                            <li>✓ Pricing configured</li>
                            <li>✓ Location details provided</li>
                          </ul>
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className="border-gray-200 dark:border-gray-700"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Step {currentStep} of {steps.length}
                  </div>

                  {isLastStep ? (
                    <Button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : null}
                      Complete Setup
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
