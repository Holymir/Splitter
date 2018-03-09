pragma solidity ^0.4.19;

contract Splitter {
    
    address public owner;
    mapping (address => uint) public participants;    
    
    function Splitter() public{
        owner = msg.sender;
    }

	modifier isAddressValid(address _addr) { 
		require(_addr != address(0)); 
		_; 
	}

	modifier isOwner(address _ownerAddr) { 
		require(_ownerAddr == owner); 
		_; 
	}
	

	function split(address _addr1, address _addr2) public payable 
		isAddressValid(_addr1) 
		isAddressValid(_addr2)
		isOwner(msg.sender) {

		require(msg.value > 0);
		require(owner != _addr1 && owner != _addr2);

		uint amount = msg.value;

		if(amount % 2 == 1) {
			amount -= 1;
			participants[owner] += 1;
		}

        amount /= 2;

        participants[_addr1] += amount;
        participants[_addr2] += amount;		
	}

	function withDraw() public {

		// msg.sender.transfer(participants[msg.sender]);
		// participants[msg.sender] = 0;
		address sender = msg.sender;
		uint amountToWithDraw = participants[sender];
		require(amountToWithDraw > 0);
		participants[sender] = 0;		
		sender.transfer(amountToWithDraw);		
	}
	
	
	function kill() public{
	    require(owner == msg.sender);
	    selfdestruct(owner);
	}
}