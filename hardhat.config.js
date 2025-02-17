require("@nomicfoundation/hardhat-toolbox")
require("@chainlink/env-enc").config()
require("@nomicfoundation/hardhat-verify")
require("./tasks")
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
module.exports = {
    solidity: "0.8.27",
    networks: {
        sepolia: {
            url: SEPOLIA_URL,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
            chainId: 11155111,
        },
    },
    etherscan: {
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
        },
    },
    namedAccounts: {
        firstAccount: {
            default: 0,
        },
        secondAccount: {
            default: 1,
        },
    },
}
