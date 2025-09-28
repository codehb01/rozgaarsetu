"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X, Upload } from "lucide-react";

// Work Image Component with fallback
function WorkPreviewImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [imageError, setImageError] = useState(false);

  if (!src || !src.trim() || imageError) {
    return (
      <div className="w-full h-32 bg-gray-700 rounded-md flex items-center justify-center">
        <span className="text-gray-400 text-xs">No Image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={128}
      className={className}
      onError={() => setImageError(true)}
    />
  );
}

type PreviousWork = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export default function PreviousWorkPage() {
  const router = useRouter();
  const [previousWorks, setPreviousWorks] = useState<PreviousWork[]>([]);
  const [newWork, setNewWork] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const addWork = () => {
    if (newWork.title.trim() && newWork.imageUrl.trim()) {
      const work: PreviousWork = {
        id: Date.now().toString(),
        ...newWork,
      };
      setPreviousWorks([...previousWorks, work]);
      setNewWork({ title: "", description: "", imageUrl: "" });
    }
  };

  const removeWork = (id: string) => {
    setPreviousWorks(previousWorks.filter((work) => work.id !== id));
  };

  const handleContinue = () => {
    // Store previous work data in sessionStorage
    if (previousWorks.length > 0) {
      sessionStorage.setItem("previousWorks", JSON.stringify(previousWorks));
    }

    // Navigate to preview page
    router.push("/onboarding/preview");
  };

  const handleSkip = () => {
    // Navigate to preview page without storing data
    router.push("/onboarding/preview");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/onboarding/worker-details")}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Previous Work (Optional)
          </h1>
          <p className="text-muted-foreground text-lg">
            Showcase your previous work to build trust with customers
          </p>
        </div>

        {/* Add New Work Form */}
        <Card className="border-emerald-900/20 mb-8">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Add Previous Work
            </h3>

            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Work Title (e.g., Kitchen Renovation, Bathroom Plumbing)"
                  value={newWork.title}
                  onChange={(e) =>
                    setNewWork({ ...newWork, title: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div>
                <Textarea
                  placeholder="Description (optional - describe the work you did)"
                  value={newWork.description}
                  onChange={(e) =>
                    setNewWork({ ...newWork, description: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 min-h-20"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Image URL (paste a link to your work image)"
                    value={newWork.imageUrl}
                    onChange={(e) =>
                      setNewWork({ ...newWork, imageUrl: e.target.value })
                    }
                    className="bg-gray-800 border-gray-700 flex-1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  You can upload images to imgur.com or similar service and
                  paste the link here
                </p>
              </div>

              <Button
                onClick={addWork}
                disabled={!newWork.title.trim() || !newWork.imageUrl.trim()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Work
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Display Added Works */}
        {previousWorks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">
              Your Previous Work ({previousWorks.length})
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previousWorks.map((work) => (
                <Card key={work.id} className="border-emerald-900/20">
                  <CardContent className="pt-4">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWork(work.id)}
                        className="absolute top-0 right-0 h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <div className="mb-3">
                        <WorkPreviewImage
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>

                      <h4 className="font-semibold text-white text-sm mb-1">
                        {work.title}
                      </h4>

                      {work.description && (
                        <p className="text-gray-400 text-xs line-clamp-2">
                          {work.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Skip for Now
          </Button>

          <Button
            onClick={handleContinue}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Continue to Preview
            {previousWorks.length > 0 &&
              ` (${previousWorks.length} work${
                previousWorks.length > 1 ? "s" : ""
              } added)`}
          </Button>
        </div>
      </div>
    </div>
  );
}
