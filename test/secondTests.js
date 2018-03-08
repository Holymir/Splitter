var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

	var contract;
	var owner = accounts[0];
	var accOne = accounts[1];
	var accTwo = accounts[2];	

	var ballance1 = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether").toNumber();
	var ballance2 = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[2]), "ether").toNumber();
	var ownerBallance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[0]), "ether").toNumber();

	beforeEach(async () => {

		contract = await Splitter.new();
	});	

	it("it should split corectly from owner to acc1", async function() {

		await contract.split(accOne, accTwo, {from: owner, value: web3.toWei(10, 'ether')});

		var newBallance = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[1]), "ether").toNumber();

		assert.strictEqual(newBallance, ballance1 + 5, "doesn't split corectly from owner to acc1");				
	});	

});