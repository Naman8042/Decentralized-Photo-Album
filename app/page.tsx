import React from 'react';
import { 
  ShieldCheck, 
  UploadCloud, 
  Layers, 
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Fingerprint,
  Lock
} from 'lucide-react';

export default function PixelVaultLanding() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* BACKGROUND PATTERN */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* Soft Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] opacity-50" />
      </div>

      <main className="relative z-10 pt-24 pb-20">
        
        {/* HERO SECTION */}
        <div className="container mx-auto max-w-7xl px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full  shadow-sm text-indigo-600 text-xs font-bold uppercase tracking-wide mb-8">
            <span className="relative flex h-2 w-2">
              {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span> */}
            </span>
            {/* V1.0 Public Beta */}
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900">
            The Vault for your
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x pb-2">
              Digital Legacy.
            </span>
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            Stop trusting centralized clouds with your memories. PixelVault combines 
            <span className="text-gray-900 font-semibold"> IPFS storage</span> with 
            <span className="text-gray-900 font-semibold"> Blockchain security </span> 
            to ensure your photos are truly yours. Forever.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/addalbum" className="group relative px-8 py-4 bg-gray-900 rounded-full text-white font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-gray-900/20">
              <span className="relative flex items-center gap-2">
                Launch App <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <a href="https://sepolia.etherscan.io/address/0x56e972d8164eddde1506652102da3d56fd70a9d7" className="px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm">
              View Smart Contract
            </a>
          </div>

          {/* DASHBOARD MOCKUP PLACEHOLDER */}
          
        </div>

        {/* BENTO GRID FEATURES */}
        <div className="container mx-auto max-w-7xl px-6 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Built for the <span className="text-indigo-600">Decentralized Web</span>
            </h2>
            <p className="mt-4 text-gray-600">Everything you need to secure your photos on-chain.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Large (Perma-Storage) */}
            <div className="md:col-span-2 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Perma-Storage</h3>
              <p className="text-gray-600 leading-relaxed">
                Uploaded photos are pinned to IPFS nodes globally. Unlike AWS or Google Drive, 
                no single entity can delete your data or shut down the server. Your memories are distributed and resilient.
              </p>
            </div>

            {/* Card 2: Wallet Auth */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Auth via Wallet</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                No emails. No passwords. Just connect your MetaMask or Rainbow wallet to instantly access your vault.
              </p>
            </div>

            {/* Card 3: Encryption */}
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">AES Encryption</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Optional client-side encryption ensures that even though data is public on IPFS, only you possess the key to view it.
              </p>
            </div>

            {/* Card 4: Large (Smart Ownership) */}
            <div className="md:col-span-2 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Smart Ownership</h3>
              <p className="text-gray-600 leading-relaxed">
                Every photo album is linked to a Smart Contract on the Polygon blockchain. 
                This creates a verifiable digital footprint. You can even transfer ownership of your entire legacy with a single transaction.
              </p>
            </div>
          </div>
        </div>

        {/* TECH STACK */}
        {/* <div className="mt-32 border-y border-gray-100 bg-white py-12">
            <div className="container mx-auto max-w-7xl px-6">
                <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">Powered by modern web3 stack</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Zap className="text-yellow-500 fill-yellow-500" /> Next.js 15</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Box className="text-indigo-500 fill-indigo-500" /> Solidity</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Globe className="text-green-500" /> IPFS / Pinata</div>
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><ShieldCheck className="text-purple-500 fill-purple-500" /> Wagmi</div>
                </div>
            </div>
        </div> */}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white pt-16 pb-8">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-indigo-600 p-1.5 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">PixelVault</span>
                </div>
                <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
                    Redefining digital storage for the Web3 era. <br/>Secure, decentralized, and permanent.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-indigo-100 hover:text-indigo-600 transition-colors text-gray-500"><Github className="h-5 w-5"/></a>
                    <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-sky-100 hover:text-sky-500 transition-colors text-gray-500"><Twitter className="h-5 w-5"/></a>
                    <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors text-gray-500"><Linkedin className="h-5 w-5"/></a>
                </div>
            </div>
            
            {/* <div>
                <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
                <ul className="space-y-4 text-gray-500 text-sm">
                    <li className="hover:text-indigo-600 cursor-pointer transition-colors">Encryption</li>
                    <li className="hover:text-indigo-600 cursor-pointer transition-colors">Pricing</li>
                    <li className="hover:text-indigo-600 cursor-pointer transition-colors">API Keys</li>
                </ul>
            </div> */}
            
            
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 PixelVault. Decentralized on Etherum.</p>
            {/* <p className="flex items-center gap-1">Made with <span className="text-red-500">♥</span> using Next.js & Tailwind</p> */}
          </div>
        </div>
      </footer>
    </div>
  );
}