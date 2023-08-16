import { useState, useEffect } from "react"; //NEEDED FOR FRONT END
import { ethers } from "ethers";//JAVASCRIPT LIBRARY
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";//FILE GENERATED AT SMART CONTRACTS

export default function HomePage() {
  const [ethereumProvider, setEthereumProvider] = useState(undefined);//PART OF REACT
  const [userAccount, setUserAccount] = useState(undefined);
  const [atmContract, setATMContract] = useState(undefined);
  const [accountBalance, setAccountBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getEthereumProvider = async () => {
    if (window.ethereum) {
      setEthereumProvider(window.ethereum);
    }

    if (ethereumProvider) {
      const accounts = await ethereumProvider.request({ method: "eth_accounts" });
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
    if (!ethereumProvider) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethereumProvider.request({ method: "eth_requestAccounts" });
    handleUserAccount(accounts);
    
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereumProvider);
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
    if (!ethereumProvider) {
      return <p>Please install MetaMask to use this ATM.</p>;
    }

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
      <div className="user-box">
        <p className="user-info">Your Account: {userAccount}</p>
        <p className="user-info">Your Balance: {accountBalance} ETH</p>
        <div className="action-buttons">
          <button onClick={depositFunds} className="action-button">Deposit 1 ETH</button>
          <button onClick={withdrawFunds} className="action-button">Withdraw 1 ETH</button>
          <button className="action-button">View Transaction History</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getEthereumProvider();
  }, []);

  return (
    <main className="container">
      <header className="header-box">
        <h1 className="title">Welcome to the Beautiful Metacrafters ATM!</h1>
        <p className="subtitle">Empowering Your Digital Banking Experience</p>
      </header>
      {renderUserInterface()}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: "Arial", sans-serif;
          background-color: #101010;
          color: #ffffff;
        }

        .header-box {
          background-color: #6600cc;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 20px;
        }

        .title {
          font-weight: bold;
          font-size: 32px;
          margin: 0;
        }

        .subtitle {
          font-size: 20px;
          margin: 0;
        }

        .user-box {
          background-color: #ff3333;
          color: #ffffff;
          font-weight: bold;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
          text-align: center;
        }

        .user-info {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }

        .action-button {
          margin: 5px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #3399ff;
          color: #ffffff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .action-button:hover {
          background-color: #0066cc;
        }
      `}</style>
    </main>
  );
}
