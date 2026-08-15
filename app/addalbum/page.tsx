"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload"; // Assuming this exists from your setup
import { 
    IconLoader2, 
    IconX, 
    IconCheck, 
    IconAlertTriangle,
    IconWorld, 
    IconLock,
    IconPhoto,
    IconTrash
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { 
    useWriteContract, 
    useWaitForTransactionReceipt,
    useAccount
} from 'wagmi';
import { useRouter } from 'next/navigation';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract';

type LoadingStep = "idle" | "waitingForWallet" | "writingToChain" | "success" | "error";

export default function Album() {
    const router = useRouter();
    const { isConnected } = useAccount();

    // Form State
    const [albumName, setAlbumName] = useState("");
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [files, setFiles] = useState<{ file: File; metadataUrl: string }[]>([]);

    // Wagmi Hooks
    const { data: hash, error: writeError, writeContractAsync } = useWriteContract();
    const { isSuccess: isConfirmed, error: receiptError } = 
        useWaitForTransactionReceipt({ hash });
    
    // UI State
    const [loadingStep, setLoadingStep] = useState<LoadingStep>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleFileUpload = (uploadedData: { file: File; metadataUrl: string }[]) => {
        setFiles((prevFiles) => [...prevFiles, ...uploadedData]);
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };

    const handleCreateAlbum = async () => {
        if (!isConnected) {
            setErrorMessage("Please connect your wallet to create an album.");
            setLoadingStep("error");
            return;
        }

        if (!albumName.trim() || files.length === 0) {
            setErrorMessage("Please provide an album name and at least one photo.");
            setLoadingStep("error");
            return;
        }

        setLoadingStep("waitingForWallet");
        setErrorMessage("");

        try {
            const coverImageCid = files[0].metadataUrl;
            const photoCids = files.map(f => f.metadataUrl);

            await writeContractAsync({
                address: CONTRACT_ADDRESS as `0x${string}`,
                abi: CONTRACT_ABI,
                functionName: 'createAlbum',
                args: [albumName, coverImageCid, photoCids, isPublic],
            });
            
            setLoadingStep("writingToChain");

        } catch (error) {
            const err = error as Error;
            console.error(err);
            const shortMessage = err.message ? err.message.split('(')[0] : "An unknown error occurred.";
            setErrorMessage(shortMessage || "An unknown error occurred.");
            setLoadingStep("error");
        }
    };

    useEffect(() => {
        if (isConfirmed) {
            setLoadingStep("success");
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }
        if (writeError || receiptError) {
            const error = writeError || receiptError;
            const shortMessage = error?.message ? error.message.split('(')[0] : "Transaction failed.";
            setErrorMessage(shortMessage);
            setLoadingStep("error");
        }
    }, [isConfirmed, writeError, receiptError, router]);

    const isLoading = ["waitingForWallet", "writingToChain"].includes(loadingStep);
    const isReadyToCreate = albumName.trim().length > 0 && files.length > 0 && !isLoading;

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 pt-24 pb-12 font-sans relative overflow-hidden">
             
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create New Album</h1>
                    <p className="text-gray-500 mt-2">Mint your memories on the blockchain forever.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: Metadata Form */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
                            
                            {/* Album Name */}
                            <div className="mb-6">
                                <label htmlFor="albumName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Album Name
                                </label>
                                <input
                                    id="albumName"
                                    type="text"
                                    placeholder="e.g. Summer Vacation 2024"
                                    className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 font-medium"
                                    value={albumName}
                                    onChange={(e) => setAlbumName(e.target.value)}
                                />
                            </div>

                            {/* Privacy Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Visibility
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setIsPublic(true)}
                                        className={cn(
                                            "relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col gap-2",
                                            isPublic 
                                                ? "border-indigo-600 bg-indigo-50/50" 
                                                : "border-gray-100 bg-gray-50 hover:border-gray-300"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-lg w-fit", isPublic ? "bg-indigo-600 text-white" : "bg-white text-gray-500")}>
                                            <IconWorld size={20} />
                                        </div>
                                        <div>
                                            <span className={cn("block font-bold text-sm", isPublic ? "text-indigo-900" : "text-gray-600")}>Public</span>
                                            <span className="text-xs text-gray-500">Visible to everyone on IPFS</span>
                                        </div>
                                        {isPublic && <div className="absolute top-3 right-3 text-indigo-600"><IconCheck size={18} /></div>}
                                    </button>

                                    <button
                                        onClick={() => setIsPublic(false)}
                                        className={cn(
                                            "relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col gap-2",
                                            !isPublic 
                                                ? "border-gray-800 bg-gray-100" 
                                                : "border-gray-100 bg-gray-50 hover:border-gray-300"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-lg w-fit", !isPublic ? "bg-gray-800 text-white" : "bg-white text-gray-500")}>
                                            <IconLock size={20} />
                                        </div>
                                        <div>
                                            <span className={cn("block font-bold text-sm", !isPublic ? "text-gray-900" : "text-gray-600")}>Private</span>
                                            <span className="text-xs text-gray-500">Encrypted via Lit Protocol</span>
                                        </div>
                                        {!isPublic && <div className="absolute top-3 right-3 text-gray-800"><IconCheck size={18} /></div>}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                onClick={handleCreateAlbum}
                                disabled={!isReadyToCreate || isLoading}
                                className={cn(
                                    "w-full py-4 px-6 text-white text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3",
                                    loadingStep === "success" 
                                        ? "bg-green-500 hover:bg-green-600" 
                                        : "bg-indigo-600 hover:bg-indigo-700",
                                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <IconLoader2 className="animate-spin" size={20} />
                                        {loadingStep === "waitingForWallet" ? "Confirm in Wallet..." : "Minting..."}
                                    </>
                                ) : loadingStep === "success" ? (
                                    <>
                                        <IconCheck size={20} />
                                        Created!
                                    </>
                                ) : (
                                    <>
                                        Create Album
                                    </>
                                )}
                            </button>

                            {/* Error Message */}
                            {loadingStep === "error" && (
                                <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-start gap-3 text-sm animate-in fade-in slide-in-from-top-2">
                                    <IconAlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
                                    <div className="flex-1">
                                        <span className="font-semibold block">Error</span>
                                        {errorMessage}
                                    </div>
                                    <button onClick={() => { setLoadingStep("idle"); setErrorMessage(""); }} className="text-red-400 hover:text-red-600">
                                        <IconX size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Helper Box */}
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                            <h4 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
                                <IconLoader2 size={14} className="animate-spin-slow" /> Note
                            </h4>
                            <p className="text-xs text-blue-700/80 leading-relaxed">
                                Creating an album requires a small transaction fee (gas) on the network. 
                                Once minted, your album cannot be deleted, ensuring permanent preservation.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Upload & Preview */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 min-h-[500px] flex flex-col">
                            
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between">
                                    <span>Upload Photos</span>
                                    <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Supported: JPG, PNG, WEBP</span>
                                </h3>
                                {/* Your existing FileUpload component */}
                                <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-indigo-50/30 hover:border-indigo-300 transition-colors">
                                    <FileUpload onChange={handleFileUpload} />
                                </div>
                            </div>

                            {/* Preview Section */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-700">
                                        Preview Gallery
                                        {files.length > 0 && <span className="ml-2 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs">{files.length}</span>}
                                    </h3>
                                </div>
                                
                                {files.length === 0 ? (
                                    <div className="h-40 flex flex-col items-center justify-center text-gray-400 border border-gray-100 rounded-xl bg-gray-50">
                                        <IconPhoto size={32} className="mb-2 opacity-50" />
                                        <p className="text-sm">No photos added yet</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {files.map((item, index) => {
                                            const previewUrl = URL.createObjectURL(item.file);
                                            return (
                                                <div 
                                                    key={index} 
                                                    className={cn(
                                                        "group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm transition-all hover:shadow-md",
                                                        index === 0 && "ring-2 ring-indigo-500 ring-offset-2" // Highlight cover image
                                                    )}
                                                >
                                                    <img
                                                        src={previewUrl}
                                                        alt="preview"
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        onLoad={() => URL.revokeObjectURL(previewUrl)}
                                                    />
                                                    
                                                    {/* Cover Badge */}
                                                    {index === 0 && (
                                                        <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                                                            COVER
                                                        </div>
                                                    )}

                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button 
                                                            onClick={() => handleRemoveFile(index)}
                                                            className="p-2 bg-white/10 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors"
                                                            title="Remove photo"
                                                        >
                                                            <IconTrash size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}