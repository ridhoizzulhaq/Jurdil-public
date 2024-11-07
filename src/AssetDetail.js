// AssetDetail.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Web3 from 'web3';

const AssetDetail = () => {
  const { nid } = useParams(); // This will be used as the `NID`
  const [village, setVillage] = useState('');
  const [pollingPalace, setPollingPalace] = useState('');
  const [candidate1, setCandidate1] = useState('');
  const [candidate2, setCandidate2] = useState('');
  const [candidate3, setCandidate3] = useState('');
  const [locationInfo, setLocationInfo] = useState(null);
  const [pollingPalaceId, setPollingPalaceId] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);

  const contractAddress = '0x94650136923AC64DC428a090c253cFE26Ac18C04';

  // Contract ABI
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "pollId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "nid",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "candidate1Votes",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "candidate2Votes",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "candidate3Votes",
          "type": "uint256"
        }
      ],
      "name": "PollCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "pollId",
          "type": "uint256"
        }
      ],
      "name": "getPollResults",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "polls",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "candidate1Votes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidate2Votes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidate3Votes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nid",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "pollId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "nid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidate1Votes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidate2Votes",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "candidate3Votes",
          "type": "uint256"
        }
      ],
      "name": "storePoll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const web3 = new Web3(window.ethereum);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
        setError("MetaMask is not installed. Please install it to continue.");
        return;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const userAccount = accounts[0];

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Hash the `nid` for the smart contract
        const hashedNid = web3.utils.keccak256(nid);

        const candidate1Votes = parseInt(candidate1) || 0;
        const candidate2Votes = parseInt(candidate2) || 0;
        const candidate3Votes = parseInt(candidate3) || 0;

        // Send the hashed `nid` to the smart contract
        const transaction = contract.methods.storePoll(
            pollingPalaceId,
            hashedNid,
            candidate1Votes,
            candidate2Votes,
            candidate3Votes
        );

        const gas = await transaction.estimateGas({ from: userAccount });
        const gasPrice = await web3.eth.getGasPrice();

        const tx = await transaction.send({
            from: userAccount,
            gas,
            gasPrice
        });

        console.log('Transaction successful:', tx.transactionHash);

        // Send the original, unhashed `nid` to the backend for storage in the database
        const response = await fetch('http://localhost:5001/storePoll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pollId: pollingPalaceId,
                nid,  // Send the original `nid` (unhashed)
                candidate1Votes,
                candidate2Votes,
                candidate3Votes,
                transactionHash: tx.transactionHash
            })
        });

        const result = await response.json();
        if (result.success) {
            alert('Poll data submitted successfully and stored in database.');
        } else {
            alert('Error storing data in database.');
        }

    } catch (error) {
        console.error('Error submitting poll data:', error);
        setError(error.message || 'Error submitting poll data. Please try again.');
    }
};


  const fetchLocationInfo = async () => {
    if (village.trim()) {
      try {
        const response = await fetch(`https://kodepos.vercel.app/search/?q=${village.replace(/\s+/g, '')}`);
        
        if (!response.ok) throw new Error('Failed to fetch location information.');

        const result = await response.json();

        if (result.statusCode === 200 && result.data.length > 0) {
          const { village, district, regency, province, code } = result.data[0];
          setLocationInfo({ village, district, regency, province });
          
          if (pollingPalace) {
            const formattedPollingPalace = pollingPalace.padStart(3, '0');
            setPollingPalaceId(`${code}${formattedPollingPalace}`);
          }

          setError(null);
        } else {
          setLocationInfo(null);
          setPollingPalaceId('');
          setError("Location information not found.");
        }
      } catch (err) {
        console.error('Error fetching location data:', err);
        setError("Failed to fetch location information.");
      }
    } else {
      setError("Please enter a village name to search.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Asset Detail</h3>
      <p><strong>NID:</strong> {nid}</p>

      <Button variant="primary" onClick={() => window.open(`/fullscreen-viewer/${nid}`, '_blank')} className="mb-4">
        Open Image on New Tab
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="village" className="form-label">Village</label>
          <input
            type="text"
            className="form-control"
            id="village"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pollingPalace" className="form-label">Polling Palace Number</label>
          <input
            type="text"
            className="form-control"
            id="pollingPalace"
            value={pollingPalace}
            maxLength="3"
            onChange={(e) => setPollingPalace(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={fetchLocationInfo} className="mb-4">
          Search
        </Button>

        {locationInfo && (
          <div className="mt-3">
            <h5>Location Information</h5>
            <p><strong>Village:</strong> {locationInfo.village}</p>
            <p><strong>District:</strong> {locationInfo.district}</p>
            <p><strong>Regency:</strong> {locationInfo.regency}</p>
            <p><strong>Province:</strong> {locationInfo.province}</p>
            <p><strong>Polling Palace ID:</strong> {pollingPalaceId}</p>
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}

        <div className="mb-3">
          <label htmlFor="candidate1" className="form-label">Candidate 1</label>
          <input
            type="text"
            className="form-control"
            id="candidate1"
            value={candidate1}
            onChange={(e) => setCandidate1(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="candidate2" className="form-label">Candidate 2</label>
          <input
            type="text"
            className="form-control"
            id="candidate2"
            value={candidate2}
            onChange={(e) => setCandidate2(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="candidate3" className="form-label">Candidate 3</label>
          <input
            type="text"
            className="form-control"
            id="candidate3"
            value={candidate3}
            onChange={(e) => setCandidate3(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {transactionHash && (
        <div className="mt-3 alert alert-success">
          Transaction successful! Hash: <a href={`https://etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">{transactionHash}</a>
        </div>
      )}
      {successMessage && <p className="text-success mt-2">{successMessage}</p>}
    </div>
  );
};

export default AssetDetail;
