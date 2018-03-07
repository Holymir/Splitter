pragma solidity ^0.4.19;

contract Splitter {

	mapping (address => uint) private participants;	

	function split(address _addr1, address _addr2, uint _amount) public payable {
		require(_amount > 0);
        uint amountPerAddr = _amount / 2;
		participants[_addr1] += amountPerAddr;
		participants[_addr2] += amountPerAddr;
	}

	function withdraw() public returns(uint tokent) {
		address sender = msg.sender;
		uint amount = participants[sender];
		participants[sender] = 0;
		sender.transfer(amount);
		return participants[msg.sender];		
	}
}