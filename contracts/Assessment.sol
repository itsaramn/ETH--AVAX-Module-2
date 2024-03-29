// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        require(balance >= _withdrawAmount, "Insufficient balance");

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }
}
