"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  type?: "profile" | "work";
  className?: string;
  placeholder?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  type = "profile",
  className = "",
  placeholder = "Upload an image or paste URL",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onChange(data.url);
        setUrlInput(data.url);
        setImageError(false);
      } else {
        console.error("Upload failed:", data.error);
        alert(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    onChange(url);
    setImageError(false);
  };

  const handleRemove = () => {
    setUrlInput("");
    onRemove();
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {urlInput && !imageError && (
        <div className="relative">
          <div className="relative w-full h-40 bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={urlInput}
              alt="Preview"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImageError(true)}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Options */}
      {(!urlInput || imageError) && (
        <div className="space-y-3">
          {/* File Upload */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>

          {/* URL Input */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">Or</span>
            <Input
              placeholder={placeholder}
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="bg-gray-800 border-gray-700 flex-1"
            />
          </div>

          {imageError && (
            <p className="text-red-400 text-sm">
              Failed to load image. Please check the URL or try uploading a
              different image.
            </p>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, WebP. Max size: 5MB.
      </p>
    </div>
  );
}
