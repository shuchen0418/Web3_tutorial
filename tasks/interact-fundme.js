const { task } = require("hardhat/config")

task("interact-fundme", "interact with fundme contract")
    .addParam("addr", "contarcAddress")
    .setAction(async (taskArgs, hre) => {
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        const fundMe = fundMeFactory.attach(taskArgs.addr)
        //init 2 accounts
        const [firstAccount, secondAccount] = await ethers.getSigners()

        //fund contract with first account
        const firstTx = await fundMe.fund({
            value: ethers.parseEther("0.0002"),
        })
        await firstTx.wait()

        //check balance of contract
        const balanceOfContract = await ethers.provider.getBalance(
            fundMe.target
        )
        console.log(`balance of the contract is ${balanceOfContract}`)

        //fund contract with second acount
        const secondTx = await fundMe
            .connect(secondAccount)
            .fund({ value: ethers.parseEther("0.0002") })
        await secondTx.wait()

        //check balance of account
        const balanceOfContract2 = await ethers.provider.getBalance(
            fundMe.target
        )
        console.log(`balance of the contract is ${balanceOfContract2}`)

        //check mapping fundersToAmount
        const firstAccountBalanceinFundMe = await fundMe.fundersToAmount(
            firstAccount.address
        )
        const secondAccountBalanceinFundMe = await fundMe.fundersToAmount(
            secondAccount.address
        )

        console.log(
            `balance of first account ${firstAccount.address} is ${firstAccountBalanceinFundMe}`
        )

        console.log(
            `balance of first account ${secondAccount.address} is ${secondAccountBalanceinFundMe}`
        )
    })

module.exports = {}
