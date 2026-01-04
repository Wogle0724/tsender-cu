## What are we building??
1. Create a basic React/Next.js Static Application ✅
2. Connect our wallet with a nicer connect app ✅
3. Implement this fxn:
```javascript
function airdropERC20(
    address tokenAddress, //ERC20 Token
    address[] calldata recipients,
    uint256[] calldata amounts,
    uint256 totalAmount
)
```
4. Deploy to fleek


## ⚠️ Common Local Anvil Error: ERC20 `allowance` Returns `0x`

While testing the ERC20 airdrop locally, you may encounter a runtime error where the ERC20 `allowance` call returns no data (`"0x"`), even though the addresses appear correct.

### Symptoms
- `ContractFunctionExecutionError: allowance returned no data ("0x")`
- MetaMask shows the mock token with **0 decimals** and **0 balance**
- Console logs show expected values, for example:
  - Chain ID: `31337`
  - TSender address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
  - Connected account: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
  - Mock token address: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

### Root Cause
This issue occurs when **Anvil fails to load the provided `tsender-deployed.json` state file**, causing Anvil to start a fresh empty chain. On an empty chain:
- The mock ERC20 token address is **not a contract**
- ERC20 calls like `allowance()` and `decimals()` return no data
- MetaMask cannot read token metadata and defaults to incorrect values

This commonly happens due to a **Foundry/Anvil version mismatch**.

### Required Anvil Version
The `tsender-deployed.json` snapshot used in this project was generated with:

- **Anvil v1.0.0-stable**

Newer versions (e.g. `1.5.1-stable`) will fail to load this file with errors like:
```
missing field `index`
```

### How to Avoid This Issue
1. Install the correct Foundry/Anvil version:
   ```bash
   foundryup -i 1.0.0
   ```
2. Verify the version:
   ```bash
   anvil --version
   ```
3. Start Anvil with the provided state file:
   ```bash
   anvil --load-state tsender-deployed.json
   ```
4. Ensure MetaMask is connected to:
   - RPC: `http://127.0.0.1:8545`
   - Chain ID: `31337`

Once the state is loaded correctly, the mock token (`MT`) will show **18 decimals**, and ERC20 reads such as `allowance()` will return valid values (e.g. `0n` instead of `"0x"`).




