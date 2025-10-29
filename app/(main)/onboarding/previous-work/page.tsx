"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileDropzone } from "@/components/ui/file-dropzone";
import {
  ArrowLeft,
  Plus,
  X,
  Calendar,
  DollarSign,
  Clock,
  Star,
  Camera,
  Eye,
  Edit,
  Trash2,
  Upload,
  Grid3X3,
  List,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClickSpark from "@/components/ClickSpark";

// Work Categories
const workCategories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Cleaning",
  "Gardening",
  "AC Repair",
  "Appliance Repair",
  "Masonry",
  "Welding",
  "Roofing",
  "Flooring",
  "Interior Design",
  "Renovation",
  "Maintenance",
];

// Project Complexity Levels
const complexityLevels = [
  {
    level: "Simple",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    description: "Basic repair/maintenance",
  },
  {
    level: "Moderate",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    description: "Standard installation",
  },
  {
    level: "Complex",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    description: "Advanced project",
  },
  {
    level: "Expert",
    color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    description: "Specialized work",
  },
];

// Work Image Component with fallback and lightbox
function WorkPreviewImage({
  src,
  alt,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  className: string;
  onClick?: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || !src.trim() || imageError) {
    return (
      <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative cursor-pointer group" onClick={onClick}>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={300}
        className={`${className} transition-transform duration-300 group-hover:scale-105`}
        style={{ width: "100%", height: "auto" }}
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg flex items-center justify-center">
        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}

type PreviousWork = {
  id: string;
  title: string;
  description: string;
  images: File[];
  category: string;
  dateCompleted: string;
  duration: string;
  complexity: string;
  costRange: string;
  clientRating?: number;
  beforeImage?: File[];
  afterImage?: File[];
};

export default function PreviousWorkPage() {
  const router = useRouter();
  const [previousWorks, setPreviousWorks] = useState<PreviousWork[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWork, setEditingWork] = useState<PreviousWork | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    images: [] as File[],
    category: "",
    dateCompleted: "",
    duration: "",
    complexity: "Simple",
    costRange: "",
    clientRating: 5,
    beforeImage: [] as File[],
    afterImage: [] as File[],
  });

  const addWork = () => {
    if (newWork.title.trim() && newWork.images.length > 0) {
      const work: PreviousWork = {
        id: Date.now().toString(),
        ...newWork,
      };
      setPreviousWorks([...previousWorks, work]);
      setNewWork({
        title: "",
        description: "",
        images: [],
        category: "",
        dateCompleted: "",
        duration: "",
        complexity: "Simple",
        costRange: "",
        clientRating: 5,
        beforeImage: [],
        afterImage: [],
      });
      setShowAddForm(false);
    }
  };

  const removeWork = (id: string) => {
    setPreviousWorks(previousWorks.filter((work) => work.id !== id));
  };

  const handleContinue = () => {
    if (previousWorks.length > 0) {
      sessionStorage.setItem("previousWorks", JSON.stringify(previousWorks));
    }
    router.push("/onboarding/preview");
  };

  const handleSkip = () => {
    router.push("/onboarding/preview");
  };

  const filteredWorks =
    selectedCategory === "All"
      ? previousWorks
      : previousWorks.filter((work) => work.category === selectedCategory);

  const getImageUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/onboarding/worker-details")}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
                Portfolio & Previous Work
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Showcase your expertise to build trust with customers
              </p>
            </div>
          </motion.div>

          {/* Stats and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          >
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {previousWorks.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Projects
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {previousWorks.reduce(
                    (acc, work) => acc + work.images.length,
                    0
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Photos
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Add Work Button */}
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </motion.div>

          {/* Category Filter */}
          {previousWorks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === "All" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("All")}
                >
                  All ({previousWorks.length})
                </Badge>
                {[...new Set(previousWorks.map((work) => work.category))].map(
                  (category) => {
                    const count = previousWorks.filter(
                      (work) => work.category === category
                    ).length;
                    return (
                      <Badge
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category} ({count})
                      </Badge>
                    );
                  }
                )}
              </div>
            </motion.div>
          )}

          {/* Add Work Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8"
              >
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Add New Project
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Title *
                          </label>
                          <Input
                            placeholder="e.g., Kitchen Renovation, Bathroom Plumbing"
                            value={newWork.title}
                            onChange={(e) =>
                              setNewWork({ ...newWork, title: e.target.value })
                            }
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Category
                          </label>
                          <select
                            value={newWork.category}
                            onChange={(e) =>
                              setNewWork({
                                ...newWork,
                                category: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="">Select category</option>
                            {workCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Complexity Level
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {complexityLevels.map((level) => (
                              <div
                                key={level.level}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  newWork.complexity === level.level
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                }`}
                                onClick={() =>
                                  setNewWork({
                                    ...newWork,
                                    complexity: level.level,
                                  })
                                }
                              >
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {level.level}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {level.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Date Completed
                            </label>
                            <Input
                              type="date"
                              value={newWork.dateCompleted}
                              onChange={(e) =>
                                setNewWork({
                                  ...newWork,
                                  dateCompleted: e.target.value,
                                })
                              }
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Duration
                            </label>
                            <Input
                              placeholder="e.g., 2 days, 1 week"
                              value={newWork.duration}
                              onChange={(e) =>
                                setNewWork({
                                  ...newWork,
                                  duration: e.target.value,
                                })
                              }
                              className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Images and Details */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Project Image *
                          </label>
                          <FileDropzone
                            accept="image/*"
                            maxSize={5 * 1024 * 1024}
                            onChange={(file) =>
                              setNewWork({
                                ...newWork,
                                images: file ? [file] : [],
                              })
                            }
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Upload an image to showcase your work
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <Textarea
                            placeholder="Describe the work you did, challenges faced, materials used..."
                            value={newWork.description}
                            onChange={(e) =>
                              setNewWork({
                                ...newWork,
                                description: e.target.value,
                              })
                            }
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 min-h-24"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cost Range (Optional)
                          </label>
                          <Input
                            placeholder="e.g., ₹5,000 - ₹10,000"
                            value={newWork.costRange}
                            onChange={(e) =>
                              setNewWork({
                                ...newWork,
                                costRange: e.target.value,
                              })
                            }
                            className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={addWork}
                        disabled={
                          !newWork.title.trim() || newWork.images.length === 0
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add Project
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portfolio Grid */}
          {filteredWorks.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {filteredWorks.map((work, index) => (
                  <motion.div
                    key={work.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        {/* Image */}
                        <div className="relative">
                          {work.images.length > 0 && (
                            <WorkPreviewImage
                              src={getImageUrl(work.images[0])}
                              alt={work.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                              onClick={() =>
                                setLightboxImage(getImageUrl(work.images[0]))
                              }
                            />
                          )}

                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                              onClick={() => setEditingWork(work)}
                            >
                              <Edit className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                              onClick={() => removeWork(work.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Image Count Badge */}
                          {work.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                              +{work.images.length - 1} more
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {work.title}
                            </h4>
                            {work.category && (
                              <Badge variant="outline" className="text-xs">
                                {work.category}
                              </Badge>
                            )}
                          </div>

                          {work.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                              {work.description}
                            </p>
                          )}

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                            {work.dateCompleted && (
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(
                                  work.dateCompleted
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {work.duration && (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {work.duration}
                              </div>
                            )}
                            {work.costRange && (
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                {work.costRange}
                              </div>
                            )}
                          </div>

                          {/* Complexity Badge */}
                          <div className="mt-3">
                            <Badge
                              variant="outline"
                              className={
                                complexityLevels.find(
                                  (level) => level.level === work.complexity
                                )?.color
                              }
                            >
                              {work.complexity}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 max-w-md mx-auto">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Projects Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add your first project to start building your portfolio and
                  attract more customers.
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            </motion.div>
          )}

          {/* Lightbox */}
          <AnimatePresence>
            {lightboxImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setLightboxImage(null)}
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  className="relative max-w-4xl max-h-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={lightboxImage}
                    alt="Project preview"
                    width={800}
                    height={600}
                    className="rounded-lg max-h-screen object-contain"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-white hover:bg-white/20"
                    onClick={() => setLightboxImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-between"
          >
            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-200 dark:border-gray-700"
            >
              Skip for Now
            </Button>

            <ClickSpark sparkColor="#60a5fa" sparkCount={12} sparkRadius={25}>
              <Button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue to Preview
                {previousWorks.length > 0 && (
                  <span className="ml-2 bg-blue-700 text-white px-2 py-0.5 rounded-full text-xs">
                    {previousWorks.length}
                  </span>
                )}
              </Button>
            </ClickSpark>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
