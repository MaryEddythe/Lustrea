"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Eye, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  selectedImage?: File | null;
  label?: string;
  description?: string;
  required?: boolean;
}

export default function ImageUpload({
  onImageSelect,
  selectedImage,
  label = "Design Reference Image",
  description = "Upload an image to show your desired nail design",
  required = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <ImageIcon className="w-4 h-4" />
        {label} {required && "*"}
      </Label>

      <p className="text-sm text-gray-600">{description}</p>

      {!selectedImage ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
            isDragOver
              ? "border-pink-400 bg-pink-50"
              : "border-gray-300 hover:border-pink-400 hover:bg-pink-50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">
              Drop your image here or click to browse
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            required={required}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg p-4">
            {preview && (
              <div className="flex items-start gap-4">
                <img
                  src={preview}
                  alt="Design reference preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedImage.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(preview, "_blank")}
                        className="text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemove}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Option to change image */}
          <button
            type="button"
            onClick={handleBrowseClick}
            className="text-sm text-pink-600 hover:text-pink-800 underline"
          >
            Change image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
