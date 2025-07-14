# Equity Token Dashboard

A simple web interface to manage your equity tokens on the blockchain. Connect your wallet and start managing tokens in minutes.

## What You'll Need

- [Node.js](https://nodejs.org/) (v14 or newer)
- [MetaMask](https://metamask.io/) (browser extension)
- A local blockchain (like Hardhat or Ganache) or testnet access

## Getting Started

1. **Clone and enter the project**
   ```bash
   git clone <repository-url>
   cd Deadline/frontend
   ```

2. **Install the requirements**
   ```bash
   npm install
   ```

3. **Set up your config**
   Open `app.js` and update these settings:
   ```javascript
   const CONFIG = {
       EQUITY_TOKEN_ADDRESS: 'YOUR_CONTRACT_ADDRESS',
       NETWORK_ID: 31337,  // 1337 for Ganache, 1 for Mainnet
       RPC_URL: 'http://127.0.0.1:8545'  // Your node's RPC URL
   };
   ```

4. **Start the app**
   ```bash
   npm start
   ```
   Then open http://localhost:8080 in your browser.

## What You Can Do

- Connect your wallet (MetaMask)
- View token details and your balance
- Transfer tokens to others
- Mint new tokens (if you're the owner)
- Burn tokens you own

## Deploying Contracts

If you need to deploy the smart contracts:

```bash
cd /path/to/hardhat-project
npx hardhat run scripts/deploy.js --network localhost
```

Then update the contract addresses in `app.js`.

## Dependencies

- web3.js - For blockchain interaction
- http-server - Local development server

## Need Help?

If you run into issues:
1. Make sure MetaMask is connected to the right network
2. Check that your contract addresses are correct
3. Look at the browser console for error messages

## License

MIT
       // ... rest of the config
   };
   ```

### 3. Configure MetaMask

1. Open MetaMask and connect to your local Ganache network:
   - Click on the network dropdown
   - Select "Custom RPC"
   - Enter the following details:
     - Network Name: Ganache
     - RPC URL: http://127.0.0.1:7545 (or your Ganache RPC URL)
     - Chain ID: 1337 (or your Ganache chain ID)
     - Currency Symbol: ETH

2. Import an account from Ganache:
   - In Ganache, click on the key icon next to an account to view its private key
   - In MetaMask, click on the account icon → Import Account
   - Paste the private key and click "Import"

### 4. Run the Frontend

1. Start a local web server from the frontend directory:
   ```bash
   cd /path/to/frontend
   http-server -p 8080
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Features

- **Connect Wallet**: Connect your MetaMask wallet to the dApp
- **View Balance**: Check your token balance
- **Mint Tokens** (Owner only): Create new tokens (only available to the contract owner)
- **Burn Tokens**: Destroy your tokens (reduces total supply)

## Troubleshooting

1. **MetaMask not detected**:
   - Make sure MetaMask is installed and unlocked
   - Try refreshing the page
   - Check if you have any ad blockers that might be interfering

2. **Transaction failures**:
   - Make sure you have enough ETH for gas fees
   - Check the browser console for detailed error messages
   - Ensure you're on the correct network (Ganache)

3. **Contract not found**:
   - Verify the contract address in `app.js` matches your deployed contract
   - Make sure the contract was deployed successfully to the network

## Security Notes

- Never share your private keys or seed phrase
- This is a development setup - do not use real funds
- Always audit smart contracts before deploying to mainnet

## License

MIT
