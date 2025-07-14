const Web3 = require('web3');
const contractJson = require('../solidity_eto_master/build/contracts/EquityToken.json');

// Configuration
const CONFIG = {
    // Updated with the deployed EquityToken contract address
    CONTRACT_ADDRESS: '0x10c31169C24bf30457444e39685856b71CEFCa33',
    // Ganache RPC URL
    PROVIDER_URL: 'http://127.0.0.1:7545'
};

async function verifyContract() {
    try {
        // Initialize web3
        const web3 = new Web3(CONFIG.PROVIDER_URL);
        
        console.log('Connected to network:', await web3.eth.net.getNetworkType());
        console.log('Block number:', await web3.eth.getBlockNumber());
        
        // Get accounts
        const accounts = await web3.eth.getAccounts();
        console.log('Available accounts:', accounts);
        
        if (accounts.length === 0) {
            throw new Error('No accounts found. Make sure Ganache is running and accounts are available.');
        }
        
        // Get the contract ABI
        const contractABI = contractJson.abi;
        
        // Create contract instance
        const contract = new web3.eth.Contract(contractABI, CONFIG.CONTRACT_ADDRESS);
        
        console.log('\nContract instance created with address:', CONFIG.CONTRACT_ADDRESS);
        
        // Try to call some contract methods
        console.log('\nTesting contract methods:');
        
        // 1. Get contract name
        try {
            const name = await contract.methods.name().call();
            console.log('Contract name:', name);
        } catch (error) {
            console.error('Error calling name():', error.message);
        }
        
        // 2. Get symbol
        try {
            const symbol = await contract.methods.symbol().call();
            console.log('Contract symbol:', symbol);
        } catch (error) {
            console.error('Error calling symbol():', error.message);
        }
        
        // 3. Get decimals
        try {
            const decimals = await contract.methods.decimals().call();
            console.log('Decimals:', decimals);
        } catch (error) {
            console.error('Error calling decimals():', error.message);
        }
        
        // 4. Get total supply
        try {
            const totalSupply = await contract.methods.totalSupply().call();
            console.log('Total supply:', totalSupply);
        } catch (error) {
            console.error('Error calling totalSupply():', error.message);
        }
        
        // 5. Get balance of first account
        try {
            const balance = await contract.methods.balanceOf(accounts[0]).call();
            console.log(`Balance of ${accounts[0]}:`, balance);
        } catch (error) {
            console.error('Error calling balanceOf():', error.message);
        }
        
        console.log('\nVerification complete!');
        
        // Print the ABI for reference
        console.log('\nContract ABI (first 3 items):', JSON.stringify(contractABI.slice(0, 3), null, 2));
        
    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
}

// Run the verification
verifyContract();
