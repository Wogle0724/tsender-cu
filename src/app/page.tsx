"use client"

import HomeContent from "../components/HomeContent";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  return (
    <div>
      {isConnected ? (
        <HomeContent/>
      ) :
        <div className = "flex justify-center items-center mt-8 text-2xl font-semibold text-red-500">
          Please Connect Wallet
        </div>
      }
    </div>      
  );
}
