"use client";

import React, { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const FileUpload = ({
  onChange,
}: {
  onChange?: (files: { file: File; metadataUrl: string }[]) => void;
}) => {
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (newFiles: File[]) => {
    setStatus("Uploading files...");
    const uploadedData: { file: File; metadataUrl: string }[] = [];

    try {
      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/uploadfile", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        uploadedData.push({ file, metadataUrl: data.metadataUrl });
      }

      setStatus("✅ All files uploaded successfully!");
      if (onChange) onChange(uploadedData);
    } catch (error) {
      console.error(error);
      setStatus("❌ Upload failed, please try again.");
    }
  };

  const handleFileChange = (files: File[]) => {
    if (!files.length) return;
    uploadFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: true,
    noClick: true,
    onDrop: handleFileChange,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/gif": [".gif"],
    },
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        className={cn(
          "p-10 group/file block rounded-2xl cursor-pointer w-full text-center border-2 border-dashed transition-all",
          isDragActive
            ? "border-blue-400 bg-blue-950/30"
            : "border-gray-600 bg-gray-800/50 hover:border-gray-400"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
        <div className="flex flex-col items-center justify-center">
          <motion.div
            className="bg-gray-900 rounded-full p-5 shadow-lg mb-3"
            whileHover={{ rotate: 5 }}
          >
            <IconUpload
              className={cn(
                "h-10 w-10",
                isDragActive ? "text-blue-400" : "text-gray-300"
              )}
            />
          </motion.div>
          <p className="text-lg font-semibold text-gray-200">
            {isDragActive ? "Drop your photos here" : "Upload Photos"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Drag & drop or click to upload multiple (PNG, JPG, GIF)
          </p>
          {status && (
            <p className="mt-3 text-sm font-medium text-gray-400">{status}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
