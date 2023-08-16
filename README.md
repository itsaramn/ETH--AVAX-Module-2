# ETH--AVAX-Module-2


## METACRAFTERS ATM
This project consists of a simple decentralized application (DApp) that interacts with a smart contract deployed on the Ethereum blockchain. The smart contract simulates an ATM-like functionality where users can deposit and withdraw Ether.


## Getting Started
The smart contract is implemented in Solidity and provides the following functionalities:

#### Constructor: Initializes the contract with an owner and an initial balance.

#### getBalance: Returns the current account balance.

#### deposit: Allows the owner to deposit funds into the contract.

#### withdraw: Allows the owner to withdraw funds from the contract, subject to sufficient balance.


## Frontend
The frontend of the DApp is built using React and interacts with the Ethereum blockchain through the ethers.js library. Users can connect their MetaMask wallet, view their account balance, deposit and withdraw funds.

#### How it Works

1. The DApp checks for the presence of MetaMask and prompts the user to connect if not already connected.

2. Once connected, the user's account address is displayed, along with their account balance.

3. Users can deposit or withdraw 1 ETH at a time by clicking the respective buttons.


## Code

```
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethereum, setEthereum] = useState(undefined);
  const [userAccount, setUserAccount] = useState(undefined);
  const [atmContract, setATMContract] = useState(undefined);
  const [accountBalance, setAccountBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const connectToEthereum = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      handleUserAccount(accounts[0]);
    }
  };

  const handleUserAccount = (account) => {
    if (account) {
      console.log("Account connected:", account);
      setUserAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectUserAccount = async () => {
    if (!ethereum) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    handleUserAccount(accounts);
    
    // Once wallet is set, get a reference to the deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const atm = new ethers.Contract(contractAddress, atmABI, signer);

    setATMContract(atm);
  };

  const getAccountBalance = async () => {
    if (atmContract) {
      setAccountBalance((await atmContract.getBalance()).toNumber());
    }
  };

  const depositFunds = async () => {
    if (atmContract) {
      let tx = await atmContract.deposit(1);
      await tx.wait();
      getAccountBalance();
    }
  };

  const withdrawFunds = async () => {
    if (atmContract) {
      let tx = await atmContract.withdraw(1);
      await tx.wait();
      getAccountBalance();
    }
  };

  const renderUserInterface = () => {
    // Check if MetaMask is available
    if (!ethereum) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

    // Check if user is connected. If not, prompt to connect
    if (!userAccount) {
      return (
        <button onClick={connectUserAccount} className="connect-button">
          Please connect your MetaMask wallet
        </button>
      );
    }

    if (accountBalance === undefined) {
      getAccountBalance();
    }

    return (
      <div>
        <p className="user-info">Your Account: {userAccount}</p>
        <p className="user-info">Your Balance: {accountBalance} ETH</p>
        <button onClick={depositFunds} className="action-button">
          Deposit 1 ETH
        </button>
        <button onClick={withdrawFunds} className="action-button">
          Withdraw 1 ETH
        </button>
        <button className="action-button">View Transaction History</button>
      </div>
    );
  };

  useEffect(() => {
    connectToEthereum();
  }, []);

  return (
    <main className="container">
      <header className="header-box">
        <h1 className="title">Welcome to the Metacrafters ATM!</h1>
        <p className="subtitle">The Future of Digital Banking</p>
      </header>
      {renderUserInterface()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: "Times New Roman", serif;
          background-color: black; /* Set background color to black */
          color: yellow; /* Set text color to yellow */
        }

        .header-box {
          background-color: #6844ca; /* Set header background color */
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
        }

        .title {
          font-weight: bold;
          font-size: 36px;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 20px;
        }

        .connect-button,
        .action-button {
          margin: 5px;
          padding: 10px 20px;
          font-size: 18px;
          background-color: #007bff;
          color: #fff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .action-button:hover {
          background-color: #0056b3;
        }

        .user-info {
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 20px;
        }
      `}
      </style>
    </main>
  );
}
```
# Execution

You want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.

After this, the project will be running on your localhost. 
Typically at http://localhost:3000/

## Authors 
Aryaman Semta

21bcs3853@cuchd.in

## Lisence
This project is licensed under the MIT License - see the LICENSE.md file for details
