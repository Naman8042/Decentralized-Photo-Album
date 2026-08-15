"use client";

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { IconAlertTriangle, IconLoader2, IconLock, IconPhoto } from '@tabler/icons-react';
import { useParams, useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router

// --- TODO: Update these ---
// 1. Add your contract's ABI (Application Binary Interface)
const CONTRACT_ABI: any[] = [
    // Paste your FULL ABI array here. This is an example.
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "albumId", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
        { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
        { "indexed": false, "internalType": "uint256", "name": "photoCount", "type": "uint256" }
      ],
      "name": "AlbumCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "albumId", "type": "uint256" },
        { "indexed": false, "internalType": "bool", "name": "isPublic", "type": "bool" }
      ],
      "name": "AlbumPrivacyChanged",
      "type": "event"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "_title", "type": "string" },
        { "internalType": "string", "name": "_coverImageCid", "type": "string" },
        { "internalType": "string[]", "name": "_photoCids", "type": "string[]" },
        { "internalType": "bool", "name": "_isPublic", "type": "bool" }
      ],
      "name": "createAlbum",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [ { "internalType": "uint256", "name": "_id", "type": "uint256" } ],
      "name": "getAlbum",
      "outputs": [
        {
          "components": [
            { "internalType": "uint256", "name": "id", "type": "uint256" },
            { "internalType": "string", "name": "title", "type": "string" },
            { "internalType": "string", "name": "coverImageCid", "type": "string" },
            { "internalType": "string[]", "name": "photoCids", "type": "string[]" },
            { "internalType": "address", "name": "owner", "type": "address" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
            { "internalType": "bool", "name": "isPublic", "type": "bool" }
          ],
          "internalType": "struct DecentralizedPhotoAlbum.Album",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [ { "internalType": "address", "name": "_owner", "type": "address" } ],
      "name": "getAlbumsByOwner",
      "outputs": [ { "internalType": "uint256[]", "name": "", "type": "uint256[]" } ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_albumId", "type": "uint256" },
        { "internalType": "bool", "name": "_isPublic", "type": "bool" }
      ],
      "name": "setAlbumPrivacy",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
    // ... (and any other functions like 'albums', 'userAlbums', etc.)
]; 
// 2. Add your contract's deployed address
const CONTRACT_ADDRESS = "0x...YourContractAddressHere"; 
// -------------------------

// Helper function to convert IPFS CID to a public gateway URL
function ipfsToGatewayUrl(ipfsCid: string): string {
    if (!ipfsCid || !ipfsCid.startsWith('ipfs://')) {
        return "";
    }
    // Use a public gateway. You can replace this with your own gateway.
    return `https://ipfs.io/ipfs/${ipfsCid.substring(7)}`;
}

// Define the structure of the album data we'll store in state
interface AlbumData {
    id: number;
    title: string;
    coverImageCid: string;
    photoCids: string[];
    owner: string;
    timestamp: number;
    isPublic: boolean;
}

export default function ViewAlbumPage({ params }: { params: { id: string } }) {
    const { id } = params; // Get the album ID from the URL
    const [album, setAlbum] = useState<AlbumData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchAlbum = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 1. Connect to MetaMask
                if (typeof window.ethereum === 'undefined') {
                    throw new Error("MetaMask is not installed.");
                }
                const provider = new ethers.providers.Web3Provider(window.ethereum as any);
                await provider.send("eth_requestAccounts", []);
                const signer = provider.getSigner();

                // 2. Create contract instance
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

                // 3. Call the getAlbum function
                const albumData = await contract.getAlbum(id);

                // 4. Format and set the data in state
                const formattedAlbum: AlbumData = {
                    id: albumData.id.toNumber(),
                    title: albumData.title,
                    coverImageCid: albumData.coverImageCid,
                    photoCids: albumData.photoCids,
                    owner: albumData.owner,
                    timestamp: albumData.timestamp.toNumber(),
                    isPublic: albumData.isPublic,
                };
                setAlbum(formattedAlbum);

            } catch (err) {
                console.error("Failed to fetch album:", err);
                const errorMessage = (err as Error).message;
                
                if (errorMessage.includes("Access denied")) {
                    setError("This album is private and you are not the owner.");
                } else if (errorMessage.includes("Album does not exist")) {
                    setError("This album does not exist.");
                } else {
                    setError("Failed to load album. See console for details.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlbum();
    }, [id]); // Re-run this effect if the ID changes

    // Loading State
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col p-4 bg-gray-50">
                <IconLoader2 className="h-12 w-12 animate-spin text-blue-600" />
                <p className="mt-4 text-lg text-gray-700">Loading Album...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen flex-col p-4 bg-gray-50">
                <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border border-red-200 text-center">
                    <IconAlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold text-gray-900 mt-4">Error</h1>
                    <p className="mt-2 text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    // Success State
    if (album) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Cover Image Header */}
                <div className="relative h-72 w-full bg-gray-200">
                    <img 
                        src={ipfsToGatewayUrl(album.coverImageCid)} 
                        alt={`${album.title} cover`} 
                        className="h-full w-full object-cover"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {/* Title */}
                    <div className="absolute bottom-6 left-6 md:left-10 text-white">
                        {!album.isPublic && (
                            <div className="flex items-center gap-2 bg-yellow-500/80 text-black px-3 py-1 rounded-full text-sm font-medium mb-2 w-fit">
                                <IconLock className="h-4 w-4" />
                                <span>Private</span>
                            </div>
                        )}
                        <h1 className="text-4xl md:text-5xl font-bold">{album.title}</h1>
                        <p className="text-sm mt-2 opacity-90 truncate max-w-lg">
                            Owned by: {album.owner}
                        </p>
                    </div>
                </div>

                {/* Photo Grid */}
                <div className="container mx-auto max-w-7xl p-6 md:p-10">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Photos ({album.photoCids.length})
                    </h2>
                    {album.photoCids.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {album.photoCids.map((cid, index) => (
                                <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                                    <img 
                                        src={ipfsToGatewayUrl(cid)} 
                                        alt={`Album photo ${index + 1}`} 
                                        className="h-full w-full object-cover"
                                        loading="lazy"
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
            </div>
        );
    }

    // Default return (shouldn't be reached)
    return null;
}

