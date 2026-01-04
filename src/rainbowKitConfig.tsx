"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, zksync, mainnet } from "viem/chains"

export default getDefaultConfig({
    appName: "TSender",
    chains: [anvil, zksync, mainnet], 
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    ssr: false,
})