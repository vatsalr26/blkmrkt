// App configuration
const CONFIG = {

    // Add this to your CONFIG object
    PRIVATE_KEY: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    TEST_ACCOUNT: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    
    // Contract addresses from deployment (update these with your deployed contract addresses)
    EQUITY_TOKEN_ADDRESS: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e',
    EQUITY_TOKEN_FACTORY_ADDRESS: '0x5C713EB1ed5283d501a44c3F109Cee74C387b75a',
    EQUITY_TOKEN_TRANSACTION_ADDRESS: '0x5F36cf358Ab9711f353951054B5737bb6123cb4b',
    
    // For backward compatibility
    CONTRACT_ADDRESS: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e', // Same as EQUITY_TOKEN_ADDRESS
    
    // Network configuration for Hardhat local node
    NETWORK_ID: 31337, // Default Hardhat network ID for local node
    NETWORK_NAME: 'Hardhat Local',
    RPC_URL: 'http://127.0.0.1:8545',
    GAS_LIMIT: 3000000, // Gas limit for transactions
    CONTRACT_ABI: [
        // Owner function
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{"name": "", "type": "address"}],
            "stateMutability": "view",
            "type": "function"
        },
        // Mint function
        {
            "inputs": [
                {"name": "to", "type": "address"},
                {"name": "amount", "type": "uint256"}
            ],
            "name": "mint",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // Burn function
        {
            "inputs": [
                {"name": "amount", "type": "uint256"}
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // BurnFrom function (for owner)
        {
            "inputs": [
                {"name": "account", "type": "address"},
                {"name": "amount", "type": "uint256"}
            ],
            "name": "burnFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // ERC20 Standard Functions
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {"name": "_owner", "type": "address"},
                {"name": "_spender", "type": "address"}
            ],
            "name": "allowance",
            "outputs": [{"name": "remaining", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {"name": "_spender", "type": "address"},
                {"name": "_value", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [{"name": "success", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {"name": "_to", "type": "address"},
                {"name": "_value", "type": "uint256"}
            ],
            "name": "transfer",
            "outputs": [{"name": "success", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {"name": "_from", "type": "address"},
                {"name": "_to", "type": "address"},
                {"name": "_value", "type": "uint256"}
            ],
            "name": "transferFrom",
            "outputs": [{"name": "success", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        // ERC20 Optional Functions
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [{"name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [{"name": "", "type": "string"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [{"name": "", "type": "uint8"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [{"name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "granularity",
            "outputs": [{"name": "", "type": "uint256"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {"name": "_operator", "type": "address"},
                {"name": "_tokenHolder", "type": "address"}
            ],
            "name": "isOperatorFor",
            "outputs": [{"name": "", "type": "bool"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [{"name": "", "type": "address"}],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

// Global variables
let web3;
let accounts = [];
let contract;
let isOwner = false;

// DOM Elements
const connectButton = document.getElementById('connectButton');
const connectionStatus = document.getElementById('connectionStatus');
const accountAddress = document.getElementById('accountAddress');
const networkName = document.getElementById('networkName');
const getBalanceBtn = document.getElementById('getBalanceBtn');
const tokenBalance = document.getElementById('tokenBalance');
const tokenSymbol = document.getElementById('tokenSymbol');
const ownerControls = document.getElementById('ownerControls');
const mintBtn = document.getElementById('mintBtn');
const burnBtn = document.getElementById('burnBtn');
const mintAmount = document.getElementById('mintAmount');
const burnAmount = document.getElementById('burnAmount');
const txStatus = document.getElementById('txStatus');

// Web3 instance will be available globally
// Initialize Web3
async function initWeb3() {
    console.log('Initializing Web3 with local Hardhat node...');
    
    try {
        // Use the local Hardhat node
        const provider = new Web3.providers.HttpProvider(CONFIG.RPC_URL);
        web3 = new Web3(provider);
        window.web3 = web3;
        
        // Set the test account as the default
        currentAccount = CONFIG.TEST_ACCOUNT;
        console.log('Using test account:', currentAccount);
        
        // Add the private key to the wallet
        const account = web3.eth.accounts.privateKeyToAccount(CONFIG.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);
        web3.eth.defaultAccount = account.address;
        
        // Update UI to show connected account
        const accountElement = document.getElementById('connected-account');
        if (accountElement) {
            accountElement.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
        }
        
        return web3;
    } catch (error) {
        console.error('Error initializing Web3:', error);
        throw new Error('Failed to connect to local Hardhat node. Make sure it\'s running at ' + CONFIG.RPC_URL);
    }
}

// Initialize application
async function init() {
    console.log('=== Application Initialization Started ===');
    try {
        // Initialize Web3
        web3 = await initWeb3();
        
        // Get network ID
        const networkId = await web3.eth.net.getId();
        console.log('Connected to network ID:', networkId);
        
        // Verify network
        if (parseInt(networkId) !== parseInt(CONFIG.NETWORK_ID)) {
            throw new Error(`Incorrect network. Please connect to network ID: ${CONFIG.NETWORK_ID} (${CONFIG.NETWORK_NAME})`);
        }
        
        console.log('Initializing application...');
        await initApp();
    } catch (error) {
        console.error('Error during initialization:', error);
        showError(error.message || 'Failed to initialize application. See console for details.');
    } finally {
        console.log('=== Application Initialization Completed ===');
    }
}

// Initialize application
async function initApp() {
    try {
        // Ensure web3 is initialized
        if (!web3) {
            web3 = window.web3;
            if (!web3) {
                throw new Error('Web3 is not initialized. Please try refreshing the page.');
            }
        }
        
        console.log('Initializing application with web3:', web3);
        
        // Get the current network ID
        const networkId = await web3.eth.net.getId();
        console.log('Current network ID:', networkId);
        
        // Convert both to string for comparison to avoid type issues
        if (String(networkId) !== String(CONFIG.NETWORK_ID)) {
            throw new Error(`Please connect to ${CONFIG.NETWORK_NAME} (Network ID: ${CONFIG.NETWORK_ID}). Current network ID: ${networkId}`);
        }
        
        // Use the test account from config
        currentAccount = CONFIG.TEST_ACCOUNT;
        console.log('Using account:', currentAccount);
        
        // Update UI to show connected account
        const accountElement = document.getElementById('connected-account');
        if (accountElement) {
            accountElement.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
        }
        
        // Update connection status
        const statusElement = document.getElementById('connection-status');
        if (statusElement) {
            statusElement.textContent = 'Connected to Local Node';
            statusElement.className = 'badge bg-success';
        }
        
        // Initialize contracts
        await initContracts();
        
        // Setup event listeners
        setupEventListeners();
        
        // Update UI
        await updateUI();
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError(error.message || 'Error initializing application. See console for details.');
    }
}

// Connect wallet
async function connectWallet() {
    console.log('connectWallet called');
    try {
        // Ensure MetaMask is available
        if (!window.ethereum) {
            const errorMsg = 'MetaMask not detected. Please install MetaMask to connect your wallet.';
            console.error(errorMsg);
            showError(errorMsg);
            return false;
        }
        
        console.log('MetaMask detected, requesting accounts...');
        
        try {
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts received:', accounts);
            
            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found. Please unlock your wallet.');
            }
            
            // Update global web3 instance
            if (!web3) {
                web3 = new Web3(window.ethereum);
                window.web3 = web3;
            }
            
            currentAccount = accounts[0];
            console.log('Connected account:', currentAccount);
            
            // Update UI
            const accountElement = document.getElementById('connected-account');
            const statusElement = document.getElementById('connection-status');
            
            if (accountElement) {
                accountElement.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
            }
            
            if (statusElement) {
                statusElement.textContent = 'Connected';
                statusElement.className = 'badge bg-success';
            }
            
            // Initialize contracts
            console.log('Initializing contracts...');
            const contractsInitialized = await initContracts();
            
            if (!contractsInitialized) {
                throw new Error('Failed to initialize contracts');
            }
            
            // Update UI
            console.log('Updating UI...');
            await updateUI();
            
            showSuccess('Wallet connected successfully!');
            return true;
            
        } catch (error) {
            console.error('Error in wallet connection:', error);
            
            if (error.code === 4001) {
                showError('Please connect your wallet to continue.');
            } else if (error.code === -32002) {
                showError('Please check MetaMask and complete the connection request.');
            } else {
                showError(error.message || 'Failed to connect wallet. See console for details.');
            }
            
            return false;
        }
        
    } catch (error) {
        console.error('Unexpected error in connectWallet:', error);
        showError('An unexpected error occurred. Please try again or check console for details.');
        return false;
    }
}

// Initialize contract instances
async function initContracts() {
    try {
        console.log('Initializing contracts with local Hardhat node...');
        
        // Ensure web3 is initialized
        if (!web3) {
            web3 = window.web3;
            if (!web3) {
                throw new Error('Web3 is not initialized');
            }
        }
        
        // Get the current network ID
        const networkId = await web3.eth.net.getId();
        console.log('Connected to network ID:', networkId);
        
        // Convert both to string for comparison to avoid type issues
        if (String(networkId) !== String(CONFIG.NETWORK_ID)) {
            const errorMsg = `Incorrect network. Please connect to network ID: ${CONFIG.NETWORK_ID} (${CONFIG.NETWORK_NAME}). Current network ID: ${networkId}`;
            console.error(errorMsg);
            showError(errorMsg);
            return false;
        }
        
        // Use the test account from config
        currentAccount = CONFIG.TEST_ACCOUNT;
        console.log('Using account for contracts:', currentAccount);
        
        try {
            // Create contract instance for EquityToken only
            console.log('Creating EquityToken contract instance...');
            equityToken = new web3.eth.Contract(CONFIG.CONTRACT_ABI, CONFIG.EQUITY_TOKEN_ADDRESS);
            console.log('Contract instance created at:', CONFIG.EQUITY_TOKEN_ADDRESS);
            
            // Verify contract code exists at address
            const verifyContractCode = async (address, name) => {
                console.log(`Verifying contract at ${name} (${address})...`);
                const code = await web3.eth.getCode(address);
                if (code === '0x' || code === '0x0' || code === '0x00') {
                    console.warn(`⚠️ No contract code found at ${name} address: ${address}`);
                    return false;
                }
                console.log(`✓ Contract code verified at ${name} address:`, address);
                return true;
            };
            
            // Verify contract has code
            const isDeployed = await verifyContractCode(CONFIG.EQUITY_TOKEN_ADDRESS, 'EquityToken');
            
            if (!isDeployed) {
                console.warn('Contract not deployed to this address. You may need to deploy it first.');
                showError('Contract not found at the specified address. Please deploy the contract first.');
                return false;
            }
            
            // Test contract methods
            console.log('Testing contract methods...');
            try {
                const tokenName = await equityToken.methods.name().call();
                console.log('✓ Token name:', tokenName);
                
                const tokenSymbol = await equityToken.methods.symbol().call();
                console.log('✓ Token symbol:', tokenSymbol);
                
                const totalSupply = await equityToken.methods.totalSupply().call();
                console.log('✓ Total supply:', totalSupply);
                
                console.log('✓ Contract initialized successfully');
                return true;
            } catch (methodError) {
                console.error('Error calling contract methods:', methodError);
                showError('Connected to contract but encountered an error. Check console for details.');
                return false;
            }
            
        } catch (error) {
            console.error('Error initializing contract:', error);
            showError(`Failed to initialize contract: ${error.message}`);
            return false;
        }
        
    } catch (error) {
        console.error('Error in initContracts:', error);
        showError(`Failed to initialize contracts: ${error.message}`);
        return false;
    }
}

// Connect to wallet
async function connectWallet() {
    console.log('connectWallet called');
    try {
        console.log('Checking for window.ethereum...');
        if (!window.ethereum) {
            const errorMsg = 'MetaMask not detected. Please install MetaMask to connect your wallet.';
            console.error(errorMsg);
            showError(errorMsg);
            return;
        }
        console.log('window.ethereum found, requesting accounts...');

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts received:', accounts);
            
            if (accounts && accounts.length > 0) {
                currentAccount = accounts[0];
                console.log('Using account:', currentAccount);
                
                // Update UI elements
                const connectedAccountElement = document.getElementById('connected-account');
                const connectionStatusElement = document.getElementById('connection-status');
                
                if (connectedAccountElement && connectionStatusElement) {
                    connectedAccountElement.textContent = 
                        `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
                    connectionStatusElement.textContent = 'Connected';
                    connectionStatusElement.className = 'badge bg-success';
                    
                    console.log('UI updated with account info');
                    
                    // Initialize contracts and update UI
                    console.log('Initializing contracts...');
                    await initContracts();
                    console.log('Updating UI...');
                    await updateUI();
                    
                    showSuccess('Wallet connected successfully!');
                    console.log('Wallet connection flow completed');
                } else {
                    console.error('Required UI elements not found');
                    showError('Error: Could not update UI elements');
                }
            } else {
                const errorMsg = 'No accounts found. Please unlock your MetaMask wallet.';
                console.error(errorMsg);
                showError(errorMsg);
            }
        } catch (requestError) {
            console.error('Error requesting accounts:', requestError);
            if (requestError.code === 4001) {
                // User rejected the request
                showError('Please connect your wallet to continue.');
            } else {
                showError('Failed to connect wallet: ' + (requestError.message || 'Unknown error'));
            }
        }
    } catch (error) {
        console.error('Error in connectWallet:', error);
        showError('Failed to connect wallet: ' + (error.message || 'Unknown error'));
    }
}
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Connect wallet button
    const connectBtn = document.getElementById('connect-wallet');
    const mintForm = document.getElementById('mint-tokens-form');
    const transferForm = document.getElementById('transfer-tokens-form');
    const burnForm = document.getElementById('burn-tokens-form');
    
    if (connectBtn) connectBtn.addEventListener('click', initWeb3);
    if (mintForm) mintForm.addEventListener('submit', handleMintTokens);
    if (transferForm) transferForm.addEventListener('submit', handleTransferTokens);
    if (burnForm) burnForm.addEventListener('submit', handleBurnTokens);
}

// Update the UI with the latest data
async function updateUI() {
    console.log('Updating UI...');
    
    try {
        if (!web3) {
            console.warn('Web3 not initialized for UI update');
            return;
        }
        
        // Check if we have a connected account
        if (!currentAccount) {
            console.log('No account connected, skipping UI update');
            return;
        }
        
        console.log('Updating UI for account:', currentAccount);
        
        // Update connected account display
        const accountElement = document.getElementById('connected-account');
        if (accountElement) {
            const shortAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
            accountElement.textContent = shortAddress;
            accountElement.title = currentAccount;
            console.log('Updated account display');
        }
        
        // Update network info
        try {
            const networkId = await web3.eth.net.getId();
            const networkElement = document.getElementById('network-info');
            if (networkElement) {
                networkElement.textContent = `Network ID: ${networkId}`;
                console.log('Updated network info:', networkId);
            }
        } catch (networkError) {
            console.error('Error getting network info:', networkError);
        }
        
        // Update token info and balance
        await updateTokenInfo();
        await updateBalance();
        
        console.log('UI update completed');
        
    } catch (error) {
        console.error('Error in updateUI:', error);
        showError('Error updating UI. See console for details.');
    }
}

// Update token information
async function updateTokenInfo() {
    console.log('Updating token info...');
    
    try {
        if (!equityToken) {
            console.warn('Token contract not initialized');
            return;
        }
        
        // Get token name
        try {
            const name = await equityToken.methods.name().call();
            const nameElement = document.getElementById('token-name');
            if (nameElement) {
                nameElement.textContent = name;
                console.log('Token name:', name);
            }
        } catch (nameError) {
            console.error('Error getting token name:', nameError);
            // Set a default value if name is not available
            const nameElement = document.getElementById('token-name');
            if (nameElement) nameElement.textContent = 'Token';
        }
        
        // Get token symbol
        try {
            const symbol = await equityToken.methods.symbol().call();
            const symbolElement = document.getElementById('token-symbol');
            if (symbolElement) {
                symbolElement.textContent = symbol;
                console.log('Token symbol:', symbol);
            }
        } catch (symbolError) {
            console.error('Error getting token symbol:', symbolError);
            // Set a default value if symbol is not available
            const symbolElement = document.getElementById('token-symbol');
            if (symbolElement) symbolElement.textContent = 'TKN';
        }
        
        // Get total supply
        try {
            const totalSupply = await equityToken.methods.totalSupply().call();
            const supplyElement = document.getElementById('total-supply');
            if (supplyElement) {
                // Format the supply for better readability
                const formattedSupply = Number(totalSupply).toLocaleString();
                supplyElement.textContent = formattedSupply;
                console.log('Total supply:', formattedSupply);
            }
        } catch (supplyError) {
            console.error('Error getting total supply:', supplyError);
            const supplyElement = document.getElementById('total-supply');
            if (supplyElement) supplyElement.textContent = 'N/A';
        }
        
        // Remove or hide the decimals display since we're not using it
        const decimalsElement = document.getElementById('token-decimals');
        if (decimalsElement) {
            decimalsElement.textContent = 'N/A';
        }
        
        console.log('Token info update completed');
        
    } catch (error) {
        console.error('Error in updateTokenInfo:', error);
        showError('Error loading token information. See console for details.');
    }
}

// Update account balance
async function updateBalance() {
    try {
        if (!equityToken || !currentAccount) return;
        
        const balance = await equityToken.methods.balanceOf(currentAccount).call();
        const balanceElement = document.getElementById('account-balance');
        if (balanceElement) balanceElement.textContent = balance;
        
    } catch (error) {
        console.error('Error updating balance:', error);
        throw error;
    }
}

// Handle mint tokens
async function handleMintTokens(event) {
    event.preventDefault();
    
    const mintBtn = document.getElementById('mint-btn');
    const originalBtnText = mintBtn ? mintBtn.textContent : 'Mint Tokens';
    
    try {
        // Check if the current user is the contract owner
        const owner = await equityToken.methods.owner().call();
        const isOwner = owner.toLowerCase() === currentAccount.toLowerCase();
        
        if (!isOwner) {
            showError('Only the contract owner can mint new tokens');
            return;
        }
        
        const amountInput = document.getElementById('mint-amount');
        const amount = amountInput ? amountInput.value : '0';
        
        if (!amount || isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }
        
        // Show loading state
        if (mintBtn) {
            mintBtn.disabled = true;
            mintBtn.textContent = 'Minting...';
        }
        
        // Convert amount to wei (assuming 18 decimals)
        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Call the mint function
        const result = await equityToken.methods.mint(
            currentAccount,  // to
            amountInWei      // amount
        ).send({
            from: currentAccount,
            gas: CONFIG.GAS_LIMIT
        });
        
        console.log('Mint transaction successful:', result);
        
        // Update UI
        await updateUI();
        
        // Show success message
        showSuccess(`Successfully minted ${amount} tokens!`);
        
        // Reset the form
        if (amountInput) amountInput.value = '';
        
    } catch (error) {
        console.error('Error in handleMintTokens:', error);
        
        // Provide more user-friendly error messages
        if (error.message.includes('revert')) {
            showError('Transaction failed. Are you the contract owner?');
        } else if (error.message.includes('owner is not a function')) {
            showError('This contract does not support minting');
        } else {
            showError(`Failed to mint tokens: ${error.message || 'Unknown error'}`);
        }
    } finally {
        // Reset button state
        if (mintBtn) {
            mintBtn.disabled = false;
            mintBtn.textContent = originalBtnText;
        }
    }
    }

async function handleTransferTokens(event) {
    event.preventDefault();
    
    const transferBtn = document.getElementById('transfer-btn');
    const originalBtnText = transferBtn ? transferBtn.textContent : 'Transfer Tokens';
    
    try {
        const amountInput = document.getElementById('transfer-amount');
        const toAddressInput = document.getElementById('transfer-to');
        
        const amount = amountInput ? amountInput.value : '0';
        const toAddress = toAddressInput ? toAddressInput.value.trim() : '';
        
        // Validate inputs
        if (!amount || isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }
        
        if (!web3.utils.isAddress(toAddress)) {
            showError('Please enter a valid recipient address');
            return;
        }
        
        // Show loading state
        if (transferBtn) {
            transferBtn.disabled = true;
            transferBtn.textContent = 'Transferring...';
        }
        
        console.log(`Attempting to transfer ${amount} tokens to ${toAddress}`);
        
        // Convert amount to wei (assuming 18 decimals)
        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Call the transfer function
        const result = await equityToken.methods.transfer(
            toAddress,
            amountInWei
        ).send({
            from: currentAccount,
            gas: CONFIG.GAS_LIMIT
        });
        
        console.log('Transfer transaction successful:', result);
        
        // Update UI
        await updateUI();
        
        // Show success message
        showSuccess(`Successfully transferred ${amount} tokens to ${toAddress}`);
        
        // Reset the form
        if (amountInput) amountInput.value = '';
        if (toAddressInput) toAddressInput.value = '';
        
    } catch (error) {
        console.error('Error in handleTransferTokens:', error);
        
        // Provide more user-friendly error messages
        if (error.message.includes('revert')) {
            if (error.message.includes('ERC20: transfer amount exceeds balance')) {
                showError('Insufficient balance for this transfer');
            } else if (error.message.includes('ERC20: transfer to the zero address')) {
                showError('Cannot transfer to zero address');
            } else {
                showError(`Transaction failed: ${error.message}`);
            }
        } else {
            showError(`Failed to transfer tokens: ${error.message || 'Unknown error'}`);
        }
    } finally {
        // Reset button state
        if (transferBtn) {
            transferBtn.disabled = false;
            transferBtn.textContent = originalBtnText;
        }
    }
}

// Handle burn tokens
async function handleBurnTokens(event) {
    event.preventDefault();
    
    const burnBtn = document.getElementById('burn-btn');
    const originalBtnText = burnBtn ? burnBtn.textContent : 'Burn Tokens';
    
    try {
        const amountInput = document.getElementById('burn-amount');
        const amount = amountInput ? amountInput.value : '0';
        
        if (!amount || isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }
        
        // Show loading state
        if (burnBtn) {
            burnBtn.disabled = true;
            burnBtn.textContent = 'Burning...';
        }
        
        console.log(`Attempting to burn ${amount} tokens from ${currentAccount}`);
        
        // Convert amount to wei (assuming 18 decimals)
        const amountInWei = web3.utils.toWei(amount, 'ether');
        
        // Call the burn function (takes only the amount parameter)
        const result = await equityToken.methods.burn(
            amountInWei  // amount to burn
        ).send({
            from: currentAccount,
            gas: CONFIG.GAS_LIMIT
        });
        
        console.log('Burn transaction successful:', result);
        
        // Update UI
        await updateUI();
        
        // Show success message
        showSuccess(`Successfully burned ${amount} tokens!`);
        
        // Reset the form
        if (amountInput) amountInput.value = '';
        
    } catch (error) {
        console.error('Error in handleBurnTokens:', error);
        
        // Provide more user-friendly error messages
        if (error.message.includes('revert')) {
            if (error.message.includes('ERC20: burn amount exceeds balance')) {
                showError('Insufficient balance to burn this amount');
            } else {
                showError('Transaction failed. Do you have enough tokens to burn?');
            }
        } else {
            showError(`Failed to burn tokens: ${error.message || 'Unknown error'}`);
        }
    } finally {
        // Reset button state
        if (burnBtn) {
            burnBtn.disabled = false;
            burnBtn.textContent = originalBtnText;
        }
    }
}

// Handle transfer tokens
async function handleTransferTokens(event) {
    event.preventDefault();
    
    try {
        const toAddress = document.getElementById('transfer-to').value;
        const amount = document.getElementById('transfer-amount').value;
        
        if (!web3.utils.isAddress(toAddress)) {
            showError('Please enter a valid recipient address');
            return;
        }
        
        if (!amount || isNaN(amount) || amount <= 0) {
            showError('Please enter a valid amount');
            return;
        }
        
        // Show loading state
        const transferBtn = document.getElementById('transfer-btn');
        const originalText = transferBtn.textContent;
        transferBtn.disabled = true;
        transferBtn.textContent = 'Transferring...';
        
        // Call the transfer function
        const result = await equityToken.methods.transfer(
            toAddress,
            web3.utils.toWei(amount, 'ether')
        ).send({
            from: currentAccount,
            gas: CONFIG.GAS_LIMIT
        });
        
        console.log('Transfer transaction:', result);
        
        // Update UI
        await updateUI();
        
        // Show success message
        showSuccess(`Successfully transferred ${amount} tokens to ${toAddress}`);
        
    } catch (error) {
        console.error('Error transferring tokens:', error);
        showError(`Error transferring tokens: ${error.message}`);
    } finally {
        // Reset button state
        const transferBtn = document.getElementById('transfer-btn');
        if (transferBtn) {
            transferBtn.disabled = false;
            transferBtn.textContent = originalText;
        }
    }
}

// Show success message
function showSuccess(message) {
    const successElement = document.getElementById('success-message');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    } else {
        console.log('Success:', message);
    }
}

// Show error message to the user
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        console.error('Error element not found');
    }
}

// Initialize the app when the page loads
window.addEventListener('load', init);
