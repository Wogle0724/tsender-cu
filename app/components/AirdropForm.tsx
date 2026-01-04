"use client";

import InputField from './ui/InputField';
import { useState } from 'react';
import { chainsToTSender, tsenderAbi, erc20Abi } from '../constants';
import { useChainId, useConfig, useAccount } from 'wagmi';
import { readContract } from '@wagmi/core'

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipients, setRecipients] = useState('');
    const [amounts, setAmounts] = useState('');
    const chainID = useChainId();
    const config = useConfig();
    const account = useAccount();

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress){
            alert("No address found, please use supported chain")
            return 0;
        }
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: 'allowance',
            args: [account.address, tSenderAddress as `0x${string}`],
        })
        // token.allowance(account, tsender)
        return response as number;
    }

    async function handleSubmit() {
        // 1.a if already approved, go to 2
        // 1.b approve t-sender contract to send tokens
        // 2. call airdrop function on t-sender contract
        // 3. wait for contract to be mined
        const tSenderAddress = chainsToTSender[chainID]["tsender"]
        console.log("Chain ID: " + chainID);
        console.log("TSender Address: " + tSenderAddress);
        console.log(recipients+ "\n\n" + amounts+ "\n\n" + tokenAddress);  
        const approvedAmount = await getApprovedAmount(tSenderAddress);
        console.log("Approved Amount: " + approvedAmount);
    }

    return (
        <div>
            <InputField 
                label="Token Address" 
                placeholder="0x..." 
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />
            <InputField 
                label="Recipient Addresses" 
                placeholder={"0x...\n0x...\n0x..."}
                value={recipients}
                large
                onChange={(e) => setRecipients(e.target.value)}
            />
            <InputField 
                label="Amounts" 
                placeholder={"100\n200\n300"}
                value={amounts}
                large
                onChange={(e) => setAmounts(e.target.value)}
            />
            <button 
                onClick={handleSubmit}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
>
                Submit Airdrop
            </button>
        </div>
    );
}