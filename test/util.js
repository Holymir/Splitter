const util = {
	expectThrow: async promise => {
		try {
			let result = await promise;
			console.log(result);
		} catch (error) {
			const outOfGas = error.message.search('out of gas') >= 0;
			const revert = error.message.search('revert') >= 0;
			const outOfMoney = error.message.search('doesn\'t have enough funds') >= 0;

			assert(outOfGas || revert || outOfMoney, "Expected throw, got '" + error + "' instead");
			return
		}
		assert.fail('Expected throw not received');
	}
}
module.exports = util;