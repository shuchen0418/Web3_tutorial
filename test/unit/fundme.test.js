const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { time, mine } = require("@nomicfoundation/hardhat-network-helpers")

describe("test fundme contract", async function () {
    let firstAccount
    let secondAccount
    let fundMe
    let fundMeSecondAccount
    let mockV3Aggregator

    beforeEach(async function () {
        await deployments.fixture(["all"]) // 部署所有合约
        const { firstAccount: acc1, secondAccount: acc2 } =
            await getNamedAccounts() // 获取命名账户
        firstAccount = acc1
        secondAccount = acc2

        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")

        // 获取已部署的合约实例
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)

        // 获取签名者
        const secondSigner = await ethers.getSigner(secondAccount)

        // 通过第二个账户的签名者来与合约进行交互
        fundMeSecondAccount = fundMe.connect(secondSigner)
    })

    it("test if the owner is msg.sender", async function () {
        // const [firstAccount] = await ethers.getSigners()
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // const fundme = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        assert.equal(await fundMe.owner(), firstAccount)
    })

    it("test if the datafeed is assigned correctly", async function () {
        // const fundMeFactory = await ethers.getContractFactory("FundMe")
        // const fundme = await fundMeFactory.deploy(180)
        await fundMe.waitForDeployment()
        assert.equal(await fundMe.dataFeed(), mockV3Aggregator.address)
    })

    it("window closed, value grater than minmum, fund failed", async function () {
        //make sure the window is closed
        await time.increase(200)
        await mine()
        //value grater than minmum
        await expect(
            fundMe.fund({ value: ethers.parseEther("10") })
        ).to.be.revertedWith("window is closed")
    })

    it("window open ,value is less than minmum,fund failed", async function () {
        await expect(
            fundMe.fund({ value: ethers.parseEther("0.001") })
        ).to.be.revertedWith("Send more ETH")
    })

    it("window open , value is grater minmum ,fund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })
        const balance = await fundMe.fundersToAmount(firstAccount)
        await expect(balance).to.equals(ethers.parseEther("0.1"))
    })

    //unit test for getFund
    //onlyOwner,windowClose, target reached
    it("not owner, window closed, target reached, getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("10") })
        //make sure the window is closed
        await time.increase(200)
        await mine()

        await expect(fundMeSecondAccount.getFund()).to.be.revertedWith(
            "this function can only be called by owner"
        )
    })

    it("window open,target reached ,getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("10") })
        await expect(fundMe.getFund()).to.be.revertedWith(
            "window is not closed"
        )
    })

    it("window closed ,target not reached ，getFund failed", async function () {
        await fundMe.fund({ value: ethers.parseEther("0.1") })
        //make sure the window is closed
        await time.increase(200)
        await mine()
        await expect(fundMe.getFund()).to.be.revertedWith(
            "Target is not reached"
        )
    })

    it("window closed ,target  reached ，getFund success", async function () {
        await fundMe.fund({ value: ethers.parseEther("1") })
        //make sure the window is closed
        await time.increase(200)
        await mine()
        await expect(fundMe.getFund())
            .to.emit(fundMe, "FundWithdrawByOwner")
            .withArgs(ethers.parseEther("1"))
    })
})
