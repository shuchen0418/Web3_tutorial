const { network } = require("hardhat")
const {
    DECIMAL,
    INITIAL_ANSWER,
    devlopmentChains,
    CONFIRMATIONS,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    if (devlopmentChains.includes(network.name)) {
        const { firstAccount } = await getNamedAccounts()
        //deployments是一个对象
        const { deploy } = deployments

        await deploy("MockV3Aggregator", {
            from: firstAccount,
            args: [DECIMAL, INITIAL_ANSWER],
            log: true,
        })
    } else {
        console.log(
            "environment is not local, mock contract depployment is skipped"
        )
    }
}

module.exports.tags = ["all", "mock"]
