const expectThrow = require("./util").expectThrow;
var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

	var contract;

	var owner;
	var accOne;	
	var accTwo;

	beforeEach(async () => {

		contract = await Splitter.new();

		owner = accounts[0];
		accOne = accounts[1];
		accTwo = accounts[2];		
	});	
	
	//Wrong iputs:
	//with try /cath
	it("should not be able send ethers to yourself", async function() {

		try {

    		await contract.split(owner, accOne, {from: owner, value: web3.toWei(10, 'ether')});    		
		} catch (error) {

     		assert.strictEqual(error.message, "VM Exception while processing transaction: revert", "other Error");
		}				  
	});

	it("should not be able send more than senders ballance", async function() {

		try {

		await contract.split(accTwo, accOne, {from: owner, value: web3.toWei(200, 'ether')})
		} catch (error) {

			assert.strictEqual(error.message.substring(0, 51), "Error: sender doesn\'t have enough funds to send tx.");
		}						  
	});	

	//with return assert
	it("should not be able send ethers to empty address", function() {

		return contract.split("", accOne, {from: owner, value: web3.toWei(10, 'ether')})
			.catch(function (err) {
				assert.strictEqual(err.message, "VM Exception while processing transaction: revert", "other Error");
        	});				  
	});		

	//with custum expectThrow()
	it("should not be able send ethers to empty address /expectThrow/", async function () {

		await expectThrow(contract.split("", accOne, {from: owner, value: web3.toWei(10, 'ether')})

	)});

	it("should not be able send more than senders ballance /expectThrow/", async function () {

		await expectThrow(contract.split(accTwo, accOne, {from: owner, value: web3.toWei(200, 'ether')})

	)});

	it("should not be able send ethers to yourself /expectThrow/", async function () {

		await expectThrow(contract.split(owner, accOne, {from: owner, value: web3.toWei(10, 'ether')})

	)});
});