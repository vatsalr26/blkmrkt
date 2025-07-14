const hre = require("hardhat");

async function main() {
  // Get the contract at the deployed address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get the contract factory
  const EquityToken = await hre.ethers.getContractFactory("EquityToken");
  
  // Attach to the deployed contract
  const token = EquityToken.attach(contractAddress);
  
  console.log("Contract address:", contractAddress);
  console.log("Name:", await token.name());
  console.log("Symbol:", await token.symbol());
  console.log("Total Supply:", (await token.totalSupply()).toString());
  
  // Get the signer (first account)
  const [owner] = await hre.ethers.getSigners();
  console.log("Owner address:", owner.address);
  
  // Check owner's balance
  const ownerBalance = await token.balanceOf(owner.address);
  console.log("Owner balance:", ownerBalance.toString());
  
  // List all available functions
  console.log("\nAvailable functions:");
  const functions = [];
  
  for (const fragment of Object.values(token.interface.fragments)) {
    if (fragment.type === 'function') {
      functions.push({
        name: fragment.name,
        inputs: fragment.inputs.map(i => `${i.type} ${i.name}`).join(', '),
        outputs: fragment.outputs ? fragment.outputs.map(o => o.type).join(', ') : 'void'
      });
    }
  }
  
  // Sort functions by name for better readability
  functions.sort((a, b) => a.name.localeCompare(b.name));
  
  // Display functions in a readable format
  functions.forEach(fn => {
    console.log(`- ${fn.name}(${fn.inputs}) => ${fn.outputs}`);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
