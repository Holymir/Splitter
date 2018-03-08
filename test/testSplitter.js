var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

	var contract;
	var owner = accounts[0];
	var accOne = accounts[1];
	var accTwo = accounts[2];	

	var ballance1 = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether").toNumber();
	var ballance2 = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether").toNumber();
	var ownerBallance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), "ether").toNumber();

	beforeEach(function() {
		return Splitter.new()
		.then(function(instance) {
			contract = instance;
		});
	});	

	it("The owner is the right one", function() {

		return contract.owner({from: owner})
		.then(function(_owner) {

			assert.strictEqual(_owner, owner, "Owner is NOT the right one")
		});
	});

	it("it should split corectly from owner to acc1", function() {

		return contract.split(accOne, accTwo, {from: owner, value: web3.toWei(10, 'ether')});
		assert.еqual(ballance1, ballance1 + 5, "doesn't split corectly to from owner to acc1");				
	});

	it("it should split corectly from owner to acc2", function() {

		return contract.split(accOne, accTwo, {from: owner, value: web3.toWei(10, 'ether')});
		assert.еqual(ballance2, ballance2 + 5, "doesn't split corectly from owner to acc2");				
	});

	it("it should split corectly from acc1 to owner", function() {

		return contract.split(owner, accTwo, {from: accOne, value: web3.toWei(10, 'ether')});
		assert.еqual(ownerBallance, ownerBallance + 5, "doesn't split corectly from acc1 to owner");				
	});

	it("it should split corectly from acc1 to acc2", function() {

		return contract.split(owner, accTwo, {from: accOne, value: web3.toWei(10, 'ether')});
		assert.еqual(ballance2, ballance2 + 5, "doesn't split corectly from acc1 to acc2");				
	});

	it("it should split corectly from acc2 to owner", function() {

		return contract.split(owner, accOne, {from: accTwo, value: web3.toWei(10, 'ether')});
		assert.еqual(ownerBallance, ownerBallance + 5, "doesn't split corectly from acc2 to owner");				
	});

	it("it should split corectly from acc2 to acc1", function() {

		return contract.split(owner, accOne, {from: accTwo, value: web3.toWei(10, 'ether')});
		assert.еqual(ballance1, ballance1 + 5, "doesn't split corectly from acc2 to acc1");				
	});

	//Wrong
	it("should not be able send ethers to yourself", function() {

		return contract.split(owner, accOne, {from: owner, value: web3.toWei(10, 'ether')})
			.catch(function (err) {
				assert.strictEqual(err.message, "VM Exception while processing transaction: revert", "other Error");
        	});				  
	});	

	it("should not be able send ethers to empty address", function() {

		return contract.split("", accOne, {from: owner, value: web3.toWei(10, 'ether')})
			.catch(function (err) {
				assert.strictEqual(err.message, "VM Exception while processing transaction: revert", "other Error");
        	});				  
	});		

	it("should not be able send more ethers than the ballance", function() {

		return contract.split("", accOne, {from: owner, value: web3.toWei(200, 'ether')})
			.catch(function (err) {
				assert.strictEqual(err.message.substring(0, 51), "Error: sender doesn\'t have enough funds to send tx.");
        	});				  
	});	

});