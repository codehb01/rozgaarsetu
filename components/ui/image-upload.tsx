"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Camera, FileImage } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  uploadType?: string;
  accept?: string;
  maxSize?: number;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  uploadType = "profile",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
  placeholder = "Upload image",
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = async () => {
    if (!value || isUploading) return;

    try {
      setIsUploading(true);
      
      // Extract filename from URL
      const fileName = value.split("/").pop();
      if (fileName) {
        await fetch(`/api/upload?fileName=${fileName}&uploadType=${uploadType}`, {
          method: "DELETE",
        });
      }
      
      onChange("");
    } catch (error) {
      console.error("Delete error:", error);
      setError("Failed to delete image");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Upload Area */}
      <div
        onClick={openFileDialog}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
          ${dragActive 
            ? "border-primary bg-primary/5" 
            : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${value ? "aspect-square max-w-xs" : "aspect-video min-h-[200px]"}
        `}
      >
        {value ? (
          // Image Preview
          <div className="relative w-full h-full group">
            <img
              src={value}
              alt="Uploaded image"
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileDialog();
                  }}
                  disabled={disabled || isUploading}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                  title="Change image"
                >
                  <Camera className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  disabled={disabled || isUploading}
                  className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          // Upload Placeholder
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
                  {dragActive ? (
                    <FileImage className="w-6 h-6 text-primary" />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-sm font-medium text-foreground mb-1">
                  {dragActive ? "Drop image here" : placeholder}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WebP up to {Math.round(maxSize / (1024 * 1024))}MB
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}