"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    useAccount, 
    useConnect, 
    useDisconnect 
} from 'wagmi';
import { 
    IconWallet, 
    IconShieldCheck, 
    IconMenu2, 
    IconX, 
    IconLogout,
    IconUser
} from '@tabler/icons-react';

export default function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const injectedConnector = connectors.find(c => c.id === 'injected');

    // Handle scroll effect for shadow/background density
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleConnect = () => {
        if (injectedConnector) connect({ connector: injectedConnector });
    };

    const truncateAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
    };

    // Helper for active link styling
    const NavLink = ({ href, children, mobile = false }: { href: string, children: React.ReactNode, mobile?: boolean }) => {
        const isActive = pathname === href;
        const baseClasses = "transition-all duration-200 font-medium rounded-lg px-4 py-2";
        
        const desktopClasses = isActive 
            ? "text-blue-600 bg-blue-50" 
            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50";

        const mobileClasses = "block text-base w-full " + (isActive 
            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 rounded-r-lg rounded-l-none" 
            : "text-gray-600 hover:bg-gray-50");

        return (
            <Link 
                href={href} 
                className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
                onClick={() => mobile && setIsMobileMenuOpen(false)}
            >
                {children}
            </Link>
        );
    };

    return (
        <nav 
            className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200/50
            ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white/70 backdrop-blur-sm'}`}
        >
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    
                    {/* Left: Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
                                <IconShieldCheck className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                PixelVault
                            </span>
                        </Link>
                    </div>
                    
                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {isConnected && (
                            <NavLink href="/dashboard">Dashboard</NavLink>
                        )}
                        <NavLink href="/album">Create Album</NavLink>
                    </div>

                    {/* Right: Wallet Actions & Mobile Toggle */}
                    <div className="flex items-center gap-4">
                        {/* Wallet Button */}
                        {isConnected && address ? (
                            <div className="hidden sm:flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-2 py-1 shadow-sm hover:shadow transition-shadow">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-inner">
                                    <IconUser size={18} />
                                </div>
                                <div className="flex flex-col px-2">
                                    <span className="text-xs text-gray-400 font-medium leading-none">Connected</span>
                                    <span className="text-sm font-bold text-gray-700 leading-none mt-1">{truncateAddress(address)}</span>
                                </div>
                                <button
                                    onClick={() => disconnect()}
                                    title="Disconnect"
                                    className="ml-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <IconLogout size={18} />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleConnect}
                                disabled={!injectedConnector}
                                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/25 text-sm font-bold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IconWallet size={18} />
                                <span>Connect Wallet</span>
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl absolute w-full shadow-xl animate-in slide-in-from-top-5 duration-200">
                    <div className="px-4 py-6 space-y-3">
                        {isConnected && (
                            <NavLink href="/dashboard" mobile>Dashboard</NavLink>
                        )}
                        <NavLink href="/album" mobile>Create Album</NavLink>
                        
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {isConnected && address ? (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white">
                                            <IconUser size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500">Wallet Connected</div>
                                            <div className="font-bold text-gray-700">{truncateAddress(address)}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => disconnect()}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <IconLogout size={20} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleConnect();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    disabled={!injectedConnector}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold active:scale-95 transition-transform"
                                >
                                    <IconWallet size={20} />
                                    Connect Wallet
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}