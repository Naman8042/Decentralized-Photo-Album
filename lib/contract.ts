// lib/contract.ts
import contractABI from "./contractabi.json";

import type { Abi ,Address } from "viem";


export const CONTRACT_ADDRESS:Address = "0x56E972d8164eddde1506652102Da3D56fd70A9D7"; 
export const CONTRACT_ABI: Abi = contractABI as Abi;
