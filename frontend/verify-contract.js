const Web3 = require('web3');

// Configuration
const CONFIG = {
    // EquityToken contract address from deployment
    CONTRACT_ADDRESS: '0x10c31169C24bf30457444e39685856b71CEFCa33',
    // Ganache RPC URL
    PROVIDER_URL: 'http://127.0.0.1:7545',
    // Path to the compiled contract JSON
    CONTRACT_JSON: '../solidity_eto_master/build/contracts/EquityToken.json'
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
        
        // Load the contract JSON
        const contractJson = require(CONFIG.CONTRACT_JSON);
        const contractABI = contractJson.abi;
        
        console.log('\nContract ABI loaded successfully');
        console.log('ABI length:', contractABI.length);
        
        // Create contract instance
        const contract = new web3.eth.Contract(contractABI, CONFIG.CONTRACT_ADDRESS);
        
        console.log('\nContract instance created with address:', CONFIG.CONTRACT_ADDRESS);
        
        // Try to call some contract methods
        console.log('\nTesting contract methods:');
        
        // 1. Get contract code
        const code = await web3.eth.getCode(CONFIG.CONTRACT_ADDRESS);
        console.log('Contract code length:', code.length);
        
        if (code === '0x') {
            throw new Error('No code at the contract address. The contract may not be deployed.');
        }
        
        // 2. Get all events from the contract ABI
        const events = contractABI.filter(x => x.type === 'event');
        console.log('\nContract events:', events.map(e => e.name).join(', '));
        
        // 3. Get all functions from the contract ABI
        const functions = contractABI.filter(x => x.type === 'function');
        console.log('\nContract functions:');
        functions.forEach(fn => {
            const inputs = fn.inputs ? fn.inputs.map(i => `${i.type} ${i.name}`).join(', ') : '';
            const outputs = fn.outputs ? fn.outputs.map(o => o.type).join(', ') : 'void';
            console.log(`- ${fn.name}(${inputs}) => (${outputs})`);
        });
        
        // 4. Try to call some basic functions
        console.log('\nTesting function calls:');
        
        // Try to call name()
        try {
            const name = await contract.methods.name().call();
            console.log('Contract name:', name);
        } catch (error) {
            console.error('Error calling name():', error.message);
        }
        
        // Try to call symbol()
        try {
            const symbol = await contract.methods.symbol().call();
            console.log('Contract symbol:', symbol);
        } catch (error) {
            console.error('Error calling symbol():', error.message);
        }
        
        // Try to call totalSupply()
        try {
            const totalSupply = await contract.methods.totalSupply().call();
            console.log('Total supply:', totalSupply);
        } catch (error) {
            console.error('Error calling totalSupply():', error.message);
        }
        
        // Try to call balanceOf() for the first account
        try {
            const balance = await contract.methods.balanceOf(accounts[0]).call();
            console.log(`Balance of ${accounts[0]}:`, balance);
        } catch (error) {
            console.error('Error calling balanceOf():', error.message);
        }
        
        console.log('\nVerification complete!');
        
    } catch (error) {
        console.error('Error during verification:', error);
        process.exit(1);
    }
}

// Run the verification
verifyContract();
