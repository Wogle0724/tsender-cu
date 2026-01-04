"use client";

import InputField from './ui/InputField';
import { useState } from 'react';

export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState('');
    const [recipients, setRecipients] = useState('');
    const [amounts, setAmounts] = useState('');

    async function handleSubmit() {
    // Handle form submission logic here
    console.log("Airdrop submitted\nRecipients:\n" + recipients+ "\nAmounts:\n" + amounts+ "\nToken Address:\n" + tokenAddress);  
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
            <button onClick = {handleSubmit}>Submit Airdrop</button>
        </div>
    );
}