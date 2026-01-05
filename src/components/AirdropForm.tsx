"use client";

import InputField from './ui/InputField';
import { useState, useMemo, useEffect } from 'react';
import { chainsToTSender, tsenderAbi, erc20Abi } from '../constants';
import { useChainId, useConfig, useAccount, useWriteContract, useReadContracts } from 'wagmi';
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { format } from 'path';
import { calculateTotal } from "@/src/util";

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipients, setRecipients] = useState('');
    const [amounts, setAmounts] = useState('');
    const chainID = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
    const {data: hash, isPending, writeContractAsync } = useWriteContract()
    const recipientsList = useMemo(() => recipients.split(/(?:\r?\n|,)+/).map(addr => addr.trim()).filter(addr => addr !== ''), [recipients]);
    const amountsList = useMemo(() => amounts.split(/(?:\r?\n|,)+/).map(amount => BigInt(amount.trim())).filter(amount => amount > 0), [amounts]);
    const [error, setError] = useState<string | null>(null);
    const { data: tokenData } = useReadContracts({
        contracts: [
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: 'decimals',
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: 'name',
            },
            {
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: 'balanceOf',
                args: [account.address as `0x${string}`],
            }
        ]
        
    });

    useEffect(() => {
        try {
            const savedToken = localStorage.getItem('ts:tokenAddress');
            const savedRecipients = localStorage.getItem('ts:recipients');
            const savedAmounts = localStorage.getItem('ts:amounts');
            if (savedToken) setTokenAddress(savedToken);
            if (savedRecipients) setRecipients(savedRecipients);
            if (savedAmounts) setAmounts(savedAmounts);
        } catch (e) {
            // ignore
        }
    }, []);

    useEffect(() => {
        try { localStorage.setItem('ts:tokenAddress', tokenAddress); } catch (e) {}
    }, [tokenAddress]);

    useEffect(() => {
        try { localStorage.setItem('ts:recipients', recipients); } catch (e) {}
    }, [recipients]);

    useEffect(() => {
        try { localStorage.setItem('ts:amounts', amounts); } catch (e) {}
    }, [amounts]);

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
        const approvedAmount = await getApprovedAmount(tSenderAddress);
        try{
            setError(null);
            console.log("Approved Amount: " + approvedAmount);
            if (approvedAmount < total) {
                const approvalHash = await writeContractAsync({
                    abi: erc20Abi,
                    address: tokenAddress as `0x${string}`,
                    functionName: 'approve',
                    args: [tSenderAddress as `0x${string}`, BigInt(total)],
                })
                const approvalReceipt = await waitForTransactionReceipt(config, {
                    hash: approvalHash
                })
                console.log("Approval Mined: ", approvalReceipt);

                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: 'airdropERC20',
                    args: [
                        tokenAddress as `0x${string}`,
                        recipientsList,
                        amountsList,
                        BigInt(total),
                    ]
                })
                console.log(`Sent ${recipientsList.length} recipients a total of ${total} tokens.`);

            } else {
                await writeContractAsync({
                    abi: tsenderAbi,
                    address: tSenderAddress as `0x${string}`,
                    functionName: 'airdropERC20',
                    args: [
                        tokenAddress as `0x${string}`,
                        recipientsList,
                        amountsList,
                        BigInt(total),
                    ]
                })
                console.log(`Sent ${recipientsList.length} recipients a total of ${total} tokens.`);
            }
        } catch (e: any) {
            console.error("Error during transaction: ", e);
                const firstLine = e.message.split('\n')[0].trim();
                setError(firstLine || 'An unknown error occurred.');
        }
    }
    return (
        <div className="max-w-3xl mx-auto mt-6 bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-black">Airdrop Tokens</h2>
            </div>

            <InputField 
                label="Token Address" 
                placeholder="0x..." 
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
            />
            <div className="mt-4">
                <InputField 
                    label="Recipient Addresses" 
                    placeholder={"0x...\n0x...\n0x..."}
                    value={recipients}
                    large
                    onChange={(e) => setRecipients(e.target.value)}
                />
            </div>
            <div className="mt-4">
                <InputField 
                    label="Amounts (Wei)" 
                    placeholder={"100\n200\n300"}
                    value={amounts}
                    large
                    onChange={(e) => setAmounts(e.target.value)}
                />
            </div>
            <div className="mt-4 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">
                    Transaction Details:
                </label>
                <div className="py-2 text-gray-700 border border-gray-300 rounded-lg p-6">
                    <div className="space-y-2 text-sm my-2">
                        <div className="text-base text-gray-900 pb-1">
                            Token: <span className="font-mono">{tokenData?.[1]?.result as string || 'Unknown'}</span>
                        </div>
                        {recipientsList.map((addr, i) => (
                            <div key={i} className="flex items-center justify-between gap-2 p-2 bg-gray-100 rounded">
                                <span className="font-mono">{addr}</span>
                                <div className="text-right">
                                    <div className="text-xs text-gray-600">
                                        {amountsList[i]?.toString() ? (
                                            parseFloat(amountsList[i].toString()) > 1e6 
                                                ? parseFloat(amountsList[i].toString()).toExponential(2) 
                                                : amountsList[i].toString()
                                        ) : '0'} wei
                                    </div>
                                    <div>{
                                        tokenData?.[0]?.result !== undefined
                                            ? (Number(amountsList[i] ?? 0) / Math.pow(10, Number(tokenData[0]?.result))).toString()
                                            : (amountsList[i]?.toString() || '0')
                                    } tokens</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="mt-6 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-black font-semibold py-2 rounded-lg transition duration-200 ease-in-out active:scale-95 px-10">
                    {isPending ? (
                        <div className="flex items-center">
                            <div className="animate-spin h-5 w-5 border-4 border-t-transparent border-yellow-600 rounded-full mr-2"></div>
                            Pending...
                        </div>
                    ) : (
                        'Submit Airdrop'
                    )}
                </button>
            </div>

            <div id="status" className="text-center mt-2">
                {error && !isPending && (
                    <p className="text-red-600">Error: {error}</p>
                )}
                {hash && !isPending && !error &&(
                    <p className="text-green-600">Transaction Completed</p>
                )}
            </div>
        </div>
    );
}