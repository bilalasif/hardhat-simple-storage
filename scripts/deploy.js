//imports
const { ethers, run, network } = require("hardhat")

// main function defination
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    console.log("Deploying Contract wait...")
    const simpleStorage = await SimpleStorageFactory.deploy()
    await simpleStorage.deployed()
    console.log(`Deployed contract to: ${simpleStorage.address}`)
        // The verfication needs to be done only on remote networks if we are not using a remote network 
        // we dont need to verify so there fore below code
    if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve();
    console.log('Currentvalue:', currentValue);
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log('UpdatedValue:', updatedValue)

}
async function verify(contractAddress, args) {
    console.log("Verifying contract ... ")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log("Error in verification:", e)
        }
    }
}
// main calling
main().then(() => process.exit(0)).catch((error) => {
    console.error("Error:", error);
    process.exit(1)
})