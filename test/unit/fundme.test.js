const { ethers, deployments, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { helpers } = require("@nomicfoundation/hardhat-netword-helpers")

describe("test fundme contract", async function () {
    let firstAccount
    let fundMe
    let mockV3Aggregator
    beforeEach(async function () {
        await deployments.fixture(["all"])
        firstAccount = (await getNamedAccounts()).firstAccount
        const fundMeDeployment = await deployments.get("FundMe")
        mockV3Aggregator = await deployments.get("MockV3Aggregator")
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)
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
        await helpers.time.increase(200)
        await helpers.mine()
        //value grater than minmum
        expect(
            fundMe.fund({ value: ethers.parseEther("0.1") })
        ).to.be.revertedWith("windows is closed")
    })
})
