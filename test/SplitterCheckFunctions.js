var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {

	var contract;

	const owner = accounts[0];
	const accOne = accounts[1];	
	const accTwo = accounts[2];
	const accThree = accounts[3];

	var Ballanceowner;
	var ballanceAccOne;
	var ballanceAccTwo;
	var ballanceAccThree;

	var contractBallanceOwner;
	var contractBallanceAccOne;
	var contractBallanceAccTwo;
	var contractBallanceAccThree;

	beforeEach(async () => {

		contract = await Splitter.new();		
		
	});	

	//Checking owner

	it('has an correct owner', async function () {

      assert.equal(await contract.owner(), owner)

    })

    //Checking Split function

	it("it should split corectly from owner to accOne and accTwo when value is even", async function() {

		contractBallanceAccOne = await contract.participants(accOne);
		contractBallanceAccTwo = await contract.participants(accTwo);

		await contract.split(accOne, accTwo, {from: owner, value: 500});

		let newContractBallanceAccOne = await contract.participants(accOne);
		let newContractBallanceAccTwo = await contract.participants(accTwo);

		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 250, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 250, "doesn't split corectly from owner to accTwo");				
	});	

	it("it should split corectly from owner to accOne and accTwo when value is odd", async function() {

		contractBallanceOwner = await contract.participants(owner);
		contractBallanceAccOne = await contract.participants(accOne);
		contractBallanceAccTwo = await contract.participants(accTwo);

		await contract.split(accOne, accTwo, {from: owner, value: 501});

		let newContractBallanceOwner = await contract.participants(owner);
		let newContractBallanceAccOne = await contract.participants(accOne);
		let newContractBallanceAccTwo = await contract.participants(accTwo);

		assert.strictEqual(newContractBallanceOwner.toNumber(), contractBallanceOwner.toNumber() + 1, "doesn't split corectly to Owner");
		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 250, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 250, "doesn't split corectly from owner to accTwo");				
	});

	it("it should split corectly from owner to accOne and accTwo twice in a row", async function() {

		contractBallanceAccOne = await contract.participants(accOne);
		contractBallanceAccTwo = await contract.participants(accTwo);

		await contract.split(accOne, accTwo, {from: owner, value: 500});
		await contract.split(accOne, accTwo, {from: owner, value: 200});

		let newContractBallanceAccOne = await contract.participants(accOne);
		let newContractBallanceAccTwo = await contract.participants(accTwo);

		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 350, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 350, "doesn't split corectly from owner to accTwo");				
	});	

	it("it should split corectly two transactions between three participants", async function() {

		contractBallanceAccOne = await contract.participants(accOne);
		contractBallanceAccTwo = await contract.participants(accTwo);
		contractBallanceAccThree = await contract.participants(accThree);

		await contract.split(accOne, accTwo, {from: owner, value: 300});
		await contract.split(accOne, accThree, {from: owner, value: 260});

		let newContractBallanceAccOne = await contract.participants(accOne);
		let newContractBallanceAccTwo = await contract.participants(accTwo);
		let newContractBallanceAccThree = await contract.participants(accThree);


		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 280, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 150, "doesn't split corectly from owner to accTwo");
		assert.strictEqual(newContractBallanceAccThree.toNumber(), contractBallanceAccThree.toNumber() + 130, "doesn't split corectly from owner to accThree");				
	});

	//Checking WithDraw

	it("it should withdraw corectly from contract to accOne", async function() {

		await contract.split(accOne, accTwo, {from: owner, value: 500});
		contractBallanceAccOne = await contract.participants(accOne);		
		//console.log(contractBallanceAccOne.toNumber())
		assert.strictEqual(contractBallanceAccOne.toNumber(), 250, "doesn't withdraw correct");

		await contract.withDraw({from: accOne});
		let newContractBallanceAccOne = await contract.participants(accOne);
		//console.log(newContractBallanceAccOne.toNumber())		

		assert.strictEqual(newContractBallanceAccOne.toNumber(), 0, "doesn't withdraw correct");
	});
});