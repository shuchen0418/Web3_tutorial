//import ethers.js
//create main function
//execute main function

const { ethers } = require("hardhat")

async function main() {
  //create factory
  const fundMeFactory = await ethers.getContractFactory("FundMe")
  console.log("contract deploying")
  //deploy contract from factory
  const fundMe = await fundMeFactory.deploy(300)
  await fundMe.waitForDeployment()
  console.log(
    `contract has been deployed successfully, contract address is ${fundMe.target}`
  )

  //verify fundme
  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("wait for 5 confirmations")
    await fundMe.deploymentTransaction().wait(5)
    await verifyFundMe(fundMe.target, [300])
  } else {
    console.log("verification skipped..")
  }

  //init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners()

  //fund contract with first account
  const firstTx = await fundMe.fund({ value: ethers.parseEther("0.0002") })
  await firstTx.wait()

  //check balance of contract
  const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
  console.log(`balance of the contract is ${balanceOfContract}`)

  //fund contract with second acount
  const secondTx = await fundMe
    .connect(secondAccount)
    .fund({ value: ethers.parseEther("0.0002") })
  await secondTx.wait()

  //check balance of account
  const balanceOfContract2 = await ethers.provider.getBalance(fundMe.target)
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
}

async function verifyFundMe(fundMeAddr, args) {
  await hre.run("verify:verify", {
    address: fundMeAddr,
    constructorArguments: args,
  })
}

main()
  .then()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
