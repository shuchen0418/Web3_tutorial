const { network } = require("hardhat")
const {
    devlopmentChains,
    networkConfig,
    LOCK_TIME,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    //deployments是一个对象
    const { deploy } = deployments

    let datafeedAddr
    if (devlopmentChains.includes(network.name)) {
        const mockV3Aggregator = await deployments.get("MockV3Aggregator")
        datafeedAddr = mockV3Aggregator.address
    } else {
        datafeedAddr = networkConfig[network.config.chainId].ethUsdDataFeed
    }

    const fundMe = await deploy("FundMe", {
        from: firstAccount,
        args: [LOCK_TIME, datafeedAddr],
        log: true,
    })

    if (
        hre.network.config.chainId == 11155111 &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await hre.run("verify:verify", {
            address: fundMe.address,
            constructorArguments: [LOCK_TIME, datafeedAddr],
        })
    } else {
        console.log(
            "the network of environment is not sepolia the verify is skipped"
        )
    }
}

module.exports.tags = ["all", "fundme"]
