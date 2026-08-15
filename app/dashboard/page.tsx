"use client";

import { useMemo, useState, useEffect } from 'react'; // <-- Added useState, useEffect
import Link from 'next/link';
import { 
    IconLoader2, 
    IconAlertTriangle, 
    IconPhoto, 
    IconPlus, 
    IconLock, 
    IconEye, 
    IconWallet 
} from '@tabler/icons-react';
import { 
    useAccount, 
    useReadContract,
    useReadContracts
} from 'wagmi';
import {CONTRACT_ADDRESS,CONTRACT_ABI} from '@/lib/contract'


interface AlbumData {
    id: number;
    title: string;
    coverImageCid: string; // This is the CID for the METADATA JSON
    photoCids: string[];
    isPublic: boolean;
}

// Helper function to convert IPFS CID to a public gateway URL
function ipfsToGatewayUrl(ipfsCid: string): string {
    if (!ipfsCid || !ipfsCid.startsWith('ipfs://')) {
        return ""; // Return empty string for invalid CIDs
    }
    // Use a reliable public gateway
    return `https://ipfs.io/ipfs/${ipfsCid.substring(7)}`;
}

// --- NEW COMPONENT ---
// This component fetches the metadata, then fetches the image
function AlbumCoverImage({ metadataCid, alt }: { metadataCid: string, alt: string }) {
    const [imageUrl, setImageUrl] = useState<string>("https://placehold.co/400x400/eee/aaa?text=Loading...");
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!metadataCid) {
            setHasError(true);
            return;
        }

        const fetchImage = async () => {
            const metadataUrl = ipfsToGatewayUrl(metadataCid);
            if (!metadataUrl) {
                setHasError(true);
                return;
            }

            try {
                // 1. Fetch the metadata JSON
                const response = await fetch(metadataUrl);
                if (!response.ok) throw new Error("Metadata not found");
                
                const metadata = await response.json();
                
                // 2. Get the actual image CID from the JSON
                const imageCid = metadata.image; // e.g., "ipfs://Qm..."
                if (!imageCid) throw new Error("Image CID not found in metadata");

                // 3. Set the real image URL
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
    }, [metadataCid]); // Re-run if the CID changes

    if (hasError) {
        return (
            <img
                src="https://placehold.co/400x400/eee/aaa?text=Error"
                alt={alt}
                className="h-full w-full object-cover"
            />
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className="h-full w-full object-cover"
            // This onError is a fallback for the *final* image
            onError={(e) => (e.currentTarget.src = "https://placehold.co/400x400/eee/aaa?text=Error")}
        />
    );
}
// --- END NEW COMPONENT ---


export default function DashboardPage() {
    const { address, isConnected } = useAccount();

    // 1. Fetch the list of album IDs
    const { 
        data: albumIds, 
        error: errorIds, 
        isLoading: isLoadingIds 
    } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAlbumsByOwner',
        args: address ? [address] : undefined,
        query: {
            enabled: isConnected && !!address,
        }
    });

    // 2. Prepare the batch-call
    const albumContracts = useMemo(() => {
        // Guard against address being undefined
        if (!albumIds || (albumIds as any[]).length === 0 || !address) return [];
        
        return (albumIds as bigint[]).map(id => ({
            address: CONTRACT_ADDRESS as `0x${string}`,
            abi: CONTRACT_ABI,
            functionName: 'getAlbum',
            args: [id, address], // <-- PASS THE USER'S ADDRESS HERE
        }));
    }, [albumIds, address]); // <-- ADD `address` TO THE DEPENDENCY ARRAY

    // 3. Fetch all album details
    const { 
        data: albumsDataRaw, 
        error: errorAlbums, 
        isLoading: isLoadingAlbums 
    } = useReadContracts({
        contracts: albumContracts,
        query: {
            enabled: albumContracts.length > 0,
        }
    });

    // 4. Combine loading and error states
    const isLoading = isLoadingIds || isLoadingAlbums;
    const error = errorIds || errorAlbums;

    // 5. Format the successfully fetched album data
    const albums = useMemo((): AlbumData[] => {
        if (!albumsDataRaw) return [];
        
        return albumsDataRaw
            .filter(item => item.status === 'success' && item.result)
            .map(item => {
                const album = item.result as any;
                return {
                    id: Number(album.id),
                    title: album.title,
                    coverImageCid: album.coverImageCid,
                    photoCids: album.photoCids,
                    isPublic: album.isPublic,
                };
            });
    }, [albumsDataRaw]);

    console.log(albums) // This will still show the metadata CID, which is correct

    const renderContent = () => {
        // State 1: User is not connected
        if (!isConnected) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <IconWallet className="h-12 w-12 text-gray-400" />
                    <h2 className="mt-6 text-xl font-semibold text-gray-800">Connect Your Wallet</h2>
                    <p className="mt-2 text-gray-500 mb-6">Please connect your wallet using the button in the navbar to view your albums.</p>
                </div>
            );
        }

        // State 2: Loading data
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-10">
                    <IconLoader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg text-gray-700">Loading Your Albums...</p>
                </div>
            );
        }

        // State 3: Error fetching data
        if (error) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-10 bg-red-50 border border-red-200 rounded-lg">
                    <IconAlertTriangle className="h-10 w-10 text-red-500" />
                    <h2 className="mt-4 text-xl font-semibold text-red-700">Error</h2>
                    <p className="mt-2 text-gray-600">{error.message}</p>
                </div>
            );
        }

        // State 4: Connected, but no albums
        if (albums.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center text-center p-12 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                    <IconPhoto className="h-12 w-12 text-gray-400" />
                    <h2 className="mt-6 text-xl font-semibold text-gray-800">No albums found</h2>
                    <p className="mt-2 text-gray-500">Get started by creating your first album.</p>
                </div>
            );
        }

        // State 5: Success, show albums
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {albums.map((album) => (
                    <Link href={`/album/${album.id}`} key={album.id}>
                        <div className="block bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-lg group cursor-pointer">
                            <div className="relative aspect-square w-full bg-gray-100">
                                
                                {/* --- THIS IS THE FIX --- */}
                                <AlbumCoverImage 
                                    metadataCid={album.coverImageCid} 
                                    alt={album.title} 
                                />
                                {/* --- END FIX --- */}

                                <div className="absolute top-2 right-2">
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
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600">
                                    {album.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {album.photoCids.length} photo{album.photoCids.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-4xl font-bold text-gray-900">
                        My Albums
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link href="/addalbum">
                            <div className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md font-semibold transition-colors hover:bg-blue-700 cursor-pointer">
                                <IconPlus size={20} />
                                Create Album
                            </div>
                        </Link>
                        
                    </div>
                </div>
                
                {renderContent()}
            </div>
        </div>
    );
}

