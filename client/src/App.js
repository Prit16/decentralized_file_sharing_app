import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleError = (error) => {
    // Log the entire error object for debugging
    console.error('Full error object:', error);
    
    // Check if the error has a message or is an instance of Error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      alert(`An error occurred: ${error.message}`);
    } else {
      alert(`An unexpected error occurred: ${JSON.stringify(error, null, 2)}`);
    }
  };

  useEffect(() => {
    const loadProvider = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        if (!provider) throw new Error("Provider not initialized.");

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );

        setContract(contract);
        setProvider(provider);
      } catch (error) {
        handleError(error); // Call to error handling
      }
    };

    loadProvider();
  }, []);

  return (
    <>
      <div>
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>ECT Drive</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>

        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;
