"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia} from "wagmi/chains";
import { injected } from "wagmi/connectors/injected";
import { 
  http, 
  createConfig, 
  WagmiProvider, 
} from "wagmi";
import { ReactNode } from "react";

const queryClient = new QueryClient();

// This is the local Hardhat node
const hardhatChain = {
  id: 31337,
  name: "Hardhat Local",
  network: "hardhat",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] }, // Added public for consistency
  },
};


const config = createConfig({
  chains: [hardhatChain, mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [hardhatChain.id]: http("http://127.0.0.1:8545"),
    [mainnet.id]: http(),
    // Your specific Infura transport for Sepolia
    [sepolia.id]: http("https://sepolia.infura.io/v3/8452acd106ae43bcbc679a69da1d24bd"),
  },
});



export default function CryptoProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
    
  );
}
