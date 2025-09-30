"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, FileImage, File as FileIcon } from "lucide-react";

interface MultiFileUploadProps {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  accept?: string;
  maxSize?: number;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  uploadType?: string;
}

export default function MultiFileUpload({
  value = [],
  onChange,
  maxFiles = 5,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  className = "",
  placeholder = "Upload files",
  disabled = false,
  uploadType = "documents"
}: MultiFileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    let errorMessage = "";

    for (const file of fileArray) {
      // Check file size
      if (file.size > maxSize) {
        errorMessage = `File ${file.name} is too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`;
        continue;
      }

      // Check total files
      if (value.length + validFiles.length >= maxFiles) {
        errorMessage = `Maximum ${maxFiles} files allowed`;
        break;
      }

      validFiles.push(file);
    }

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError(null);
    onChange([...value, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
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

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="w-6 h-6" />;
    }
    return <FileIcon className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : disabled
            ? "border-muted bg-muted/20"
            : "border-border hover:border-primary/50"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <Upload
            className={`w-8 h-8 mb-3 ${
              disabled ? "text-muted-foreground" : "text-muted-foreground group-hover:text-primary"
            }`}
          />
          <div className="text-center">
            <p className={`text-sm font-medium ${disabled ? "text-muted-foreground" : ""}`}>
              {placeholder}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag and drop files here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Max {maxFiles} files, {Math.round(maxSize / (1024 * 1024))}MB each
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded p-2">
          {error}
        </div>
      )}

      {/* File List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded files ({value.length}/{maxFiles})</p>
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
            >
              <div className="text-muted-foreground">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-1 hover:bg-background rounded transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}