"use client";

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    IconLoader2, 
    IconAlertTriangle, 
    IconPhoto, 
    IconLock, 
    IconEye, 
    IconWallet,
    IconArrowLeft,
    IconX,
    IconDownload,
} from '@tabler/icons-react';
import { 
    useAccount, 
    useReadContract,
} from 'wagmi';
import {CONTRACT_ADDRESS,CONTRACT_ABI} from '@/lib/contract'
import { useParams } from 'next/navigation';

// --- 1. DEFINITIONS MOVED TO TOP LEVEL ---

// Define the structure of the album data
interface AlbumData {
    id: number;
    title: string;
    coverImageCid: string; // This is the CID for the METADATA JSON
    photoCids: string[];
    isPublic: boolean;
    owner: string; // Added owner for access control check
}

// Helper function to convert IPFS CID to a public gateway URL
function ipfsToGatewayUrl(ipfsCid: string): string {
    if (!ipfsCid || !ipfsCid.startsWith('ipfs://')) {
        return ""; // Return empty string for invalid CIDs
    }
    // Use a reliable public gateway
    return `https://ipfs.io/ipfs/${ipfsCid.substring(7)}`;
}

// --- REUSABLE IMAGE COMPONENT ---
function AlbumCoverImage({ 
    metadataCid, 
    alt,
    onImageClick 
}: { 
    metadataCid: string, 
    alt: string,
    onImageClick?: (imageUrl: string) => void
}) {
    const [imageUrl, setImageUrl] = useState<string>("https://placehold.co/400x400/eee/aaa?text=Loading...");
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!metadataCid) {
            setHasError(true);
            return;
        }

        const fetchImage = async () => {
            // Now references the top-level function
            const metadataUrl = ipfsToGatewayUrl(metadataCid); 
            if (!metadataUrl) {
                setHasError(true);
                return;
            }

            try {
                const response = await fetch(metadataUrl);
                if (!response.ok) throw new Error("Metadata not found");
                
                const metadata = await response.json();
                const imageCid = metadata.image;
                if (!imageCid) throw new Error("Image CID not found in metadata");

                // Now references the top-level function
                const finalImageUrl = ipfsToGatewayUrl(imageCid); 
                if (!finalImageUrl) throw new Error("Invalid image CID");
                
                setImageUrl(finalImageUrl);
                setHasError(false);
            } catch (error) {
                console.error("Failed to fetch album cover:", error);
                setHasError(true);
            }
        };

        fetchImage();
    }, [metadataCid]);

    if (hasError) {
        return (
            <img
                src="https://placehold.co/400x400/eee/aaa?text=Error"
                alt={alt}
                className="h-full w-full object-cover"
            />
        );
    }

    const isClickable = !hasError && imageUrl.startsWith('https://ipfs.io') && onImageClick;

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={`h-full w-full object-cover ${isClickable ? 'cursor-pointer' : ''}`}
            onError={(e) => (e.currentTarget.src = "https://placehold.co/400x400/eee/aaa?text=Error")}
            onClick={() => {
                if (isClickable) {
                    onImageClick(imageUrl);
                }
            }}
        />
    );
}

// --- REUSABLE MODAL COMPONENT ---
function PhotoModal({ imageUrl, onClose }: { imageUrl: string, onClose: () => void }) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            const filename = imageUrl.split('/').pop() || 'photo.jpg';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(imageUrl, '_blank');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
                onClick={onClose}
            >
                <IconX size={32} />
            </button>
            <div 
                className="relative max-w-full max-h-full flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt="Enlarged view"
                    className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="flex items-center justify-center gap-2 self-center bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md font-semibold transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                    {isDownloading ? (
                        <>
                            <IconLoader2 size={20} className="animate-spin" />
                            Downloading...
                        </>
                    ) : (
                        <>
                            <IconDownload size={20} />
                            Download
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

// --- 2. MAIN PAGE COMPONENT ---

export default function ViewAlbumPage() {
    const params = useParams();
    const id = params?.id as string;
    const { address } = useAccount(); // Get current connected address
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    // 1. Ensure address is never undefined for the contract call
    // Use a zero address if the user is not connected (Guest Mode)
    const userAddress = address || "0x0000000000000000000000000000000000000000";

    const { 
        data: albumData, 
        error, 
        isLoading 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAlbum',
        args: id ? [BigInt(id), userAddress] : undefined,
        // 2. Add 'account' context to ensure Wagmi simulates the call from the correct user
        account: address, 
        query: {
            enabled: !!id,
        }
    });

    const album = useMemo((): AlbumData | null => {
        if (!albumData) return null;
        const result = albumData as any;
        return {
            id: Number(result.id),
            title: result.title,
            coverImageCid: result.coverImageCid,
            photoCids: result.photoCids,
            isPublic: result.isPublic,
            owner: result.owner,
        };
    }, [albumData]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-10 min-h-[50vh]">
                    <IconLoader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg text-gray-700">Loading Album...</p>
                </div>
            );
        }

        if (error) {
             return (
                <div className="flex flex-col items-center justify-center text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                    <IconAlertTriangle className="h-10 w-10 text-red-500" />
                    <h2 className="mt-4 text-xl font-semibold text-red-700">Error Loading Album</h2>
                    <p className="mt-2 text-gray-600">{error.message}</p>
                </div>
            );
        }

        if (!album) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <IconPhoto className="h-12 w-12 text-gray-400" />
                    <h2 className="mt-6 text-xl font-semibold text-gray-800">Album Not Found</h2>
                </div>
            );
        }
        
        // 3. Updated Privacy Check
        // Because the contract no longer Reverts, we now successfully receive data.
        // We check if it's private here. 
        // Note: album.photoCids will be empty based on our new Contract logic if private.
        const isOwner = album.owner.toLowerCase() === userAddress.toLowerCase();
        
        if (!album.isPublic && !isOwner) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-10 bg-yellow-50 border border-yellow-200 rounded-lg min-h-[40vh]">
                    <IconLock className="h-16 w-16 text-yellow-500 mb-4" />
                    <h2 className="text-2xl font-bold text-yellow-800">Private Album</h2>
                    <p className="mt-2 text-gray-600 max-w-md">
                        This album is private. You do not have permission to view these photos.
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-wide text-gray-500 font-semibold">
                        Owned by {album.owner.slice(0,6)}...{album.owner.slice(-4)}
                    </p>
                </div>
            )
        }
        
        // State 5: Success, show album
        return (
            <>
                {/* Album Header */}
                <div className="relative h-56 sm:h-64 md:h-80 w-full bg-gray-200 rounded-lg overflow-hidden">
                    <AlbumCoverImage 
                        metadataCid={album.coverImageCid} 
                        alt={album.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                        <div className="flex items-center gap-2">
                             {album.isPublic ? (
                                <span className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    <IconEye size={14} /> Public
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                    <IconLock size={14} /> Private
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2">{album.title}</h1>
                        <p className="text-sm mt-2 opacity-90 truncate max-w-lg" title={album.owner}>
                            Owned by: {album.owner}
                        </p>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Photos ({album.photoCids.length})
                    </h2>
                    {album.photoCids.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            
                            {/* --- 3. EXPLICITLY TYPED `cid` --- */}
                            {album.photoCids.map((cid: string, index: number) => (
                                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 group">
                                    <AlbumCoverImage 
                                        metadataCid={cid} 
                                        alt={`Album photo ${index + 1}`}
                                        onImageClick={setSelectedImageUrl}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <IconPhoto className="h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-lg text-gray-600">This album is empty.</p>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-6">
                    <Link href="/dashboard">
                        <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-medium cursor-pointer">
                            <IconArrowLeft size={18} />
                            Back to Dashboard
                        </div>
                    </Link>
                </div>
                
                {renderContent()}
            </div>

            {selectedImageUrl && (
                <PhotoModal 
                    imageUrl={selectedImageUrl}
                    onClose={() => setSelectedImageUrl(null)}
                />
            )}
        </div>
    );
}