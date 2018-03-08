pragma solidity ^0.4.19;

contract Splitter {
    
    address public owner;
    
    function Splitter() public{
        owner = msg.sender;
    }

	modifier isAddressValid(address _addr1, address _addr2) { 
		require(_addr1 != 0x0000000000000000000000000000000000000000); 
		require(_addr2 != 0x0000000000000000000000000000000000000000); 
		_; 
	}

	function split(address _addr1, address _addr2) public payable isAddressValid(_addr1, _addr2) {
		require(msg.sender.balance > msg.value);
		require(msg.sender != _addr1 && msg.sender != _addr2);
        uint amount = msg.value / 2;
		_addr1.transfer(amount);
		_addr2.transfer(amount);
	}
	
	function kill() public returns(bool){
	    require(owner == msg.sender);
	    selfdestruct(this);
	    return true;
	}
}