pragma solidity ^0.4.19;

contract Splitter {
    
    address public owner;
    mapping (address => uint) public participants;    
    
    function Splitter() public{
        owner = msg.sender;
    }

	modifier onlyAddressValid(address _addr) { 
		require(_addr != address(0)); 
		_; 
	}

	modifier onlyOwner() { 
		require(msg.sender == owner); 
		_; 
	}
	

	function split(address _addr1, address _addr2) public payable 
		onlyAddressValid(_addr1) 
		onlyAddressValid(_addr2)
		onlyOwner() {

		require(msg.value > 0);
		require(owner != _addr1 && owner != _addr2);

		uint amount = msg.value;
		participants[owner] += amount % 2;
        amount /= 2;

        participants[_addr1] += amount;
        participants[_addr2] += amount;		
	}

	function withDraw() public {
		
		uint amountToWithDraw = participants[msg.sender];
		require(amountToWithDraw > 0);
		participants[msg.sender] = 0;		
		msg.sender.transfer(amountToWithDraw);		
	}
	
	
	function kill() public onlyOwner(){
	    selfdestruct(this);
	}
}