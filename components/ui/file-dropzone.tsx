"use client";
import { AnimatePresence, motion } from "framer-motion";
import { File, Trash2, Upload } from "lucide-react";
import type React from "react";
import { type DragEvent, useRef, useState } from "react";

interface FileWithPreview extends File {
  preview: string;
}

interface FileDropzoneProps {
  onChange?: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileDropzone({ 
  onChange, 
  accept = "image/*,application/pdf",
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = ""
}: FileDropzoneProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFile(droppedFiles[0]); // Only take the first file
    }
  };

  const handleFile = (selectedFile: File) => {
    setError("");

    // Validate file size
    if (maxSize && selectedFile.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Revoke previous preview URL if exists
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }

    const fileWithPreview = Object.assign(selectedFile, {
      preview: URL.createObjectURL(selectedFile),
    });

    setFile(fileWithPreview);
    onChange?.(selectedFile);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]); // Only take the first file
    }
  };

  const handleDeleteFile = () => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setFile(null);
    onChange?.(null);
    setError("");
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        className={`relative w-full cursor-pointer rounded-xl border-2 border-dashed p-8 md:p-12 text-center transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-500/5"
            : error
            ? "border-red-500 bg-red-500/5"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
        }`}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          accept={accept}
          className="hidden"
          multiple={false}
          onChange={handleFileInputChange}
          ref={fileInputRef}
          type="file"
        />
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="drag-active"
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none select-none"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="pointer-events-none mx-auto size-8 select-none text-blue-500" />
              <p className="pointer-events-none mt-2 select-none text-blue-500 text-sm">
                Drop file here...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="drag-inactive"
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="mx-auto size-8 text-gray-400 dark:text-gray-500" />
              <p className="mt-2 text-balance font-medium text-gray-600 dark:text-gray-400 text-sm tracking-tight">
                Drag and drop a file here, or click to select
              </p>
              <p className="mt-1 text-gray-500 dark:text-gray-500 text-xs">
                {accept.includes("image") && "Images"} 
                {accept.includes("pdf") && accept.includes("image") && " or PDFs"}
                {accept.includes("pdf") && !accept.includes("image") && "PDFs"}
                {" "}up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}

      <AnimatePresence>
        {file && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-800/50 p-3 border border-gray-200 dark:border-gray-700"
              exit={{ opacity: 0, x: 20 }}
              initial={{ opacity: 0, x: -20 }}
            >
              {file.type.startsWith("image/") ? (
                <img
                  alt={file.name}
                  className="mr-3 size-12 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                  src={file.preview}
                />
              ) : (
                <div className="mr-3 size-12 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <File className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-gray-700 dark:text-gray-300 text-sm font-medium">
                  {file.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile();
                }}
                className="ml-3 p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="size-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileDropzone;
