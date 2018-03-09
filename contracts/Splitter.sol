pragma solidity ^0.4.19;

contract Splitter {
    
    address public owner;

    // Balances for each account
    mapping (address => uint) public balances;    
    
	event Deposit(address _from, address _toAddr1, address _toAddr2, uint _value); 
	event WithDraw(address _from, uint _value);
	event Killed(address _addr);


    function Splitter() public{
        owner = msg.sender;
    }

    // Check is the address valid
	modifier onlyAddressValid(address _addr) { 
		require(_addr != address(0)); 
		_; 
	}

	// Check if the function is called by owner
	modifier onlyOwner() { 
		require(msg.sender == owner); 
		_; 
	}
	

	// Recieves funds from owner and split them between two address 
	function split(address _addr1, address _addr2) public payable 
		onlyAddressValid(_addr1) 
		onlyAddressValid(_addr2)
		onlyOwner() {

		require(msg.value > 0);
		require(owner != _addr1 && owner != _addr2);

		uint amount = msg.value;
		balances[owner] += amount % 2;
        amount /= 2;

        balances[_addr1] += amount;
        balances[_addr2] += amount;	

        Deposit(msg.sender, _addr1, _addr2, amount);	
	}

	// Recipients withDraw their coins
	function withDraw() public {
		
		uint amountToWithDraw = balances[msg.sender];
		require(amountToWithDraw > 0);
		balances[msg.sender] = 0;		
		msg.sender.transfer(amountToWithDraw);	
		WithDraw(msg.sender, amountToWithDraw);	
	}
	
	// Removes the owner
	function kill() public onlyOwner(){
	    Killed(owner);
	    selfdestruct(this);
	}
}