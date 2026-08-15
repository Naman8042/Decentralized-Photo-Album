// app/api/uploadfile/route.ts
import { NextResponse } from "next/server";
import PinataClient from "@pinata/sdk";
import { Readable } from "stream";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

const pinata = new PinataClient({
  pinataApiKey: PINATA_API_KEY,
  pinataSecretApiKey: PINATA_API_SECRET,
});

async function fileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request: Request) {
  try {
    if (!PINATA_API_KEY || !PINATA_API_SECRET) {
      return NextResponse.json(
        { error: "Configuration Error: Pinata API keys are missing." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json(
        { error: 'No valid file uploaded under key "file".' },
        { status: 400 }
      );
    }

    const uploadedFile = fileEntry as File;
    const fileBuffer = await fileToBuffer(uploadedFile);
    const fileName = uploadedFile.name || "uploaded_asset";

    // Convert buffer to readable stream
    const readableStream = Readable.from(fileBuffer);
    (readableStream as any).path = fileName;

    // Upload file to Pinata
    const fileUploadResponse = await pinata.pinFileToIPFS(readableStream, {
      pinataMetadata: { name: fileName },
      wrapWithDirectory: false,
    } as any);

    const imageUri = `ipfs://${fileUploadResponse.IpfsHash}`;

    // Upload metadata JSON
    const metadata = {
      name: fileName,
      description: "User uploaded photo",
      image: imageUri,
    };

    const metadataUploadResponse = await pinata.pinJSONToIPFS(metadata, {
      pinataMetadata: { name: `${fileName}_metadata` },
    });

    const metadataUrl = `ipfs://${metadataUploadResponse.IpfsHash}`;

    return NextResponse.json(
      { metadataUrl },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error: any) {
    console.error("Upload failed:", error);
    const errorDetails = error?.details || error?.message || "Unknown error";

    return NextResponse.json(
      { error: "Upload failed: Internal Server Error.", details: errorDetails },
      { status: 500 }
    );
  }
}
