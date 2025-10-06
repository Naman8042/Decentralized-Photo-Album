'use client'; 

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
// PinataClient/NFTStorage imports are completely removed from the frontend

// ... (mainVariant, secondaryVariant, client initialization logic removed)
// The Pinata logic is now completely inside the /api/upload-pinata route

export const FileUpload = ({
  onChange,
}: {
  onChange?: (metadataUrl: string) => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (newFiles: File[]) => {
    if (!newFiles.length) return;
    setFiles((prev) => [...prev, ...newFiles]);

    try {
      setStatus("Uploading file and generating metadata...");
      const file = newFiles[0];

      // 1. Create a FormData object to send the file
      const formData = new FormData();
      // 'file' must match the key the API route is looking for
      formData.append('file', file); 

      // 2. POST the file to your secure API route
      const response = await fetch('/api/uploadfile', {
        method: 'POST',
        // The browser handles the Content-Type header for FormData
        body: formData, 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || `Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      const metadataUrl = data.metadataUrl; // The URL returned from the API route

      setStatus(`Upload complete! Metadata URL: ${metadataUrl}`);
      if (onChange) onChange(metadataUrl); // returns the IPFS CID of the metadata
    } catch (err) {
      console.error(err);
      setStatus(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  // ... (rest of the component logic remains the same)
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    onDrop: handleFileChange,
  });

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) =>
            handleFileChange(Array.from(e.target.files || []))
          }
          className="hidden"
        />
        {/* ... (rest of the JSX) */}
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-white text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-white text-base mt-2">
            Drag or drop your files here or click to upload
          </p>

          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {!files.length && (
              <motion.div
                layoutId="file-upload"
                // variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    Drop it
                    <IconUpload className="h-4 w-4 text-white" />
                  </motion.p>
                ) : (
                  <IconUpload className="h-4 w-4 bg-white" />
                )}
              </motion.div>
            )}

            {status && (
              <p className="mt-4 text-sm font-medium text-white">{status}</p>
            )}

            <motion.div
              // variants={secondaryVariant}
              className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};