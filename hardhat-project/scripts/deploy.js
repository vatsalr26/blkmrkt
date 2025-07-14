const hre = require("hardhat");

async function main() {
  // Deploy EquityToken contract
  const EquityToken = await hre.ethers.getContractFactory("EquityToken");
  const equityToken = await EquityToken.deploy();
  
  await equityToken.waitForDeployment();
  
  console.log(`EquityToken deployed to: ${await equityToken.getAddress()}`);
  console.log(`Transaction hash: ${equityToken.deploymentTransaction().hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
