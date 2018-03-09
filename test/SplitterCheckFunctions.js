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

		contractBallanceAccOne = await contract.balances(accOne);
		contractBallanceAccTwo = await contract.balances(accTwo);

		await contract.split(accOne, accTwo, {from: owner, value: 500});

		let newContractBallanceAccOne = await contract.balances(accOne);
		let newContractBallanceAccTwo = await contract.balances(accTwo);

		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 250, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 250, "doesn't split corectly from owner to accTwo");				
	});	

	it("it should split corectly from owner to accOne and accTwo when value is odd", async function() {

		contractBallanceOwner = await contract.balances(owner);
		contractBallanceAccOne = await contract.balances(accOne);
		contractBallanceAccTwo = await contract.balances(accTwo);

		await contract.split(accOne, accTwo, {from: owner, value: 501});

		let newContractBallanceOwner = await contract.balances(owner);
		let newContractBallanceAccOne = await contract.balances(accOne);
		let newContractBallanceAccTwo = await contract.balances(accTwo);

		assert.strictEqual(newContractBallanceOwner.toNumber(), contractBallanceOwner.toNumber() + 1, "doesn't split corectly to Owner");
		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 250, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 250, "doesn't split corectly from owner to accTwo");				
	});

	it("it should split corectly from owner to accOne and accTwo twice in a row", async function() {

		contractBallanceAccOne = await contract.balances(accOne);
		contractBallanceAccTwo = await contract.balances(accTwo);

		await contract.split(accOne, accTwo, {from: owner, value: 500});
		await contract.split(accOne, accTwo, {from: owner, value: 200});

		let newContractBallanceAccOne = await contract.balances(accOne);
		let newContractBallanceAccTwo = await contract.balances(accTwo);

		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 350, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 350, "doesn't split corectly from owner to accTwo");				
	});	

	it("it should split corectly two transactions between three participants", async function() {

		contractBallanceAccOne = await contract.balances(accOne);
		contractBallanceAccTwo = await contract.balances(accTwo);
		contractBallanceAccThree = await contract.balances(accThree);

		await contract.split(accOne, accTwo, {from: owner, value: 300});
		await contract.split(accOne, accThree, {from: owner, value: 260});

		let newContractBallanceAccOne = await contract.balances(accOne);
		let newContractBallanceAccTwo = await contract.balances(accTwo);
		let newContractBallanceAccThree = await contract.balances(accThree);


		assert.strictEqual(newContractBallanceAccOne.toNumber(), contractBallanceAccOne.toNumber() + 280, "doesn't split corectly from owner to accOne");
		assert.strictEqual(newContractBallanceAccTwo.toNumber(), contractBallanceAccTwo.toNumber() + 150, "doesn't split corectly from owner to accTwo");
		assert.strictEqual(newContractBallanceAccThree.toNumber(), contractBallanceAccThree.toNumber() + 130, "doesn't split corectly from owner to accThree");				
	});

	//Checking WithDraw

	it("it should withdraw corectly from contract to accOne", async function() {

		await contract.split(accOne, accTwo, {from: owner, value: 500});
		contractBallanceAccOne = await contract.balances(accOne);		
		//console.log(contractBallanceAccOne.toNumber())
		assert.strictEqual(contractBallanceAccOne.toNumber(), 250, "doesn't withdraw correct");

		await contract.withDraw({from: accOne});
		let newContractBallanceAccOne = await contract.balances(accOne);
		//console.log(newContractBallanceAccOne.toNumber())		

		assert.strictEqual(newContractBallanceAccOne.toNumber(), 0, "doesn't withdraw correct");
	});

	it("it should selfdestruct contract", async function() {

		await contract.kill({from: owner});
		let _owner = await contract.owner();	
		assert.strictEqual(_owner, "0x0");		
	});

	it("should emit event on split", async function () {

			const expectedEvent = 'WhenDeposit';
			let result = await contract.split(accOne, accTwo, {from: owner, value: 500});

			assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
			assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
		});

	it("should emit event on withdraw", async function () {

			const expectedEvent = 'WhenWithDraw';

			await contract.split(accOne, accTwo, {from: owner, value: 500});
			let result = await contract.withDraw({from: accOne});

			//console.log(result.logs[0]);
			assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
			assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
		});

	it("should emit when owner is killed", async function () {

			const expectedEvent = 'WhenKilled';

			let result = await contract.kill({from: owner});

			//console.log(result.logs[0]);
			assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
			assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
		});
});