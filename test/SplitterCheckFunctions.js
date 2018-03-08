var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

	var contract;

	var owner;
	var accOne;	
	var accTwo;

	var ballance1;
	var ballance2;
	var ownerBallance;

	beforeEach(async () => {

		contract = await Splitter.new();

		owner = accounts[0];
		accOne = accounts[1];
		accTwo = accounts[2];

		ownerBallance = web3.eth.getBalance(owner).toNumber();
		ballanceAccOne = web3.eth.getBalance(accOne).toNumber();
		ballanceAccTwo = web3.eth.getBalance(accTwo).toNumber();
		
	});	

	it("it should split corectly from owner to acc1", async function() {

		await contract.split(accOne, accTwo, {from: owner, value: 500});

		var newBallanceAccOne = web3.eth.getBalance(accOne).toNumber();

		assert.strictEqual(newBallanceAccOne, ballanceAccOne + 250, "doesn't split corectly from owner to acc1");				
	});	

	it("it should split corectly from owner to acc2", async function() {

		await contract.split(accOne, accTwo, {from: owner, value: 500});

		var newBallanceAccTwo = web3.eth.getBalance(accTwo).toNumber();

		assert.strictEqual(newBallanceAccTwo, ballanceAccTwo + 250, "doesn't split corectly from owner to acc2");				
	});

	it("it should split corectly from another acc to owner", async function() {

		await contract.split(owner, accTwo, {from: accOne, value: 500});

		var newBallanceAccOwner = web3.eth.getBalance(owner).toNumber();

		assert.strictEqual(newBallanceAccOwner, ownerBallance + 250, "doesn't split corectly from another acc to owner");				
	});	

});