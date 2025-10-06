// app/api/uploadfile/route.ts
import { NextResponse } from "next/server";
import PinataClient from "@pinata/sdk";
import { Readable } from 'stream'; // ⬅️ NEW IMPORT: Required for correct streaming

// 1. Initialize Pinata Client with SECURE Server-Side Keys
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const pinata = new PinataClient({
  pinataApiKey: PINATA_API_KEY,
  pinataSecretApiKey: PINATA_API_SECRET,
});

// Helper function to convert the File into a Buffer (Node.js readable format)
async function fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
}


export async function POST(request: Request) { 
  try {
    if (!PINATA_API_KEY || !PINATA_API_SECRET) {
      return NextResponse.json({ error: "Configuration Error: Pinata API keys are missing." }, { status: 500 });
    }
    
    // 2. Use the native Web API request.formData() to parse the file
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'No valid file uploaded under key "file".' }, { status: 400 });
    }
    
    const uploadedFile = fileEntry as File;
    const fileBuffer = await fileToBuffer(uploadedFile);
    const fileName = uploadedFile.name || 'uploaded_asset';

    // 3. FIX: Convert Buffer to ReadableStream for Pinata SDK compatibility
    const readableStream = Readable.from(fileBuffer); 
    // Pinata sometimes expects the filename to be set on the stream object
    (readableStream as any).path = fileName; 

    const fileUploadResponse = await pinata.pinFileToIPFS(
    readableStream, 
    { 
        pinataMetadata: { name: fileName }, // Metadata is correct
        // ⚠️ FIX IS HERE: wrapWithDirectory is a direct property of PinataPinOptions
        wrapWithDirectory: false 
    }as any 
);

    
    const imageUri = `ipfs://${fileUploadResponse.IpfsHash}`;

    // 4. Create and Upload the Metadata JSON
    const metadata = {
      name: fileName,
      description: "User uploaded photo",
      image: imageUri,
    };

    const metadataUploadResponse = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: { name: `${fileName}_metadata` },
    });
    const metadataUrl = `ipfs://${metadataUploadResponse.IpfsHash}`;

    return NextResponse.json({ metadataUrl: metadataUrl }, { status: 200 });

  } catch (error) {
    console.error("Upload failed:", error);
    
    // Check for the API key permission error and return a specific message
    const errorDetails = error && typeof error === 'object' && 'details' in error ? error.details : 'Unknown error';
    
    return NextResponse.json(
      {
        error: "Upload failed: Internal Server Error.",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}