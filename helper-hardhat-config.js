module.exports = {
    DECIMAL: 8,
    INITIAL_ANSWER: 300000000000,
    devlopmentChains: ["hardhat", "local"],
    LOCK_TIME: 180,
    networkConfig: {
        11155111: {
            ethUsdDataFeed: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
        },
        97: {
            ethUsdDataFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
        },
    },
    CONFIRMATIONS: 5,
}
